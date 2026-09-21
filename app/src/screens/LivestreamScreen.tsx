import { useEffect, useState } from 'react';
import { Linking, Pressable, StyleSheet, View } from 'react-native';
import { AccessibleText } from '../components/AccessibleText';
import { PlayIcon } from '../components/icons';
import { getLivestreams } from '../api/livestreams';
import { useI18n } from '../i18n/I18nContext';
import type { Livestream, Poi } from '../api/types';
import { colors, radii, spacing } from '../theme/theme';

type Props = {
  poi: Poi;
};

function formatDateTime(iso: string) {
  const date = new Date(iso);
  return `${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} · ${date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}`;
}

export function LivestreamScreen({ poi }: Props) {
  const { t } = useI18n();
  const [livestreams, setLivestreams] = useState<Livestream[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getLivestreams(poi.id)
      .then((result) => {
        if (!cancelled) setLivestreams(result);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [poi.id]);

  return (
    <>
      <View style={styles.titleBlock}>
        <AccessibleText variant="title">{t('livestream.title')}</AccessibleText>
      </View>

      {error && (
        <AccessibleText variant="body" color={colors.danger}>
          {t('livestream.error')}
        </AccessibleText>
      )}

      {!error && livestreams === null && (
        <AccessibleText variant="body" color={colors.textMuted}>
          {t('livestream.loading')}
        </AccessibleText>
      )}

      {livestreams?.map((item) => {
        const isLive = item.status === 'live';
        const isEnded = item.status === 'ended';
        return (
          <View key={item.id} style={styles.row}>
            <View style={[styles.badge, isLive ? styles.badgeLive : isEnded ? styles.badgeEnded : styles.badgeUpcoming]}>
              {isLive ? (
                <AccessibleText variant="caption" color="#FFFFFF" style={styles.liveLabel}>
                  {t('livestream.live')}
                </AccessibleText>
              ) : (
                <>
                  <AccessibleText variant="caption" color={isEnded ? colors.textMuted : '#FFFFFF'} style={styles.badgeMonth}>
                    {new Date(item.scheduledAt).toLocaleDateString(undefined, { month: 'short' }).toUpperCase()}
                  </AccessibleText>
                  <AccessibleText variant="bodyLarge" color={isEnded ? colors.text : '#FFFFFF'} style={styles.badgeDay}>
                    {new Date(item.scheduledAt).getDate()}
                  </AccessibleText>
                </>
              )}
            </View>

            <View style={styles.rowText}>
              <AccessibleText variant="bodyLarge" style={styles.rowTitle}>
                {item.title}
              </AccessibleText>
              <AccessibleText variant="caption">{formatDateTime(item.scheduledAt)}</AccessibleText>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={
                isEnded ? t('livestream.replayAria', { title: item.title }) : t('livestream.watchAria', { title: item.title })
              }
              onPress={() => Linking.openURL(item.url)}
              style={styles.watchButton}
            >
              <PlayIcon size={16} color={colors.primaryText} />
              <AccessibleText variant="caption" color={colors.primaryText} style={styles.watchLabel}>
                {isEnded ? t('livestream.replay') : t('livestream.watch')}
              </AccessibleText>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  badge: {
    width: 56,
    height: 56,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeUpcoming: {
    backgroundColor: colors.primary,
  },
  badgeEnded: {
    backgroundColor: colors.surface,
  },
  badgeLive: {
    backgroundColor: colors.danger,
  },
  badgeMonth: {
    letterSpacing: 0.5,
  },
  badgeDay: {
    fontWeight: '800',
  },
  liveLabel: {
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    fontWeight: '700',
  },
  watchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: 44,
    paddingHorizontal: spacing.md,
    borderRadius: 9999,
    backgroundColor: colors.primary,
  },
  watchLabel: {
    fontWeight: '700',
  },
});
