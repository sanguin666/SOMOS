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

// A Mass has no end time; it counts as this many minutes long when
// working out whether it is still under way.
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
 * The week as a calendar: the seven days along the top, a dot under each
 * for every thing happening that day, and the chosen day below as a list,
 * one full-width row per event with its title and place written out in
 * full. It was an hour grid until 24 Sep 2026: side by side, overlapping
 * events cut their titles to a few letters (Seb).
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

  // Where "now" falls: before the first event still to come today.
  const nowIndex = sameDay(now, day) ? items.findIndex((o) => endOf(o) > now) : -1;

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
        <View style={styles.list}>
          {items.map((o, i) => {
            const tone = CATEGORY_COLORS[o.event.category] ?? CATEGORY_COLORS.other;
            const when = o.endsAt ? `${time(o.startsAt)} – ${time(o.endsAt)}` : null;
            const details = [when, o.event.location].filter(Boolean).join(' · ');
            const past = sameDay(now, day) && endOf(o) <= now;
            return (
              <View key={`${o.event.id}|${o.startsAt.toISOString()}`}>
                {i === nowIndex && <NowLine label={`${t('calendar.now')} ${time(now)}`} />}
                <View
                  accessible
                  accessibilityLabel={`${time(o.startsAt)}, ${o.event.title}${details ? `, ${details}` : ''}`}
                  style={[styles.row, i > 0 && i !== nowIndex && styles.rowDivider, past && styles.past]}
                >
                  <AccessibleText variant="bodyLarge" style={styles.rowTime}>
                    {time(o.startsAt)}
                  </AccessibleText>
                  <View style={[styles.rowEdge, { backgroundColor: tone.edge }]} />
                  <View style={styles.rowText}>
                    <AccessibleText variant="bodyLarge" style={styles.rowTitle}>
                      {o.event.title}
                    </AccessibleText>
                    {details !== '' && (
                      <AccessibleText variant="body" color={colors.textMuted}>
                        {details}
                      </AccessibleText>
                    )}
                  </View>
                </View>
              </View>
            );
          })}
          {sameDay(now, day) && nowIndex === -1 && (
            <NowLine label={`${t('calendar.now')} ${time(now)}`} />
          )}
        </View>
      )}
    </>
  );
}

function NowLine({ label }: { label: string }) {
  return (
    <View style={styles.now} accessible accessibilityLabel={label}>
      <View style={styles.nowDot} />
      <AccessibleText variant="caption" color={colors.primaryStrong} style={styles.nowLabel}>
        {label}
      </AccessibleText>
      <View style={styles.nowLine} />
    </View>
  );
}

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
  list: {
    ...cardSurface,
    borderRadius: radii.lg,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
  },
  rowDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  past: {
    opacity: 0.55,
  },
  rowTime: {
    fontWeight: '800',
    minWidth: 64,
  },
  rowEdge: {
    width: 5,
    alignSelf: 'stretch',
    borderRadius: 3,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    fontWeight: '800',
  },
  now: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
  },
  nowLabel: {
    fontWeight: '800',
  },
  nowLine: {
    flex: 1,
    height: 2,
    backgroundColor: colors.primary,
  },
  nowDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
});
