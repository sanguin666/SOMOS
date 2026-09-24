import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AccessibleText } from '../components/AccessibleText';
import { BackChevronIcon, ChevronRightIcon } from '../components/icons';
import { getEvents } from '../api/events';
import { occurrencesOnDay, startOfWeek, timeKey, type Occurrence } from '../utils/schedule';
import { useI18n } from '../i18n/I18nContext';
import { cardSurface, colors, minTouchTarget, radii, spacing } from '../theme/theme';
import type { Event, EventCategory, Poi } from '../api/types';

type Props = { poi: Poi };

const DAY_LOCALES: Record<string, string> = { en: 'en-GB', es: 'es-ES', fr: 'fr-FR' };

// How tall one hour is on the day's grid: room for a title and its time
// in the app's large text.
const HOUR_HEIGHT = 64;
// The grid runs from the hour of the day's first event to the end of its
// last, and never shows fewer hours than this, so a day with one Mass
// still reads as a slice of a day rather than a lone box.
const MIN_HOURS = 3;
// A Mass has no end time; it is drawn as a block of this many minutes.
const DEFAULT_MINUTES = 60;

// A pale fill and a strong edge per kind, so the kinds tell apart at a
// glance while the dark text on the fill stays easy to read.
const CATEGORY_COLORS: Record<EventCategory, { fill: string; edge: string }> = {
  mass: { fill: '#FBE3D9', edge: '#B8502E' },
  confession: { fill: '#EFE6FB', edge: '#6B4EA8' },
  adoration: { fill: '#E4F1E8', edge: '#2F7A4A' },
  prayer: { fill: '#E4F1E8', edge: '#2F7A4A' },
  office_hours: { fill: '#F1ECE4', edge: '#7A6A55' },
  other: { fill: '#FDF0D5', edge: '#A86A00' },
};

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function sameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function endOf(o: Occurrence): Date {
  return o.endsAt ?? new Date(o.startsAt.getTime() + DEFAULT_MINUTES * 60_000);
}

/**
 * Side by side where times overlap (the office open while a Mass starts):
 * each event gets a column within its group of overlapping events, and the
 * group's width is shared out between its columns.
 */
function layOut(items: Occurrence[]): Map<Occurrence, { column: number; columns: number }> {
  const placed = new Map<Occurrence, { column: number; columns: number }>();
  let group: Occurrence[] = [];
  let columnEnds: number[] = [];
  let groupEnd = 0;
  const close = () => {
    for (const o of group) placed.get(o)!.columns = columnEnds.length;
    group = [];
    columnEnds = [];
  };
  for (const o of items) {
    const start = o.startsAt.getTime();
    if (group.length && start >= groupEnd) close();
    let column = columnEnds.findIndex((end) => end <= start);
    if (column === -1) column = columnEnds.push(0) - 1;
    columnEnds[column] = endOf(o).getTime();
    groupEnd = Math.max(group.length ? groupEnd : 0, endOf(o).getTime());
    group.push(o);
    placed.set(o, { column, columns: 1 });
  }
  close();
  return placed;
}

/**
 * The week as a calendar: the seven days along the top, a dot under each
 * for every thing happening that day, and the chosen day's hours below,
 * each event a block at its time, the way a diary or Outlook shows a day.
 * One day at a time, so the text stays large enough to read.
 */
