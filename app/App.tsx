import { useEffect, useState } from 'react';
import { ActivityIndicator, BackHandler, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AddPlaceScreen } from './src/screens/AddPlaceScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { ScanQRScreen } from './src/screens/ScanQRScreen';
import { PoiHubScreen } from './src/screens/PoiHubScreen';
import { PhoneLoginScreen } from './src/screens/PhoneLoginScreen';
import { PlaceSwitcher } from './src/components/PlaceSwitcher';
import { PreviewApp, previewPoiId } from './src/preview/PreviewApp';
import { I18nProvider } from './src/i18n/I18nContext';
import { AuthProvider, useAuth } from './src/auth/AuthContext';
import { joinPoi, leavePoi, setLastActivePoi } from './src/api/auth';
import { getPoi } from './src/api/pois';
import { forgetPlace, getSavedPlaces, rememberPlace, type SavedPlace } from './src/storage/savedPlaces';
import { landingPoi } from './src/landing';
import { colors } from './src/theme/theme';
import type { Poi } from './src/api/types';

type Route =
  | { name: 'addPlace' }
  | { name: 'scan' }
  | { name: 'signIn' }
  | { name: 'hub'; poi: Poi };

/**
 * Small hand-rolled navigation stack instead of react-navigation: the app
 * only has a handful of screens so far, and this keeps native dependencies
 * to a minimum for the demo. Revisit if the screen count grows.
 *
 * Signing in comes before everything else now. Nobody reaches a place, or
 * the scanner, without an account — so the stack below only ever exists
 * for somebody signed in, and signing out empties it back to the welcome
 * screen.
 */
