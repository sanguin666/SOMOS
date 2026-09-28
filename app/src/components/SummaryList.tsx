import type { ReactNode } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { AccessibleText } from './AccessibleText';
import { ChevronRightIcon } from './icons';
import { uploadUri } from '../api/client';
import { useI18n } from '../i18n/I18nContext';
import { calendarPage } from '../utils/schedule';
import { cardSurface, colors, radii, spacing, themedStyles } from '../theme/theme';

/**
 * A summary as one white box of rows split by hairlines: the home page's
 * Mass times, coming events, news and livestream, and the Events tab's
 * coming events. Each row has its date on the left as a small calendar
 * page in orange text, the full title (it wraps, never cut), an optional
 * grey line under it, and the item's photo on the right when it has one.
 */
export function SummaryList({ children }: { children: ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

type RowProps = {
  // The day it happens or was posted, drawn as MIÉ / 30 / SEPT; or, for
  // a timetable line, a short label such as "Lun–sáb".
  date?: Date;
  label?: string;
  // Hide the weekday, for something already past (a news post).
  showWeekday?: boolean;
  title: string;
  detail?: string | null;
  // Shown before the title: the dot of an important news post.
  important?: boolean;
  imageUrl?: string | null;
  divider: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
  // Drawn in place of the chevron, e.g. the Events tab's bell.
  accessory?: ReactNode;
};

export function SummaryRow({
  date,
  label,
  showWeekday = true,
  title,
  detail,
  important = false,
  imageUrl,
  divider,
  onPress,
  accessibilityLabel,
  accessory,
}: RowProps) {
  const { language } = useI18n();
  const page = date ? calendarPage(date, language) : null;
  const content = (
    <>
      <View style={styles.dateColumn}>
        {page ? (
          <>
            {showWeekday && (
              <AccessibleText variant="caption" color={colors.primaryStrong} style={styles.dateSmall}>
                {page.weekday}
              </AccessibleText>
            )}
            <AccessibleText variant="bodyLarge" color={colors.primaryStrong} style={styles.dateDay}>
              {page.day}
            </AccessibleText>
            <AccessibleText variant="caption" color={colors.primaryStrong} style={styles.dateSmall}>
              {page.month}
            </AccessibleText>
          </>
        ) : (
          !!label && (
            <AccessibleText variant="caption" color={colors.primaryStrong} style={styles.label}>
              {label}
            </AccessibleText>
          )
        )}
      </View>
      <View style={styles.text}>
        <AccessibleText variant="body" style={styles.title}>
          {important && <Text style={styles.importantDot}>{'● '}</Text>}
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
      <View style={[styles.row, divider && styles.divider]} accessible accessibilityLabel={accessibilityLabel}>
        {content}
      </View>
    );
  }
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      onPress={onPress}
      style={[styles.row, divider && styles.divider]}
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
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  // Wide enough for "Lun–sáb" and "SEPT"; the calendar page is centred
  // in it, a label sits at its top.
  dateColumn: {
    width: 76,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  dateSmall: {
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    lineHeight: 20,
  },
  dateDay: {
    fontWeight: '800',
    lineHeight: 28,
  },
  label: {
    fontWeight: '800',
    textAlign: 'center',
    paddingTop: 2,
  },
  text: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontWeight: '700',
  },
  importantDot: {
    color: colors.primaryStrong,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: radii.md,
  },
}));
