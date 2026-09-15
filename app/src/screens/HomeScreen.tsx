import { Alert } from 'react-native';
import { Screen } from '../components/Screen';
import { AccessibleText } from '../components/AccessibleText';
import { AccessibleButton } from '../components/AccessibleButton';
import { spacing } from '../theme/theme';

/**
 * Écran de démonstration des fondations d'accessibilité.
 * À remplacer par le vrai flux d'onboarding (scan du QR code, etc.).
 */
export function HomeScreen() {
  return (
    <Screen>
      <AccessibleText variant="title">myChurch</AccessibleText>
      <AccessibleText variant="bodyLarge">
        Bienvenue. Choisissez une action ci-dessous.
      </AccessibleText>

      <AccessibleButton
        label="Scanner le QR code d'un lieu de culte"
        onPress={() => Alert.alert('À venir', 'Scan du QR code')}
        style={{ marginTop: spacing.lg }}
      />
      <AccessibleButton
        label="Mes lieux de culte"
        variant="secondary"
        onPress={() => Alert.alert('À venir', 'Liste des lieux de culte')}
      />
    </Screen>
  );
}