function AppRoutes() {
  const { ready, me, refresh } = useAuth();
  const [stack, setStack] = useState<Route[]>([]);
  // Whether the opening route has been worked out for this session. The
  // stack alone can't say: "empty" is also what signing out leaves.
  const [landed, setLanded] = useState(false);
  const current = stack[stack.length - 1];

  // The places this device has visited, merged under the ones the account
  // carries, so the switcher shows both.
  const [places, setPlaces] = useState<SavedPlace[]>([]);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [switchingTo, setSwitchingTo] = useState<string | null>(null);
  const [switchFailed, setSwitchFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getSavedPlaces().then((saved) => {
      if (cancelled) return;
      const fromAccount: SavedPlace[] = (me?.pois ?? []).map((poi) => ({
        id: poi.id,
        name: poi.name,
        city: poi.city,
        qrCodeToken: poi.qrCodeToken,
      }));
      const extra = saved.filter((place) => !fromAccount.some((mine) => mine.id === place.id));
      setPlaces([...fromAccount, ...extra]);
    });
    return () => {
      cancelled = true;
    };
  }, [me]);

  // Where the app opens. Runs once the stored session has been checked,
  // and again after signing in or out, since both change the answer.
  useEffect(() => {
    if (!ready) return;

    if (!me) {
      setStack([]);
      setLanded(false);
      return;
    }
    if (landed) return;

    const poi = landingPoi(me);
    setStack(poi ? [{ name: 'hub', poi }] : [{ name: 'addPlace' }]);
    setLanded(true);
  }, [ready, me, landed]);

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
    // Entering a place is also joining it and marking it as where this
    // person was last, so both follow the account rather than the device.
    // Either failing is harmless — the device list below still remembers
    // the place, exactly as it did before there were accounts.
    joinPoi(poi.qrCodeToken)
      .then(() => setLastActivePoi(poi.id))
      .then(() => refresh())
      .catch(() => undefined);
    setStack([{ name: 'hub', poi }]);
    closeSwitcher();
  }

  /**
   * Leaving the place somebody is currently in. The membership goes
   * first, then the device's own copy, and only then does the app work
   * out where to go: clearing `landed` hands that back to the effect
   * above, which lands on another place or on the add-a-place screen
   * exactly as it would at launch.
   *
   * Anything failing here is left to throw — the menu that called this
   * is the one showing the error, and it should not say "done" over a
   * membership that is still there.
   */
  async function leaveCurrentPoi(poi: Poi) {
    await leavePoi(poi.id);
    setPlaces(await forgetPlace(poi.id));
    await refresh();
    setLanded(false);
  }

  // Android's back button for everything outside a place: the switcher
  // closes first, then the stack pops. Returning false at the bottom of
  // the stack leaves the press to Android, which closes the app. The hub
  // registers its own handler for the screens inside a place.
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (switcherOpen) {
        closeSwitcher();
        return true;
      }
      if (stack.length > 1) {
        pop();
        return true;
      }
      return false;
    });
    return () => subscription.remove();
  }, [switcherOpen, stack.length]);

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

  // Only the camera fills the screen behind the status bar, so only the
  // scan screen needs light text up there.
  const statusBarStyle = current?.name === 'scan' ? 'light' : 'auto';

  return (
    <>
      {/* Nothing is decided until the stored session has been read back;
          flashing the welcome screen at somebody who is signed in is
          worse than a moment of nothing. */}
      {!ready && (
        <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center' }}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      )}

      {ready && !me && current?.name !== 'signIn' && (
        <OnboardingScreen
          onSignUp={() => push({ name: 'signIn' })}
          onSignIn={() => push({ name: 'signIn' })}
        />
      )}

      {ready && current?.name === 'signIn' && (
        <PhoneLoginScreen
          onBack={() => setStack((s) => s.filter((route) => route.name !== 'signIn'))}
          // Where to go next is not this screen's business: signing in
          // changes `me`, and the effect above lands the app.
          onSignedIn={() => setStack([])}
        />
      )}

      {ready && me && current?.name === 'addPlace' && (
        <AddPlaceScreen
          onScanQR={() => push({ name: 'scan' })}
          onOpenPoi={openPoi}
          onBack={places.length > 0 ? () => setSwitcherOpen(true) : undefined}
        />
      )}

      {ready && current?.name === 'scan' && <ScanQRScreen onBack={pop} onFound={openPoi} />}

      {ready && current?.name === 'hub' && (
        /* Keyed by the place, so entering a different one starts on its
           own home tab rather than wherever the last place was left —
           landing on another place's "More" menu after leaving one reads
           as nothing having happened. */
        <PoiHubScreen
          key={current.poi.id}
          poi={current.poi}
          onOpenPlaces={() => setSwitcherOpen(true)}
          onAddPlace={() => push({ name: 'scan' })}
          onLeavePlace={() => leaveCurrentPoi(current.poi)}
          onSignIn={() => push({ name: 'signIn' })}
        />
      )}

      {/* Reachable from the hub's banner and from the add-a-place screen
          alike, so it lives outside both rather than inside either. */}
      {ready && me && (
        <PlaceSwitcher
          visible={switcherOpen}
          places={places}
          currentPoiId={current?.name === 'hub' ? current.poi.id : ''}
          busyPlaceId={switchingTo}
          failed={switchFailed}
          onSelect={selectPlace}
          onAddPlace={() => {
            closeSwitcher();
            push({ name: 'scan' });
          }}
          onClose={closeSwitcher}
        />
      )}

      <StatusBar style={statusBarStyle} />
    </>
  );
}

// AuthProvider has to sit above anything calling useAuth, so the routes
// live in their own component rather than in App itself.
export default function App() {
  // Inside the dashboard's phone frame, the app shows one place and
  // nothing else: no welcome, no sign-in.
  const preview = previewPoiId();
  return (
    <SafeAreaProvider>
      <I18nProvider>
        <AuthProvider>
          {preview ? <PreviewApp poiId={preview} /> : <AppRoutes />}
        </AuthProvider>
      </I18nProvider>
    </SafeAreaProvider>
  );
}