export function CalendarScreen({ poi }: Props) {
  const { t, language } = useI18n();
  const locale = DAY_LOCALES[language] ?? language;
  const [events, setEvents] = useState<Event[] | null>(null);
  const [error, setError] = useState(false);
  const [day, setDay] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });
  const now = new Date();

  useEffect(() => {
    getEvents(poi.id)
      .then(setEvents)
      .catch(() => setError(true));
  }, [poi.id]);

  const weekStart = startOfWeek(day);
  const week = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const date = addDays(weekStart, i);
        return { date, items: occurrencesOnDay(events ?? [], date) };
      }),
    [events, weekStart.getTime()],
  );
  const items = week.find((d) => sameDay(d.date, day))?.items ?? [];

  const firstHour = items.length ? Math.min(...items.map((o) => o.startsAt.getHours())) : 0;
  const lastEnd = Math.max(
    firstHour,
    ...items.map((o) => {
      const end = endOf(o);
      return sameDay(end, day) ? end.getHours() + (end.getMinutes() > 0 ? 1 : 0) : 24;
    }),
  );
  const lastHour = Math.min(24, Math.max(lastEnd, firstHour + MIN_HOURS));
  const layout = layOut(items);
  const [gridWidth, setGridWidth] = useState(0);
  const lane = Math.max(0, gridWidth - HOUR_LABEL_WIDTH - spacing.sm);
  const hours = Array.from({ length: lastHour - firstHour }, (_, i) => firstHour + i);
  const offset = (date: Date) => ((date.getHours() - firstHour) * 60 + date.getMinutes()) * (HOUR_HEIGHT / 60);

  const time = (date: Date) => timeKey(date);
  const weekLabel = t('calendar.weekOf', {
    date: weekStart.toLocaleDateString(locale, { day: 'numeric', month: 'long' }),
  });

  return (
    <>
      <View style={styles.weekHead}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('calendar.previousWeek')}
          onPress={() => setDay(addDays(day, -7))}
          style={styles.arrow}
        >
          <BackChevronIcon size={22} />
        </Pressable>
        <AccessibleText variant="bodyLarge" style={styles.weekLabel} accessibilityRole="header">
          {weekLabel}
        </AccessibleText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('calendar.nextWeek')}
          onPress={() => setDay(addDays(day, 7))}
          style={styles.arrow}
        >
          <ChevronRightIcon size={22} color={colors.text} />
        </Pressable>
      </View>

      <View style={styles.days} accessibilityRole="tablist">
        {week.map(({ date, items: dayItems }) => {
          const selected = sameDay(date, day);
          const isToday = sameDay(date, now);
          const long = date.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' });
          return (
            <Pressable
              key={date.toISOString()}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              accessibilityLabel={`${long}, ${
                dayItems.length ? t('calendar.itemsOnDay', { n: dayItems.length }) : t('calendar.nothing')
              }`}
              onPress={() => setDay(date)}
              style={[styles.day, selected && styles.daySelected]}
            >
              <AccessibleText
                variant="caption"
                color={selected ? '#FFFFFF' : colors.textMuted}
                style={styles.dayName}
              >
                {date.toLocaleDateString(locale, { weekday: 'short' }).replace('.', '')}
              </AccessibleText>
              <AccessibleText
                variant="body"
                color={selected ? '#FFFFFF' : colors.text}
                style={[styles.dayNumber, isToday && !selected && styles.today]}
              >
                {date.getDate()}
              </AccessibleText>
              <View style={styles.dots}>
                {dayItems.slice(0, 3).map((o, i) => (
                  <View
                    key={i}
                    style={[styles.dot, { backgroundColor: selected ? '#FFFFFF' : colors.primaryStrong }]}
                  />
                ))}
              </View>
            </Pressable>
          );
        })}
      </View>

      {error && (
        <AccessibleText variant="body" color={colors.danger}>
          {t('events.error')}
        </AccessibleText>
      )}
      {!error && events === null && (
        <AccessibleText variant="body" color={colors.textMuted}>
          {t('events.loading')}
        </AccessibleText>
      )}

      {events !== null && items.length === 0 && (
        <View style={styles.emptyCard}>
          <AccessibleText variant="body" color={colors.textMuted}>
            {t('calendar.nothing')}
          </AccessibleText>
        </View>
      )}

      {events !== null && items.length > 0 && (
        <View
          style={[styles.grid, { height: hours.length * HOUR_HEIGHT }]}
          onLayout={(e) => setGridWidth(e.nativeEvent.layout.width)}
        >
          {hours.map((hour, i) => (
            <View
              key={hour}
              style={[styles.hour, { top: i * HOUR_HEIGHT }, i === 0 && styles.firstHour]}
              importantForAccessibility="no-hide-descendants"
              accessibilityElementsHidden
            >
              <AccessibleText variant="caption" color={colors.textMuted} style={styles.hourLabel}>
                {`${String(hour).padStart(2, '0')}:00`}
              </AccessibleText>
            </View>
          ))}

          {items.map((o) => {
            const end = endOf(o);
            const top = offset(o.startsAt);
            const bottom = sameDay(end, day) ? offset(end) : hours.length * HOUR_HEIGHT;
            const { column, columns } = layout.get(o)!;
            const width = lane / columns;
            const tone = CATEGORY_COLORS[o.event.category] ?? CATEGORY_COLORS.other;
            const when = o.endsAt ? `${time(o.startsAt)} – ${time(o.endsAt)}` : time(o.startsAt);
            const details = o.event.location ? `${when} · ${o.event.location}` : when;
            return (
              <View
                key={`${o.event.id}|${o.startsAt.toISOString()}`}
                accessible
                accessibilityLabel={`${o.event.title}, ${details}`}
                style={[
                  styles.block,
                  {
                    top: top + 2,
                    left: HOUR_LABEL_WIDTH + column * width,
                    width: width - (columns > 1 ? 4 : 0),
                    minHeight: Math.max(bottom - top - 4, HOUR_HEIGHT - 8),
                    backgroundColor: tone.fill,
                    borderLeftColor: tone.edge,
                  },
                ]}
              >
                <AccessibleText variant="body" style={styles.blockTitle} numberOfLines={2}>
                  {o.event.title}
                </AccessibleText>
                <AccessibleText variant="caption" color={colors.text} numberOfLines={2}>
                  {details}
                </AccessibleText>
              </View>
            );
          })}

          {sameDay(now, day) && now.getHours() >= firstHour && now.getHours() < lastHour && (
            <View
              style={[styles.nowLine, { top: offset(now) }]}
              accessible
              accessibilityLabel={`${t('calendar.now')} ${time(now)}`}
            >
              <View style={styles.nowDot} />
            </View>
          )}
        </View>
      )}
    </>
  );
}

