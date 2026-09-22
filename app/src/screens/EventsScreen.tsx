import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AccessibleText } from '../components/AccessibleText';
import { BellIcon, ChevronRightIcon, PlayIcon } from '../components/icons';
import { getEvents } from '../api/events';
import { useI18n } from '../i18n/I18nContext';
import { cardSurface, colors, minTouchTarget, radii, spacing } from '../theme/theme';
import type { Event, Poi } from '../api/types';

type Props = {
  poi: Poi;
  // Set only where the place also streams: the livestream has no button
  // of its own in the bottom menu, it sits at the top of this screen.
  onWatchLive?: () => void;
};

function formatDetails(event: Event): string {
  const time = new Date(event.startsAt).toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
  return event.location ? `${time} · ${event.location}` : time;
}

export function EventsScreen({ poi, onWatchLive }: Props) {
  const { t } = useI18n();
  const [events, setEvents] = useState<Event[] | null>(null);
  const [error, setError] = useState(false);
  // Which events the reader wants a reminder for — device-local only,
  // since there's no congregant account yet to attach a subscription to.
  const [notifying, setNotifying] = useState<Set<string>>(new Set());

  useEffect(() => {
    getEvents(poi.id)
      .then(setEvents)
      .catch(() => setError(true));
  }, [poi.id]);

  function toggleNotify(id: string) {
    setNotifying((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <>
      <View style={styles.titleBlock}>
        <AccessibleText variant="title">{t('events.title')}</AccessibleText>
      </View>

      {onWatchLive && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('events.watchLive')}
          onPress={onWatchLive}
          style={styles.liveCard}
        >
          <View style={styles.liveIcon}>
            <PlayIcon size={28} color={colors.primaryStrong} />
          </View>
          <View style={styles.liveText}>
            <AccessibleText variant="bodyLarge" color="#FFFFFF" style={styles.liveTitle}>
              {t('events.watchLive')}
            </AccessibleText>
            <AccessibleText variant="caption" color="rgba(255,255,255,0.9)">
              {t('events.watchLiveHint')}
            </AccessibleText>
          </View>
          <ChevronRightIcon size={22} color="#FFFFFF" />
        </Pressable>
      )}

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

      {!error && events?.length === 0 && (
        <AccessibleText variant="body" color={colors.textMuted}>
          {t('events.empty')}
        </AccessibleText>
      )}

      {events?.map((event) => {
        const startsAt = new Date(event.startsAt);
        const isNotifying = notifying.has(event.id);
        return (
          <View key={event.id} style={styles.eventRow}>
            <View style={styles.dateChip}>
              <AccessibleText variant="caption" color="#FFFFFF" style={styles.dateMonth}>
                {startsAt.toLocaleDateString(undefined, { month: 'short' }).toUpperCase()}
              </AccessibleText>
              <AccessibleText variant="bodyLarge" color="#FFFFFF" style={styles.dateDay}>
                {startsAt.getDate()}
              </AccessibleText>
            </View>

            <View style={styles.eventText}>
              <AccessibleText variant="bodyLarge" style={styles.eventTitle}>
                {event.title}
              </AccessibleText>
              <AccessibleText variant="caption">{formatDetails(event)}</AccessibleText>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={
                isNotifying
                  ? t('events.notifyOn', { title: event.title })
                  : t('events.notifyOff', { title: event.title })
              }
              onPress={() => toggleNotify(event.id)}
              style={[styles.bellButton, isNotifying && styles.bellButtonActive]}
            >
              <BellIcon size={18} color={isNotifying ? '#FFFFFF' : colors.textMuted} filled={isNotifying} />
            </Pressable>
          </View>
        );
      })}
    </>
  );
}

const styles = StyleSheet.create({
  titleBlock: {
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  liveCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    minHeight: minTouchTarget,
    borderRadius: radii.lg,
    backgroundColor: colors.primaryStrong,
  },
  liveIcon: {
    width: 52,
    height: 52,
    borderRadius: 9999,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveText: {
    flex: 1,
    gap: 2,
  },
  liveTitle: {
    fontWeight: '800',
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  dateChip: {
    width: 56,
    height: 56,
    borderRadius: radii.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateMonth: {
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  dateDay: {
    fontWeight: '800',
  },
  eventText: {
    flex: 1,
    gap: 2,
  },
  eventTitle: {
    fontWeight: '700',
  },
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    ...cardSurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellButtonActive: {
    backgroundColor: colors.primary,
  },
});
