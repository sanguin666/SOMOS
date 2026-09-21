import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { PoiShell, type HubTab } from '../components/PoiShell';
import { AccessibleText } from '../components/AccessibleText';
import { ChevronRightIcon } from '../components/icons';
import { AnnouncementsScreen } from './AnnouncementsScreen';
import { CommunityScreen } from './CommunityScreen';
import { CommunityThreadScreen } from './CommunityThreadScreen';
import { ComposeAnnouncementScreen } from './ComposeAnnouncementScreen';
import { DonateScreen } from './DonateScreen';
import { EventsScreen } from './EventsScreen';
import { LivestreamScreen } from './LivestreamScreen';
import { PrayerRequestsScreen } from './PrayerRequestsScreen';
import { getActiveModules } from '../api/pois';
import { getAnnouncements } from '../api/announcements';
import { getEvents } from '../api/events';
import type { ActiveModule, Announcement, CommunityPost, Event, ModuleType, Poi } from '../api/types';
import { colors, radii, spacing } from '../theme/theme';
import { getPoiTheme } from '../theme/poiThemes';
import { useI18n } from '../i18n/I18nContext';

type Props = {
  poi: Poi;
  onBack: () => void;
};

// A drill-down opened from within a tab. It replaces the tab's own content
// while the banner and tab bar stay exactly where they are — selecting any
// tab drops back to `list`.
type Drilldown =
  | { kind: 'list' }
  | { kind: 'compose-announcement' }
  | { kind: 'community-thread'; post: CommunityPost };

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

/**
 * Everything under one POI. The banner and the module tab bar live in
 * `PoiShell` and stay mounted for the whole visit: picking a module swaps
 * only what sits between them, so the chrome never moves and the selected
 * tab is the one thing that changes.
 */
export function PoiHubScreen({ poi, onBack }: Props) {
  const [modules, setModules] = useState<ActiveModule[] | null>(null);
  const [error, setError] = useState(false);
  const [tab, setTab] = useState<HubTab>('home');
  const [drilldown, setDrilldown] = useState<Drilldown>({ kind: 'list' });

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

  function selectTab(next: HubTab) {
    setTab(next);
    setDrilldown({ kind: 'list' });
  }

  return (
    <PoiShell
      poi={poi}
      modules={modules}
      activeTab={tab}
      onSelectTab={selectTab}
      onBack={onBack}
    >
      {tab === 'home' && (
        <HubFeed poi={poi} modules={modules} error={error} onSelectTab={selectTab} />
      )}

      {tab === 'donations' && <DonateScreen poi={poi} onDone={() => selectTab('home')} />}

      {tab === 'events' && <EventsScreen poi={poi} />}

      {tab === 'announcements' &&
        (drilldown.kind === 'compose-announcement' ? (
          <ComposeAnnouncementScreen
            poi={poi}
            onBack={() => setDrilldown({ kind: 'list' })}
            onCreated={() => setDrilldown({ kind: 'list' })}
          />
        ) : (
          <AnnouncementsScreen
            poi={poi}
            onCompose={() => setDrilldown({ kind: 'compose-announcement' })}
          />
        ))}

      {tab === 'prayer_requests' && <PrayerRequestsScreen poi={poi} />}

      {tab === 'livestreams' && <LivestreamScreen poi={poi} />}

      {tab === 'community' &&
        (drilldown.kind === 'community-thread' ? (
          <CommunityThreadScreen
            poi={poi}
            post={drilldown.post}
            onBack={() => setDrilldown({ kind: 'list' })}
          />
        ) : (
          <CommunityScreen
            poi={poi}
            onOpenPost={(post) => setDrilldown({ kind: 'community-thread', post })}
          />
        ))}
    </PoiShell>
  );
}

/**
 * The hub's landing feed: what's coming up and what was just posted, with
 * everything else reachable from the tab bar below.
 */
function HubFeed({
  poi,
  modules,
  error,
  onSelectTab,
}: {
  poi: Poi;
  modules: ActiveModule[] | null;
  error: boolean;
  onSelectTab: (tab: HubTab) => void;
}) {
  const { t } = useI18n();
  const [announcements, setAnnouncements] = useState<Announcement[] | null>(null);
  const [nextEvent, setNextEvent] = useState<Event | null>(null);
  const poiTheme = getPoiTheme(poi.type);

  const hasModule = (type: ModuleType) =>
    modules?.some((m) => m.moduleType === type && m.status !== 'expired' && m.status !== 'cancelled') ?? false;

  const noModulesActive = modules !== null && !ALL_MODULE_TYPES.some(hasModule);
  const announcementsActive = hasModule('announcements');
  const eventsActive = hasModule('events');

  // The landing feed's content is best-effort: a failed fetch here just
  // means that section doesn't show, since every module stays reachable
  // from the tab bar regardless.
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

  return (
    <>
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
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={nextEvent.title}
          onPress={() => onSelectTab('events')}
          style={styles.eventCard}
        >
          <View style={[styles.eventDateChip, { backgroundColor: poiTheme.accentStrong }]}>
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
            <Pressable accessibilityRole="button" onPress={() => onSelectTab('announcements')} style={styles.seeAllButton}>
              <AccessibleText variant="caption" color={poiTheme.accentStrong} style={styles.seeAllLabel}>
                {t('hub.seeAll')}
              </AccessibleText>
              <ChevronRightIcon size={16} color={poiTheme.accentStrong} />
            </Pressable>
          </View>

          {announcements.map((item) => (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              accessibilityLabel={item.title}
              onPress={() => onSelectTab('announcements')}
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
    </>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
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