const HOUR_LABEL_WIDTH = 64;

const styles = StyleSheet.create({
  weekHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  weekLabel: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '800',
  },
  arrow: {
    width: minTouchTarget,
    height: minTouchTarget,
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  days: {
    flexDirection: 'row',
    gap: 4,
  },
  day: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
    minHeight: minTouchTarget,
  },
  daySelected: {
    backgroundColor: colors.primary,
  },
  dayName: {
    fontWeight: '700',
  },
  dayNumber: {
    fontWeight: '800',
  },
  today: {
    textDecorationLine: 'underline',
    textDecorationColor: colors.primary,
  },
  dots: {
    flexDirection: 'row',
    gap: 3,
    height: 6,
    marginTop: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  emptyCard: {
    ...cardSurface,
    borderRadius: radii.lg,
    padding: spacing.md,
  },
  grid: {
    ...cardSurface,
    borderRadius: radii.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  hour: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: HOUR_HEIGHT,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  firstHour: {
    borderTopWidth: 0,
  },
  hourLabel: {
    position: 'absolute',
    left: spacing.sm,
    top: 4,
    fontWeight: '700',
  },
  block: {
    position: 'absolute',
    borderRadius: radii.md,
    borderLeftWidth: 5,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  blockTitle: {
    fontWeight: '800',
  },
  nowLine: {
    position: 'absolute',
    left: HOUR_LABEL_WIDTH - 8,
    right: 0,
    height: 2,
    backgroundColor: colors.primary,
  },
  nowDot: {
    position: 'absolute',
    left: -5,
    top: -4,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
});
