import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HomeScreen } from './src/screens/HomeScreen';
import { ScanQRScreen } from './src/screens/ScanQRScreen';
import { PoiHubScreen } from './src/screens/PoiHubScreen';
import { PhoneLoginScreen } from './src/screens/PhoneLoginScreen';
import { PlaceSwitcher } from './src/components/PlaceSwitcher';
import { I18nProvider } from './src/i18n/I18nContext';
import { AuthProvider, useAuth } from './src/auth/AuthContext';
import { joinPoi } from './src/api/auth';
import { getPoi } from './src/api/pois';
import { getSavedPlaces, rememberPlace, type SavedPlace } from './src/storage/savedPlaces';
import type { Poi } from './src/api/types';

type Route =
  | { name: 'home' }
  | { name: 'scan' }
  | { name: 'signIn' }
  | { name: 'hub'; poi: Poi };

/**
 * Small hand-rolled navigation stack instead of react-navigation: the app
 * only has a handful of screens so far, and this keeps native dependencies
 * to a minimum for the demo. Revisit if the screen count grows.
 *
 * Everything under a POI is one route — `PoiHubScreen` switches between
 * the modules internally so its banner and tab bar never unmount.
 */
function AppRoutes() {
  const { me, refresh } = useAuth();
  const [stack, setStack] = useState<Route[]>([{ name: 'home' }]);
  const current = stack[stack.length - 1];

  // The places this device has visited, behind the banner's place name.
  const [places, setPlaces] = useState<SavedPlace[]>([]);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [switchingTo, setSwitchingTo] = useState<string | null>(null);
  const [switchFailed, setSwitchFailed] = useState(false);

  useEffect(() => {
    getSavedPlaces().then(setPlaces);
  }, []);

  function push(route: Route) {
    setStack((s) => [...s, route]);
  }

  function pop() {
    setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  }

  /**
   * Entering a place replaces the stack rather than growing it: with the
   * banner's back chevron gone, switching places over and over would
   * otherwise pile up routes nothing can pop.
   */
  function openPoi(poi: Poi) {
    rememberPlace(poi).then(setPlaces);
    // For a signed-in person, entering a place is also joining it, so "my
    // places" follows the account rather than the device. A failure here is
    // harmless: the device list above still remembers the place, exactly as
    // it did before there were accounts.
    if (me) {
      joinPoi(poi.qrCodeToken)
        .then(() => refresh())
        .catch(() => undefined);
    }
    setStack([{ name: 'home' }, { name: 'hub', poi }]);
    closeSwitcher();
  }

  function closeSwitcher() {
    setSwitcherOpen(false);
    setSwitchingTo(null);
    setSwitchFailed(false);
  }

  // Only the place's id is on the device, and it may have been renamed
  // since, so re-open it from the server rather than the cached copy.
  async function selectPlace(place: SavedPlace) {
    setSwitchingTo(place.id);
    setSwitchFailed(false);
    try {
      openPoi(await getPoi(place.id));
    } catch {
      setSwitchingTo(null);
      setSwitchFailed(true);
    }
  }

  // The scan and hub screens both put a dark/colored band behind the
  // status bar, so its text has to go light there.
  const statusBarStyle = current.name === 'home' ? 'auto' : 'light';

  return (
    <>
      {current.name === 'home' && (
        <HomeScreen
          onScanQR={() => push({ name: 'scan' })}
          onSignIn={() => push({ name: 'signIn' })}
          onOpenPoi={openPoi}
        />
      )}

      {current.name === 'scan' && <ScanQRScreen onBack={pop} onFound={openPoi} />}

      {current.name === 'signIn' && <PhoneLoginScreen onBack={pop} onSignedIn={pop} />}

      {current.name === 'hub' && (
        <>
          <PoiHubScreen
            poi={current.poi}
            onOpenPlaces={() => setSwitcherOpen(true)}
            onSignIn={() => push({ name: 'signIn' })}
          />
          <PlaceSwitcher
            visible={switcherOpen}
            places={places}
            currentPoiId={current.poi.id}
            busyPlaceId={switchingTo}
            failed={switchFailed}
            onSelect={selectPlace}
            onAddPlace={() => {
              closeSwitcher();
              push({ name: 'scan' });
            }}
            onGoAppHome={() => {
              closeSwitcher();
              setStack([{ name: 'home' }]);
            }}
            onClose={closeSwitcher}
          />
        </>
      )}

      <StatusBar style={statusBarStyle} />
    </>
  );
}

// AuthProvider has to sit above anything calling useAuth, so the routes
// live in their own component rather than in App itself.
export default function App() {
  return (
    <SafeAreaProvider>
      <I18nProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </I18nProvider>
    </SafeAreaProvider>
  );
}
