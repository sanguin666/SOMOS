import { Alert } from 'react-native';
import { Screen } from '../components/Screen';
import { AccessibleText } from '../components/AccessibleText';
import { AccessibleButton } from '../components/AccessibleButton';
import { spacing } from '../theme/theme';

/**
 * Demo screen for the accessibility foundations.
 * To be replaced by the real onboarding flow (QR code scan, etc.).
 */
export function HomeScreen() {
  return (
    <Screen>
      <AccessibleText variant="title">myPeople</AccessibleText>
      <AccessibleText variant="bodyLarge">
        Welcome. Choose an action below.
      </AccessibleText>

      <AccessibleButton
        label="Scan a place's QR code"
        onPress={() => Alert.alert('Coming soon', 'QR code scan')}
        style={{ marginTop: spacing.lg }}
      />
      <AccessibleButton
        label="My places"
        variant="secondary"
        onPress={() => Alert.alert('Coming soon', 'List of places')}
      />
    </Screen>
  );
}
