import { useEffect, useState } from 'react';
import { PoiShell, hubMenu, type HubTab } from '../components/PoiShell';
import { AnnouncementsScreen } from './AnnouncementsScreen';
import { CommunityScreen } from './CommunityScreen';
import { CommunityThreadScreen } from './CommunityThreadScreen';
import { ComposeAnnouncementScreen } from './ComposeAnnouncementScreen';
import { DonateScreen } from './DonateScreen';
import { EventsScreen } from './EventsScreen';
import { LivestreamScreen } from './LivestreamScreen';
import { MoreScreen } from './MoreScreen';
import { PoiHomeScreen } from './PoiHomeScreen';
import { PrayerRequestsScreen } from './PrayerRequestsScreen';
import { useAuth } from '../auth/AuthContext';
import { getActiveModules } from '../api/pois';
import type { ActiveModule, CommunityPost, Poi } from '../api/types';

type Props = {
  poi: Poi;
  onOpenPlaces: () => void;
  onSignIn: () => void;
};

// A drill-down opened from within a tab. It replaces the tab's own content
// while the banner and tab bar stay exactly where they are — selecting any
// tab drops back to `list`.
type Drilldown =
  | { kind: 'list' }
  | { kind: 'compose-announcement' }
  | { kind: 'community-thread'; post: CommunityPost };

/**
 * Everything under one POI. The banner and the bottom menu live in
 * `PoiShell` and stay mounted for the whole visit: picking a module swaps
 * only what sits between them, so the chrome never moves and the selected
 * button is the one thing that changes.
 */
export function PoiHubScreen({ poi, onOpenPlaces, onSignIn }: Props) {
  const { isAdminOf } = useAuth();
  const isStaff = isAdminOf(poi.id);
  const [modules, setModules] = useState<ActiveModule[] | null>(null);
  const [tab, setTab] = useState<HubTab>('home');
  const [drilldown, setDrilldown] = useState<Drilldown>({ kind: 'list' });

  useEffect(() => {
    let cancelled = false;
    getActiveModules(poi.id)
      .then((result) => {
        if (!cancelled) setModules(result);
      })
      // The tab bar just stays empty on a failure — the home page below
      // still renders whatever it can.
      .catch(() => {
        if (!cancelled) setModules([]);
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
      onOpenPlaces={onOpenPlaces}
    >
      {tab === 'home' && <PoiHomeScreen poi={poi} modules={modules} onSelectTab={selectTab} />}

      {tab === 'more' && (
        <MoreScreen poi={poi} modules={modules} onSelectTab={selectTab} onOpenPlaces={onOpenPlaces} />
      )}

      {tab === 'donations' && <DonateScreen poi={poi} onDone={() => selectTab('home')} />}

      {tab === 'events' && (
        <EventsScreen
          poi={poi}
          onWatchLive={
            hubMenu(poi, modules).livestreamInEvents ? () => setTab('livestreams') : undefined
          }
        />
      )}

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
            canCompose={isStaff}
            onCompose={() => setDrilldown({ kind: 'compose-announcement' })}
          />
        ))}

      {tab === 'prayer_requests' && <PrayerRequestsScreen poi={poi} onSignIn={onSignIn} />}

      {tab === 'livestreams' && <LivestreamScreen poi={poi} />}

      {tab === 'community' &&
        (drilldown.kind === 'community-thread' ? (
          <CommunityThreadScreen
            poi={poi}
            post={drilldown.post}
            onBack={() => setDrilldown({ kind: 'list' })}
            onSignIn={onSignIn}
          />
        ) : (
          <CommunityScreen
            poi={poi}
            onOpenPost={(post) => setDrilldown({ kind: 'community-thread', post })}
            onSignIn={onSignIn}
          />
        ))}
    </PoiShell>
  );
}
