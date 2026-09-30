import { Fragment, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { AccessibleButton } from '../components/AccessibleButton';
import { AccessibleText } from '../components/AccessibleText';
import { BackChevronIcon, ChevronRightIcon } from '../components/icons';
import { getReadings, getReadingsSettings, type DailyReading, type ReadingSection } from '../api/readings';
import { useI18n } from '../i18n/I18nContext';
import { intlLocale } from '../i18n/translations';
import type { Poi } from '../api/types';
import { cardSurface, colors, minTouchTarget, radii, spacing, themedStyles } from '../theme/theme';

/** The phone's own date, YYYY-MM-DD. */
function localDay(date = new Date()): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

/**
 * Lectures du jour: what the office gave members to read on each day,
 * today first, with the days before a tap away. The texts are the ones
 * the office typed or pasted; the button under them opens an official
 * site for the full readings, when the place set one.
 */
export function ReadingsScreen({ poi }: { poi: Poi }) {
  const { t, language } = useI18n();
  const today = localDay();
  const [days, setDays] = useState<DailyReading[] | null>(null);
  const [linkUrl, setLinkUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  // 0 is the newest day shown; higher goes back in time.
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    getReadings(poi.id, today)
      .then((list) => {
        if (!cancelled) setDays(list);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    getReadingsSettings(poi.id)
      .then((settings) => {
        if (!cancelled) setLinkUrl(settings.linkUrl);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [poi.id, today]);

  // Today always has a page, even before the office wrote anything: it
  // says so and still offers the official link.
  const pages: (DailyReading | { date: string; empty: true })[] =
    days === null ? [] : days[0]?.date === today ? days : [{ date: today, empty: true }, ...days];
  const page = pages[Math.min(index, Math.max(pages.length - 1, 0))];

  const dateLabel = (date: string) =>
    new Date(`${date}T12:00:00`).toLocaleDateString(intlLocale(language), {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });

  function openLink(date: string) {
    if (!linkUrl) return;
    WebBrowser.openBrowserAsync(linkUrl.replace(/\{date\}/g, date)).catch(() => undefined);
  }

  return (
    <>
      <View style={styles.titleBlock}>
        <AccessibleText variant="title" accessibilityRole="header">
          {t('readings.title')}
        </AccessibleText>
      </View>

      {failed ? (
        <AccessibleText variant="body" color={colors.textMuted}>
          {t('readings.loadError')}
        </AccessibleText>
      ) : !page ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <>
          <View style={styles.dateRow}>
            <DayButton
              direction="older"
              label={t('readings.previousDay')}
              disabled={index >= pages.length - 1}
              onPress={() => setIndex((i) => i + 1)}
            />
            <AccessibleText variant="bodyLarge" style={styles.date} accessibilityLiveRegion="polite">
              {page.date === today ? t('readings.today') : dateLabel(page.date)}
            </AccessibleText>
            <DayButton
              direction="newer"
              label={t('readings.nextDay')}
              disabled={index === 0}
              onPress={() => setIndex((i) => i - 1)}
            />
          </View>
          {page.date === today && (
            <AccessibleText variant="caption" color={colors.textMuted} style={styles.subDate}>
              {dateLabel(page.date)}
            </AccessibleText>
          )}

          {'empty' in page ? (
            <AccessibleText variant="body" color={colors.textMuted}>
              {t('readings.nothingToday')}
            </AccessibleText>
          ) : (
            <View style={styles.card}>
              {page.word ? (
                <View style={styles.section}>
                  <AccessibleText variant="body" style={styles.heading}>
                    {t('readings.word')}
                  </AccessibleText>
                  <AccessibleText variant="body" style={styles.word}>
                    {page.word}
                  </AccessibleText>
                </View>
              ) : null}
              {page.sections.map((section, i) => (
                <Fragment key={i}>
                  {(i > 0 || !!page.word) && <View style={styles.separator} />}
                  <Section section={section} />
                </Fragment>
              ))}
            </View>
          )}

          {linkUrl ? (
            <AccessibleButton label={t('readings.officialLink')} onPress={() => openLink(page.date)} />
          ) : null}
        </>
      )}
    </>
  );
}

function Section({ section }: { section: ReadingSection }) {
  const { t } = useI18n();
  const heading = section.title || t(`readings.kind_${section.kind}`);
  return (
    <View style={styles.section}>
      <View style={styles.headingRow}>
        <AccessibleText variant="body" style={styles.heading} accessibilityRole="header">
          {heading}
        </AccessibleText>
        {section.reference ? (
          <AccessibleText variant="caption" color={colors.textMuted} style={styles.reference}>
            {section.reference}
          </AccessibleText>
        ) : null}
      </View>
      <AccessibleText variant="body" style={styles.text}>
        {section.text}
      </AccessibleText>
    </View>
  );
}

function DayButton({
  direction,
  label,
  disabled,
  onPress,
}: {
  direction: 'older' | 'newer';
  label: string;
  disabled: boolean;
  onPress: () => void;
}) {
  const color = disabled ? colors.switchOff : colors.primaryStrong;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={styles.dayButton}
    >
      {direction === 'older' ? <BackChevronIcon size={22} color={color} /> : <ChevronRightIcon size={22} color={color} />}
    </Pressable>
  );
}

const styles = themedStyles(() => ({
  titleBlock: {
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  date: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '700',
  },
  subDate: {
    textAlign: 'center',
    marginTop: -spacing.sm,
  },
  dayButton: {
    width: minTouchTarget,
    height: minTouchTarget,
    borderRadius: minTouchTarget / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    ...cardSurface,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
  },
  section: {
    paddingVertical: spacing.md,
    gap: spacing.xs,
  },
  separator: {
    height: 1,
    backgroundColor: colors.primary,
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  heading: {
    color: colors.primaryStrong,
    fontWeight: '700',
  },
  reference: {
    fontStyle: 'italic',
  },
  word: {
    fontStyle: 'italic',
    lineHeight: 30,
  },
  text: {
    lineHeight: 30,
  },
}));
