import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'ansae.session.v1';

/**
 * The signed-in congregant's access token, kept on the device so someone
 * who signs in once stays signed in — an audience that struggles with a
 * password should not be asked for an SMS code every time they open the
 * app. The token itself expires after a week (see the backend's
 * auth.module.ts), and the app signs out cleanly when it does.
 */
export async function getStoredToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(STORAGE_KEY);
  } catch {
    // Storage unavailable (a locked device, a browser with storage
    // blocked): treat it as signed out rather than failing to start.
    return null;
  }
}

export async function storeToken(token: string): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, token);
  } catch {
    // The session just won't survive a restart.
  }
}

export async function clearStoredToken(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing useful to do — the in-memory session is cleared either way.
  }
}
