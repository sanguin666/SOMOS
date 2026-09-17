import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Screen } from '../components/Screen';
import { AccessibleText } from '../components/AccessibleText';
import { BackChevronIcon, BellIcon } from '../components/icons';
import { useI18n } from '../i18n/I18nContext';
import { colors, radii, spacing } from '../theme/theme';
import type { Poi } from '../api/types';

type Props = {
  poi: Poi;
  onBack: () => void;
};

type DemoEvent = {
  id: string;
  month: string;
  day: string;
  title: string;
  details: string;
  notify: boolean;
};

// No events module exists in the backend yet (only the donations/events
// subscription flags on a POI) — this list is demo content to show the
// screen's shape. A real events module would fetch these per POI.
const INITIAL_EVENTS: DemoEvent[] = [
  { id: '1', month: 'SEP', day: '21', title: 'Sunday Mass', details: '10:00 AM · Main Hall', notify: true },
  { id: '2', month: 'SEP', day: '28', title: 'Baptism Ceremony', details: '2:00 PM · Chapel', notify: false },
  { id: '3', month: 'OCT', day: '04', title: 'Community Potluck', details: '6:00 PM · Parish Hall', notify: false },
];

export function EventsScreen({ poi, onBack }: Props) {
  const { t } = useI18n();
  const [events, setEvents] = useState(INITIAL_EVENTS);

  function toggleNotify(id: string) {
    setEvents((current) => current.map((e) => (e.id === id ? { ...e, notify: !e.notify } : e)));
  }

  return (
    <Screen>
      <Pressable accessibilityRole="button" accessibilityLabel={t('common.back')} onPress={onBack} style={styles.iconButton}>
        <BackChevronIcon size={20} color={colors.text} />
      </Pressable>

      <View style={styles.titleBlock}>
        <AccessibleText variant="title">{t('events.title')}</AccessibleText>
        <AccessibleText variant="body" color={colors.textMuted}>
          {poi.name}
        </AccessibleText>
      </View>

      {events.map((event) => (
        <View key={event.id} style={styles.eventRow}>
          <View style={styles.dateChip}>
            <AccessibleText variant="caption" color="#FFFFFF" style={styles.dateMonth}>
              {event.month}
            </AccessibleText>
            <AccessibleText variant="bodyLarge" color="#FFFFFF" style={styles.dateDay}>
              {event.day}
            </AccessibleText>
          </View>

          <View style={styles.eventText}>
            <AccessibleText variant="bodyLarge" style={styles.eventTitle}>
              {event.title}
            </AccessibleText>
            <AccessibleText variant="caption">{event.details}</AccessibleText>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              event.notify
                ? t('events.notifyOn', { title: event.title })
                : t('events.notifyOff', { title: event.title })
            }
            onPress={() => toggleNotify(event.id)}
            style={[styles.bellButton, event.notify && styles.bellButtonActive]}
          >
            <BellIcon size={18} color={event.notify ? '#FFFFFF' : colors.textMuted} filled={event.notify} />
          </Pressable>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 9999,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBlock: {
    gap: spacing.xs,
    marginTop: spacing.sm,
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
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellButtonActive: {
    backgroundColor: colors.primary,
  },
});
