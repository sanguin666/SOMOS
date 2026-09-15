import { useEffect, useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Screen } from '../components/Screen';
import { AccessibleText } from '../components/AccessibleText';
import { BackChevronIcon, BellIcon, CalendarIcon, ChevronRightIcon, HeartIcon } from '../components/icons';
import { getActiveModules } from '../api/pois';
import type { ActiveModule, ModuleType, Poi } from '../api/types';
import { colors, radii, spacing } from '../theme/theme';

type Props = {
  poi: Poi;
  onBack: () => void;
  onOpenDonate: () => void;
  onOpenEvents: () => void;
};

export function PoiHubScreen({ poi, onBack, onOpenDonate, onOpenEvents }: Props) {
  const [modules, setModules] = useState<ActiveModule[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getActiveModules(poi.id)
      .then((result) => {
        if (!cancelled) setModules(result);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [poi.id]);

  const hasModule = (type: ModuleType) =>
    modules?.some((m) => m.moduleType === type && m.status !== 'expired' && m.status !== 'cancelled') ?? false;

  return (
    <Screen>
      <View style={styles.headerRow}>
        <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={onBack} style={styles.iconButton}>
          <BackChevronIcon size={20} color={colors.text} />
        </Pressable>
        <View style={styles.iconButton}>
          <BellIcon size={20} color={colors.text} />
        </View>
      </View>

      <View style={styles.titleBlock}>
        <AccessibleText variant="title">{poi.name}</AccessibleText>
        <AccessibleText variant="body" color={colors.textMuted}>
          {poi.city ?? 'Location not set'}
        </AccessibleText>
      </View>

      <AccessibleText variant="caption" style={styles.sectionLabel}>
        AVAILABLE HERE
      </AccessibleText>

      {error && (
        <AccessibleText variant="body" color={colors.danger}>
          Couldn't load what's available here. Pull up the app again to retry.
        </AccessibleText>
      )}

      {!error && modules === null && (
        <AccessibleText variant="body" color={colors.textMuted}>
          Loading…
        </AccessibleText>
      )}

      {modules !== null && !hasModule('donations') && !hasModule('events') && (
        <AccessibleText variant="body" color={colors.textMuted}>
          No modules are active for this place yet.
        </AccessibleText>
      )}

      {hasModule('donations') && (
        <ModuleCard
          icon={<HeartIcon size={24} />}
          title="Donations"
          subtitle="Give safely online"
          onPress={onOpenDonate}
        />
      )}

      {hasModule('events') && (
        <ModuleCard
          icon={<CalendarIcon size={24} />}
          title="Events"
          subtitle="See what's coming up"
          onPress={onOpenEvents}
        />
      )}
    </Screen>
  );
}

function ModuleCard({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={title} onPress={onPress} style={styles.card}>
      <View style={styles.cardIcon}>{icon}</View>
      <View style={styles.cardText}>
        <AccessibleText variant="bodyLarge" style={styles.cardTitle}>
          {title}
        </AccessibleText>
        <AccessibleText variant="caption">{subtitle}</AccessibleText>
      </View>
      <ChevronRightIcon size={20} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  sectionLabel: {
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginTop: spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    minHeight: 64,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 9999,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    fontWeight: '700',
  },
});
