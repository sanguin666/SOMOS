import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { AccessibleText } from '../components/AccessibleText';
import { PlayIcon, PlusIcon } from '../components/icons';
import { getAnnouncements } from '../api/announcements';
import { API_BASE_URL } from '../api/client';
import { useI18n } from '../i18n/I18nContext';
import type { Announcement, Poi } from '../api/types';
import { colors, radii, spacing } from '../theme/theme';

type Props = {
  poi: Poi;
  onCompose: () => void;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function AnnouncementsScreen({ poi, onCompose }: Props) {
  const { t } = useI18n();
  const [announcements, setAnnouncements] = useState<Announcement[] | null>(null);
  const [error, setError] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getAnnouncements(poi.id)
      .then((result) => {
        if (!cancelled) setAnnouncements(result);
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
      <View style={styles.headerRow}>
        <AccessibleText variant="title">{t('announcements.title')}</AccessibleText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('announcements.newAria')}
          onPress={onCompose}
          style={styles.iconButton}
        >
          <PlusIcon size={20} color={colors.text} />
        </Pressable>
      </View>

      {error && (
        <AccessibleText variant="body" color={colors.danger}>
          {t('announcements.error')}
        </AccessibleText>
      )}

      {!error && announcements === null && (
        <AccessibleText variant="body" color={colors.textMuted}>
          {t('announcements.loading')}
        </AccessibleText>
      )}

      {announcements?.length === 0 && (
        <AccessibleText variant="body" color={colors.textMuted}>
          {t('announcements.empty')}
        </AccessibleText>
      )}

      {announcements?.map((item) => (
        <AnnouncementCard
          key={item.id}
          item={item}
          expanded={expandedId === item.id}
          onToggleExpand={() => setExpandedId(expandedId === item.id ? null : item.id)}
        />
      ))}
    </>
  );
}

function AnnouncementCard({
  item,
  expanded,
  onToggleExpand,
}: {
  item: Announcement;
  expanded: boolean;
  onToggleExpand: () => void;
}) {
  const { t } = useI18n();
  const audioSource = item.audioUrl ? `${API_BASE_URL}${item.audioUrl}` : undefined;
  const player = useAudioPlayer(audioSource);
  const playerStatus = useAudioPlayerStatus(player);

  // The audio button is a sibling of the expand-toggle Pressable rather than
  // nested inside it: react-native-web renders accessibilityRole="button"
  // as a real <button>, and a <button> inside a <button> is invalid HTML —
  // the browser's click handling for that is undefined, and it triggered a
  // React hydration warning.
  return (
    <View style={styles.card}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={item.title}
        onPress={onToggleExpand}
        style={styles.cardHeaderTouchable}
      >
        <View style={styles.cardHeader}>
          <AccessibleText variant="bodyLarge" style={styles.cardTitle}>
            {item.title}
          </AccessibleText>
          <AccessibleText variant="caption">{formatDate(item.createdAt)}</AccessibleText>
        </View>

        {!!item.body && (
          <AccessibleText variant="body" color={colors.textMuted} numberOfLines={expanded ? undefined : 2}>
            {item.body}
          </AccessibleText>
        )}
      </Pressable>

      {!!item.audioUrl && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={playerStatus.playing ? t('announcements.pauseVoice') : t('announcements.playVoice')}
          onPress={() => (playerStatus.playing ? player.pause() : player.play())}
          style={styles.audioButton}
        >
          <PlayIcon size={16} color="#FFFFFF" />
          <AccessibleText variant="caption" color="#FFFFFF" style={styles.audioLabel}>
            {playerStatus.playing ? t('announcements.pauseVoice') : t('announcements.playVoice')}
          </AccessibleText>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
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
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  cardHeaderTouchable: {
    gap: spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  cardTitle: {
    fontWeight: '700',
    flex: 1,
  },
  audioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    minHeight: 44,
    borderRadius: 9999,
    backgroundColor: colors.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
  },
  audioLabel: {
    fontWeight: '700',
  },
});
