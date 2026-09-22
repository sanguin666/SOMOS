import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { setAuthToken, setUnauthorizedHandler } from '../api/client';
import { getMe, type Me } from '../api/auth';
import { clearStoredToken, getStoredToken, storeToken } from '../storage/session';

type AuthState = {
  // False until the stored token has been read back and checked. Screens
  // wait for this rather than flashing a signed-out state at someone who
  // is, in fact, signed in.
  ready: boolean;
  me: Me | null;
  /**
   * Whether the signed-in person is staff at this place. Drives what the
   * app offers rather than what it allows — the backend's PoiAdminGuard is
   * what actually decides, and this only stops the app showing a button
   * that would come back 403.
   */
  isAdminOf: (poiId: string) => boolean;
  /**
   * Replaces the session with a fresh `me` the backend just returned —
   * what the settings menu does after saving a name or a picture, so the
   * change shows immediately instead of after a round trip.
   */
  applyMe: (me: Me) => void;
  signIn: (accessToken: string) => Promise<void>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

/**
 * The congregant session. Signing in is a phone number and a code sent by
 * SMS (see PhoneLoginScreen) — there's no password, which is deliberate for
 * an audience that mostly doesn't want to manage one.
 *
 * Reading a place's content never needs a session. Posting does, and so
 * does having "my places" follow the person instead of the device.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [me, setMe] = useState<Me | null>(null);

  const signOut = useCallback(async () => {
    setAuthToken(null);
    setMe(null);
    await clearStoredToken();
  }, []);

  const refresh = useCallback(async () => {
    try {
      setMe(await getMe());
    } catch {
      // A rejected token is handled by the unauthorized handler below; any
      // other failure (the backend being down) leaves the session alone so
      // it survives a flaky connection.
    }
  }, []);

  const signIn = useCallback(
    async (accessToken: string) => {
      setAuthToken(accessToken);
      await storeToken(accessToken);
      await refresh();
    },
    [refresh],
  );

  useEffect(() => {
    // The token can be rejected on any call, not just at startup — a
    // week-old session expiring mid-use looks like this.
    setUnauthorizedHandler(() => {
      void signOut();
    });
    return () => setUnauthorizedHandler(null);
  }, [signOut]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const stored = await getStoredToken();
      if (stored) {
        setAuthToken(stored);
        try {
          const restored = await getMe();
          if (!cancelled) setMe(restored);
        } catch {
          // Expired or refused: start signed out rather than half-signed-in.
          setAuthToken(null);
          await clearStoredToken();
        }
      }
      if (!cancelled) setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const isAdminOf = useCallback(
    (poiId: string) => (me?.adminPois ?? []).some((poi) => poi.id === poiId),
    [me],
  );

  const applyMe = useCallback((updated: Me) => {
    setMe(updated);
  }, []);

  const value = useMemo(
    () => ({ ready, me, isAdminOf, applyMe, signIn, signOut, refresh }),
    [ready, me, isAdminOf, applyMe, signIn, signOut, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
