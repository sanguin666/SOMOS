import { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Screen } from '../components/Screen';
import { AccessibleText } from '../components/AccessibleText';
import { AccessibleButton } from '../components/AccessibleButton';
import { getPoiByQrCode } from '../api/pois';
import { DEMO_QR_TOKEN } from '../demo';
import type { Poi } from '../api/types';
import { colors, spacing } from '../theme/theme';

type Props = {
  onScanQR: () => void;
  onOpenPoi: (poi: Poi) => void;
};

export function HomeScreen({ onScanQR, onOpenPoi }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function openMyPlaces() {
    setLoading(true);
    setError(false);
    try {
      const poi = await getPoiByQrCode(DEMO_QR_TOKEN);
      onOpenPoi(poi);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <AccessibleText variant="title">myPeople</AccessibleText>
      <AccessibleText variant="bodyLarge">
        Welcome. Choose an action below.
      </AccessibleText>

      {error && (
        <AccessibleText variant="body" color={colors.danger}>
          Couldn't reach the server. Check that the backend is running and try again.
        </AccessibleText>
      )}

      <AccessibleButton
        label="Scan a place's QR code"
        onPress={onScanQR}
        style={{ marginTop: spacing.lg }}
      />

      {loading ? (
        <View style={{ minHeight: 64, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : (
        <AccessibleButton label="My places" variant="secondary" onPress={openMyPlaces} />
      )}
    </Screen>
  );
}
