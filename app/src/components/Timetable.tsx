import { StyleSheet, View } from 'react-native';
import { AccessibleText } from './AccessibleText';
import {
  formatDays,
  timeKey,
  weekdayName,
  type MonthlyRule,
  type TimetableNote,
  type TimetableRow,
  type TimetableSection,
} from '../utils/schedule';
import { useI18n } from '../i18n/I18nContext';
import { cardSurface, colors, radii, spacing } from '../theme/theme';

/**
 * One kind of celebration's weekly times, as one white card: its name on
 * top, then a line per run of days, told apart by hairlines. The days sit
 * on the left and the times on the right, the way a church door lists
 * them.
 */
export function TimetableCard({ section }: { section: TimetableSection }) {
  const { t } = useI18n();
  return (
    <View style={styles.card}>
      <AccessibleText variant="bodyLarge" style={styles.heading}>
        {t(`schedule.category_${section.category}`)}
      </AccessibleText>
      <TimetableRows rows={section.rows} notes={section.notes} />
    </View>
  );
}

/**
 * The whole weekly timetable in one white card, kept tight: each kind of
 * celebration a small heading over its lines, the kinds split by a
 * hairline. For the Events page, where the week has to fit on a screen.
 */
export function CompactTimetable({ sections }: { sections: TimetableSection[] }) {
  const { t } = useI18n();
  return (
    <View style={styles.compactCard}>
      {sections.map((section, index) => (
        <View key={section.category} style={[styles.group, index > 0 && styles.groupDivider]}>
          <AccessibleText variant="body" style={styles.heading}>
            {t(`schedule.category_${section.category}`)}
          </AccessibleText>
          <TimetableRows rows={section.rows} notes={section.notes} compact />
        </View>
      ))}
    </View>
  );
}

const NTH_KEYS: Record<string, 'schedule.nth_1' | 'schedule.nth_2' | 'schedule.nth_3' | 'schedule.nth_4' | 'schedule.nth_last'> = {
  '1': 'schedule.nth_1',
  '2': 'schedule.nth_2',
  '3': 'schedule.nth_3',
  '4': 'schedule.nth_4',
  '-1': 'schedule.nth_last',
};

const DATE_LOCALES: Record<string, string> = { en: 'en-GB', es: 'es-ES', fr: 'fr-FR' };

/**
 * The lines of a timetable, for a card that brings its own heading, then
 * the days off coming up: "Not on Wednesday 11 November at 08:30".
 */
export function TimetableRows({
  rows,
  notes = [],
  compact = false,
}: {
  rows: TimetableRow[];
  notes?: TimetableNote[];
  compact?: boolean;
}) {
  const { t, language } = useI18n();
  const monthlyLabel = (rule: MonthlyRule) => {
    const text =
      rule.day != null
        ? t('schedule.monthlyDay', { day: rule.day })
        : t('schedule.monthlyNth', {
            nth: t(NTH_KEYS[String(rule.week)] ?? 'schedule.nth_1'),
            weekday: weekdayName(rule.weekday ?? 0, language),
          });
    return text.charAt(0).toLocaleUpperCase() + text.slice(1);
  };
  return (
    <>
      {rows.map((row) => {
        const days = row.monthly ? monthlyLabel(row.monthly) : formatDays(row.days, language);
        const times = row.times.join(' · ');
        return (
          <View
            key={days}
            style={compact ? styles.compactRow : styles.row}
            accessible
            accessibilityLabel={`${days}: ${row.times.join(', ')}`}
          >
            <AccessibleText variant="body" style={styles.days}>
              {days}
            </AccessibleText>
            <AccessibleText variant="body" style={styles.times}>
              {times}
            </AccessibleText>
          </View>
        );
      })}
      {notes.map((note) => {
        const date = note.startsAt.toLocaleDateString(DATE_LOCALES[language] ?? language, {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
        });
        const values = { date, time: timeKey(note.startsAt), reason: note.reason ?? '' };
        return (
          <AccessibleText
            key={note.startsAt.toISOString()}
            variant="body"
            color={colors.primaryStrong}
            style={styles.note}
          >
            {t(note.reason ? 'schedule.dayOffReason' : 'schedule.dayOff', values)}
          </AccessibleText>
        );
      })}
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    ...cardSurface,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  heading: {
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  compactCard: {
    ...cardSurface,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
  },
  group: {
    paddingVertical: spacing.sm,
  },
  groupDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  compactRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingVertical: 2,
  },
  days: {
    flexShrink: 1,
  },
  note: {
    fontWeight: '700',
    paddingVertical: spacing.xs,
  },
  times: {
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
});
