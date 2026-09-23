import { StyleSheet, View } from 'react-native';
import { AccessibleText } from './AccessibleText';
import { formatDays, type TimetableRow, type TimetableSection } from '../utils/schedule';
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
      <TimetableRows rows={section.rows} />
    </View>
  );
}

/** The lines of a timetable, for a card that brings its own heading. */
export function TimetableRows({ rows }: { rows: TimetableRow[] }) {
  const { language } = useI18n();
  return (
    <>
      {rows.map((row) => {
        const days = formatDays(row.days, language);
        const times = row.times.join(' · ');
        return (
          <View
            key={row.days.join()}
            style={styles.row}
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
  days: {
    flexShrink: 1,
  },
  times: {
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
});
