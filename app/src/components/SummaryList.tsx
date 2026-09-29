import type { ReactNode } from 'react';
import { Image, Pressable, View } from 'react-native';
import { AccessibleText } from './AccessibleText';
import { ChevronRightIcon } from './icons';
import { uploadUri } from '../api/client';
import { useI18n } from '../i18n/I18nContext';
import { dayHeading } from '../utils/schedule';
import { cardSurface, colors, radii, spacing, themedStyles } from '../theme/theme';

/**
 * A list grouped by day, in one white box: the Events tab's coming events
 * and the News tab's earlier posts. Each day opens with a small orange
 * heading ("Hoy", "Mañana", "Miércoles 30 sept"), then its rows: an
 * optional time on the left, the full title (it wraps, never cut), an
 * optional grey line under it, the photo on the right when there is one.
 */
export function SummaryList({ children }: { children: ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

/** Items in the order given, split wherever the calendar day changes. */
export function groupByDay<T>(items: T[], dateOf: (item: T) => Date): { date: Date; items: T[] }[] {
  const groups: { date: Date; items: T[] }[] = [];
  for (const item of items) {
    const date = dateOf(item);
    const last = groups[groups.length - 1];
    if (last && last.date.toDateString() === date.toDateString()) last.items.push(item);
    else groups.push({ date, items: [item] });
  }
  return groups;
}

/** The heading over one day's rows; every day but the first has a hairline above. */
export function SummaryDay({ date, first }: { date: Date; first: boolean }) {
  const { t, language } = useI18n();
  const text = dayHeading(date, new Date(), language, {
    today: t('schedule.today'),
    tomorrow: t('schedule.tomorrow'),
    yesterday: t('schedule.yesterday'),
  });
  return (
    <AccessibleText
      variant="caption"
      color={colors.primaryStrong}
      accessibilityRole="header"
      style={[styles.day, !first && styles.divider]}
    >
      {text}
    </AccessibleText>
  );
}

type RowProps = {
  // Drawn in the narrow column on the left: an event's time.
  lead?: string;
  title: string;
  detail?: string | null;
  // Shown above the title: the label of an important news post.
  above?: ReactNode;
  imageUrl?: string | null;
  onPress?: () => void;
  accessibilityLabel?: string;
  // Drawn in place of the chevron, e.g. the Events tab's bell.
  accessory?: ReactNode;
};

export function SummaryRow({ lead, title, detail, above, imageUrl, onPress, accessibilityLabel, accessory }: RowProps) {
  const content = (
    <>
      {!!lead && (
        <AccessibleText variant="body" color={colors.primaryStrong} style={styles.lead}>
          {lead}
        </AccessibleText>
      )}
      <View style={styles.text}>
        {above}
        <AccessibleText variant="body" style={styles.title}>
          {title}
        </AccessibleText>
        {!!detail && (
          <AccessibleText variant="caption" color={colors.textMuted}>
            {detail}
          </AccessibleText>
        )}
      </View>
      {!!imageUrl && <Image source={{ uri: uploadUri(imageUrl) }} style={styles.thumb} resizeMode="cover" />}
      {accessory ?? (onPress ? <ChevronRightIcon size={20} color={colors.textMuted} /> : null)}
    </>
  );
  if (!onPress) {
    return (
      <View style={styles.row} accessible accessibilityLabel={accessibilityLabel}>
        {content}
      </View>
    );
  }
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      onPress={onPress}
      style={styles.row}
    >
      {content}
    </Pressable>
  );
}

const styles = themedStyles(() => ({
  card: {
    ...cardSurface,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xs,
  },
  day: {
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingTop: spacing.sm + 2,
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    marginTop: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xs + 2,
  },
  // Wide enough for "20:00" at the largest text size the app offers.
  lead: {
    minWidth: 48,
    fontWeight: '800',
    alignSelf: 'flex-start',
  },
  text: {
    flex: 1,
    gap: 2,
    alignItems: 'flex-start',
  },
  title: {
    fontWeight: '700',
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: radii.md,
  },
}));
