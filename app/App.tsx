import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { HomeScreen } from './src/screens/HomeScreen';
import { ScanQRScreen } from './src/screens/ScanQRScreen';
import { PoiHubScreen } from './src/screens/PoiHubScreen';
import { DonateScreen } from './src/screens/DonateScreen';
import { EventsScreen } from './src/screens/EventsScreen';
import { AnnouncementsScreen } from './src/screens/AnnouncementsScreen';
import { PrayerRequestsScreen } from './src/screens/PrayerRequestsScreen';
import { LivestreamScreen } from './src/screens/LivestreamScreen';
import type { Poi } from './src/api/types';

type Route =
  | { name: 'home' }
  | { name: 'scan' }
  | { name: 'hub'; poi: Poi }
  | { name: 'donate'; poi: Poi }
  | { name: 'events'; poi: Poi }
  | { name: 'announcements'; poi: Poi }
  | { name: 'prayer-requests'; poi: Poi }
  | { name: 'livestream'; poi: Poi };

/**
 * Small hand-rolled navigation stack instead of react-navigation: the app
 * only has a handful of screens so far, and this keeps native dependencies
 * to a minimum for the demo. Revisit if the screen count grows.
 */
export default function App() {
  const [stack, setStack] = useState<Route[]>([{ name: 'home' }]);
  const current = stack[stack.length - 1];

  function push(route: Route) {
    setStack((s) => [...s, route]);
  }

  function pop() {
    setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  }

  return (
    <>
      {current.name === 'home' && (
        <HomeScreen onScanQR={() => push({ name: 'scan' })} onOpenPoi={(poi) => push({ name: 'hub', poi })} />
      )}

      {current.name === 'scan' && (
        <ScanQRScreen onBack={pop} onFound={(poi) => push({ name: 'hub', poi })} />
      )}

      {current.name === 'hub' && (
        <PoiHubScreen
          poi={current.poi}
          onBack={pop}
          onOpenDonate={() => push({ name: 'donate', poi: current.poi })}
          onOpenEvents={() => push({ name: 'events', poi: current.poi })}
          onOpenAnnouncements={() => push({ name: 'announcements', poi: current.poi })}
          onOpenPrayerRequests={() => push({ name: 'prayer-requests', poi: current.poi })}
          onOpenLivestream={() => push({ name: 'livestream', poi: current.poi })}
        />
      )}

      {current.name === 'donate' && <DonateScreen poi={current.poi} onBack={pop} />}

      {current.name === 'events' && <EventsScreen poi={current.poi} onBack={pop} />}

      {current.name === 'announcements' && <AnnouncementsScreen poi={current.poi} onBack={pop} />}

      {current.name === 'prayer-requests' && <PrayerRequestsScreen poi={current.poi} onBack={pop} />}

      {current.name === 'livestream' && <LivestreamScreen poi={current.poi} onBack={pop} />}

      <StatusBar style="auto" />
    </>
  );
}
