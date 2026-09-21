import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HomeScreen } from './src/screens/HomeScreen';
import { ScanQRScreen } from './src/screens/ScanQRScreen';
import { PoiHubScreen } from './src/screens/PoiHubScreen';
import { I18nProvider } from './src/i18n/I18nContext';
import type { Poi } from './src/api/types';

type Route = { name: 'home' } | { name: 'scan' } | { name: 'hub'; poi: Poi };

/**
 * Small hand-rolled navigation stack instead of react-navigation: the app
 * only has a handful of screens so far, and this keeps native dependencies
 * to a minimum for the demo. Revisit if the screen count grows.
 *
 * Everything under a POI is one route — `PoiHubScreen` switches between
 * the modules internally so its banner and tab bar never unmount.
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

  // The scan and hub screens both put a dark/colored band behind the
  // status bar, so its text has to go light there.
  const statusBarStyle = current.name === 'home' ? 'auto' : 'light';

  return (
    <SafeAreaProvider>
      <I18nProvider>
        {current.name === 'home' && (
          <HomeScreen onScanQR={() => push({ name: 'scan' })} onOpenPoi={(poi) => push({ name: 'hub', poi })} />
        )}

        {current.name === 'scan' && (
          <ScanQRScreen onBack={pop} onFound={(poi) => push({ name: 'hub', poi })} />
        )}

        {current.name === 'hub' && <PoiHubScreen poi={current.poi} onBack={pop} />}

        <StatusBar style={statusBarStyle} />
      </I18nProvider>
    </SafeAreaProvider>
  );
}
