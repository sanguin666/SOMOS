import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Screen } from '../components/Screen';
import { AccessibleText } from '../components/AccessibleText';
import { BackChevronIcon } from '../components/icons';
import { getAnnouncements } from '../api/announcements';
import type { Announcement, Poi } from '../api/types';
import { colors, radii, spacing } from '../theme/theme';

type Props = {
  poi: Poi;
  onBack: () => void;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function AnnouncementsScreen({ poi, onBack }: Props) {
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
    <Screen scroll>
      <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={onBack} style={styles.iconButton}>
        <BackChevronIcon size={20} color={colors.text} />
      </Pressable>

      <View style={styles.titleBlock}>
        <AccessibleText variant="title">Announcements</AccessibleText>
        <AccessibleText variant="body" color={colors.textMuted}>
          {poi.name}
        </AccessibleText>
      </View>

      {error && (
        <AccessibleText variant="body" color={colors.danger}>
          Couldn't load announcements. Pull up the app again to retry.
        </AccessibleText>
      )}

      {!error && announcements === null && (
        <AccessibleText variant="body" color={colors.textMuted}>
          Loading…
        </AccessibleText>
      )}

      {announcements?.length === 0 && (
        <AccessibleText variant="body" color={colors.textMuted}>
          No announcements yet.
        </AccessibleText>
      )}

      {announcements?.map((item) => {
        const expanded = expandedId === item.id;
        return (
          <Pressable
            key={item.id}
            accessibilityRole="button"
            accessibilityLabel={item.title}
            onPress={() => setExpandedId(expanded ? null : item.id)}
            style={styles.card}
          >
            <View style={styles.cardHeader}>
              <AccessibleText variant="bodyLarge" style={styles.cardTitle}>
                {item.title}
              </AccessibleText>
              <AccessibleText variant="caption">{formatDate(item.createdAt)}</AccessibleText>
            </View>
            <AccessibleText variant="body" color={colors.textMuted} numberOfLines={expanded ? undefined : 2}>
              {item.body}
            </AccessibleText>
          </Pressable>
        );
      })}
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
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.xs,
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
});
