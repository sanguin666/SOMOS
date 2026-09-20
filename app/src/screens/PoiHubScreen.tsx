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
import { getAnnouncements } from '../api/announcements';
import { getEvents } from '../api/events';
import type { ActiveModule, Announcement, Event, ModuleType, Poi } from '../api/types';
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

// How many recent announcements to preview on the landing feed — the full
// list is one tap away via "See all", so this stays short on purpose.
const ANNOUNCEMENT_PREVIEW_COUNT = 2;

function formatAnnouncementDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

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
  const [announcements, setAnnouncements] = useState<Announcement[] | null>(null);
  const [nextEvent, setNextEvent] = useState<Event | null>(null);
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
  const announcementsActive = hasModule('announcements');
  const eventsActive = hasModule('events');

  // The landing feed's content is best-effort: a failed fetch here just
  // means that section doesn't show, since every module stays reachable
  // from the pill row above regardless.
  useEffect(() => {
    if (!announcementsActive) return;
    let cancelled = false;
    getAnnouncements(poi.id)
      .then((result) => {
        if (!cancelled) setAnnouncements(result.slice(0, ANNOUNCEMENT_PREVIEW_COUNT));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [poi.id, announcementsActive]);

  useEffect(() => {
    if (!eventsActive) return;
    let cancelled = false;
    getEvents(poi.id)
      .then((result) => {
        if (cancelled) return;
        const now = Date.now();
        const upcoming = result
          .filter((e) => new Date(e.startsAt).getTime() >= now)
          .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
        setNextEvent(upcoming[0] ?? null);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [poi.id, eventsActive]);

  const tabBar =
    modules !== null && !noModulesActive ? (
      <View style={styles.tabBar}>
        {hasModule('donations') && (
          <TabBarItem icon={<HeartIcon size={22} color={poiTheme.accent} />} label={t('hub.donationsLabel')} onPress={onOpenDonate} />
        )}
        {hasModule('events') && (
          <TabBarItem icon={<CalendarIcon size={22} color={poiTheme.accent} />} label={t('hub.eventsLabel')} onPress={onOpenEvents} />
        )}
        {hasModule('announcements') && (
          <TabBarItem icon={<MegaphoneIcon size={22} color={poiTheme.accent} />} label={t('hub.announcementsLabel')} onPress={onOpenAnnouncements} />
        )}
        {hasModule('prayer_requests') && (
          <TabBarItem icon={<CandleIcon size={22} color={poiTheme.accent} />} label={t('hub.prayerRequestsLabel')} onPress={onOpenPrayerRequests} />
        )}
        {hasModule('livestreams') && (
          <TabBarItem icon={<PlayIcon size={22} color={poiTheme.accent} />} label={t('hub.livestreamLabel')} onPress={onOpenLivestream} />
        )}
        {hasModule('community') && (
          <TabBarItem icon={<ChatBubbleIcon size={22} color={poiTheme.accent} />} label={t('hub.communityLabel')} onPress={onOpenCommunity} />
        )}
      </View>
    ) : null;

  return (
    <Screen scroll footer={tabBar}>
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

      {nextEvent && (
        <Pressable accessibilityRole="button" accessibilityLabel={nextEvent.title} onPress={onOpenEvents} style={styles.eventCard}>
          <View style={[styles.eventDateChip, { backgroundColor: poiTheme.accent }]}>
            <AccessibleText variant="caption" color="#FFFFFF" style={styles.eventDateMonth}>
              {new Date(nextEvent.startsAt).toLocaleDateString(undefined, { month: 'short' }).toUpperCase()}
            </AccessibleText>
            <AccessibleText variant="bodyLarge" color="#FFFFFF" style={styles.eventDateDay}>
              {new Date(nextEvent.startsAt).getDate()}
            </AccessibleText>
          </View>
          <View style={styles.eventText}>
            <AccessibleText variant="caption" style={styles.sectionLabel}>
              {t('hub.nextEvent')}
            </AccessibleText>
            <AccessibleText variant="bodyLarge" style={styles.cardTitle}>
              {nextEvent.title}
            </AccessibleText>
          </View>
          <ChevronRightIcon size={20} color={colors.textMuted} />
        </Pressable>
      )}

      {announcements !== null && announcements.length > 0 && (
        <View style={styles.feedSection}>
          <View style={styles.feedSectionHeader}>
            <AccessibleText variant="caption" style={styles.sectionLabel}>
              {t('hub.latestAnnouncements')}
            </AccessibleText>
            <Pressable accessibilityRole="button" onPress={onOpenAnnouncements} style={styles.seeAllButton}>
              <AccessibleText variant="caption" color={poiTheme.accent} style={styles.seeAllLabel}>
                {t('hub.seeAll')}
              </AccessibleText>
              <ChevronRightIcon size={16} color={poiTheme.accent} />
            </Pressable>
          </View>

          {announcements.map((item) => (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              accessibilityLabel={item.title}
              onPress={onOpenAnnouncements}
              style={styles.feedCard}
            >
              <View style={styles.feedCardHeader}>
                <AccessibleText variant="bodyLarge" style={styles.cardTitle}>
                  {item.title}
                </AccessibleText>
                <AccessibleText variant="caption">{formatAnnouncementDate(item.createdAt)}</AccessibleText>
              </View>
              {item.body && (
                <AccessibleText variant="body" color={colors.textMuted} numberOfLines={2}>
                  {item.body}
                </AccessibleText>
              )}
            </Pressable>
          ))}
        </View>
      )}
    </Screen>
  );
}

function TabBarItem({ icon, label, onPress }: { icon: ReactNode; label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={styles.tabBarItem}>
      {icon}
      <AccessibleText variant="caption" numberOfLines={1} style={styles.tabBarLabel}>
        {label}
      </AccessibleText>
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
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xs,
    paddingTop: spacing.xs,
  },
  tabBarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    minHeight: 56,
  },
  tabBarLabel: {
    fontWeight: '700',
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    minHeight: 64,
  },
  eventDateChip: {
    width: 48,
    height: 48,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventDateMonth: {
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  eventDateDay: {
    fontWeight: '800',
  },
  eventText: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    fontWeight: '700',
  },
  feedSection: {
    gap: spacing.sm,
  },
  feedSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    minHeight: 32,
  },
  seeAllLabel: {
    fontWeight: '700',
  },
  feedCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  feedCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
});
