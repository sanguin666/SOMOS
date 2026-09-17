import { useEffect, useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Screen } from '../components/Screen';
import { AccessibleText } from '../components/AccessibleText';
import {
  BackChevronIcon,
  BellIcon,
  CalendarIcon,
  CandleIcon,
  ChatBubbleIcon,
  ChevronRightIcon,
  HeartIcon,
  MegaphoneIcon,
  PlaceGlyphIcon,
  PlayIcon,
} from '../components/icons';
import { getActiveModules } from '../api/pois';
import type { ActiveModule, ModuleType, Poi } from '../api/types';
import { colors, radii, spacing } from '../theme/theme';
import { getPoiTheme } from '../theme/poiThemes';
import { useI18n } from '../i18n/I18nContext';

type Props = {
  poi: Poi;
  onBack: () => void;
  onOpenDonate: () => void;
  onOpenEvents: () => void;
  onOpenAnnouncements: () => void;
  onOpenPrayerRequests: () => void;
  onOpenLivestream: () => void;
  onOpenCommunity: () => void;
};

const ALL_MODULE_TYPES: ModuleType[] = [
  'donations',
  'events',
  'announcements',
  'prayer_requests',
  'livestreams',
  'community',
];

export function PoiHubScreen({
  poi,
  onBack,
  onOpenDonate,
  onOpenEvents,
  onOpenAnnouncements,
  onOpenPrayerRequests,
  onOpenLivestream,
  onOpenCommunity,
}: Props) {
  const { t } = useI18n();
  const [modules, setModules] = useState<ActiveModule[] | null>(null);
  const [error, setError] = useState(false);
  const poiTheme = getPoiTheme(poi.type);

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

  const noModulesActive = modules !== null && !ALL_MODULE_TYPES.some(hasModule);

  return (
    <Screen scroll>
      <View style={[styles.hero, { backgroundColor: poiTheme.accent }]}>
        <View style={styles.heroGlyphWrap} pointerEvents="none">
          <PlaceGlyphIcon size={140} color="rgba(255,255,255,0.12)" />
        </View>

        <View style={styles.headerRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('common.back')}
            onPress={onBack}
            style={styles.iconButton}
          >
            <BackChevronIcon size={20} color="#FFFFFF" />
          </Pressable>
          <View style={styles.iconButton}>
            <BellIcon size={20} color="#FFFFFF" />
          </View>
        </View>

        <View style={styles.titleBlock}>
          <AccessibleText variant="title" color={poiTheme.accentText}>
            {poi.name}
          </AccessibleText>
          <AccessibleText variant="body" color="rgba(255,255,255,0.85)">
            {poi.city ?? t('hub.locationNotSet')}
          </AccessibleText>
        </View>
      </View>

      <AccessibleText variant="caption" style={styles.sectionLabel}>
        {t('hub.availableHere')}
      </AccessibleText>

      {error && (
        <AccessibleText variant="body" color={colors.danger}>
          {t('hub.errorLoad')}
        </AccessibleText>
      )}

      {!error && modules === null && (
        <AccessibleText variant="body" color={colors.textMuted}>
          {t('common.loading')}
        </AccessibleText>
      )}

      {noModulesActive && (
        <AccessibleText variant="body" color={colors.textMuted}>
          {t('hub.noModules')}
        </AccessibleText>
      )}

      {hasModule('donations') && (
        <ModuleCard
          icon={<HeartIcon size={24} />}
          accent={poiTheme.accent}
          title={t('hub.donationsTitle')}
          subtitle={t('hub.donationsSubtitle')}
          onPress={onOpenDonate}
        />
      )}

      {hasModule('events') && (
        <ModuleCard
          icon={<CalendarIcon size={24} />}
          accent={poiTheme.accent}
          title={t('hub.eventsTitle')}
          subtitle={t('hub.eventsSubtitle')}
          onPress={onOpenEvents}
        />
      )}

      {hasModule('announcements') && (
        <ModuleCard
          icon={<MegaphoneIcon size={24} />}
          accent={poiTheme.accent}
          title={t('hub.announcementsTitle')}
          subtitle={t('hub.announcementsSubtitle')}
          onPress={onOpenAnnouncements}
        />
      )}

      {hasModule('prayer_requests') && (
        <ModuleCard
          icon={<CandleIcon size={24} />}
          accent={poiTheme.accent}
          title={t('hub.prayerRequestsTitle')}
          subtitle={t('hub.prayerRequestsSubtitle')}
          onPress={onOpenPrayerRequests}
        />
      )}

      {hasModule('livestreams') && (
        <ModuleCard
          icon={<PlayIcon size={24} />}
          accent={poiTheme.accent}
          title={t('hub.livestreamTitle')}
          subtitle={t('hub.livestreamSubtitle')}
          onPress={onOpenLivestream}
        />
      )}

      {hasModule('community') && (
        <ModuleCard
          icon={<ChatBubbleIcon size={24} />}
          accent={poiTheme.accent}
          title={t('hub.communityTitle')}
          subtitle={t('hub.communitySubtitle')}
          onPress={onOpenCommunity}
        />
      )}
    </Screen>
  );
}

function ModuleCard({
  icon,
  accent,
  title,
  subtitle,
  onPress,
}: {
  icon: ReactNode;
  accent: string;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={title} onPress={onPress} style={styles.card}>
      <View style={[styles.cardIcon, { backgroundColor: accent }]}>{icon}</View>
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
  hero: {
    marginTop: -spacing.lg,
    marginHorizontal: -spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: radii.lg,
    borderBottomRightRadius: radii.lg,
    overflow: 'hidden',
    gap: spacing.lg,
  },
  heroGlyphWrap: {
    position: 'absolute',
    right: -24,
    bottom: -24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 9999,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBlock: {
    gap: spacing.xs,
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
    backgroundColor: colors.background,
    borderRadius: radii.lg,
    padding: spacing.lg,
    minHeight: 64,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 9999,
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
