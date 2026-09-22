import { useState } from 'react';
import { ActivityIndicator, StyleSheet, TextInput, View } from 'react-native';
import { Screen } from '../components/Screen';
import { AccessibleText } from '../components/AccessibleText';
import { AccessibleButton } from '../components/AccessibleButton';
import { LogoMark } from '../components/icons';
import { getPoiByQrCode } from '../api/pois';
import { ApiError } from '../api/client';
import { useI18n } from '../i18n/I18nContext';
import type { Poi } from '../api/types';
import { cardSurface, colors, fontSizes, minTouchTarget, radii, spacing } from '../theme/theme';

type Props = {
  onScanQR: () => void;
  onOpenPoi: (poi: Poi) => void;
  // Absent for somebody who has no places yet: there is nothing to go
  // back to, so the screen shows no way out.
  onBack?: () => void;
};

/**
 * Where a signed-in person with no place yet arrives, and where "add
 * another" leads afterwards. Two ways in, because a flyer carries both: a
 * QR code to point the camera at, and the same code printed underneath
 * for anyone whose camera will not focus or who would rather type.
 */
export function AddPlaceScreen({ onScanQR, onOpenPoi, onBack }: Props) {
  const { t } = useI18n();
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function openByCode() {
    setBusy(true);
    setError(null);
    try {
      onOpenPoi(await getPoiByQrCode(code.trim()));
    } catch (caught) {
      setError(
        caught instanceof ApiError && caught.status === 404
          ? t('scan.codeNotFound')
          : t('home.error'),
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen scroll>
      <View style={styles.header}>
        <LogoMark size={56} />
        <AccessibleText variant="title" style={styles.wordmark}>
          ANSAE
        </AccessibleText>
      </View>

      <AccessibleText variant="bodyLarge" style={styles.lead}>
        {t('addPlace.title')}
      </AccessibleText>

      {error && (
        <AccessibleText variant="body" color={colors.danger}>
          {error}
        </AccessibleText>
      )}

      <AccessibleButton label={t('home.scanButton')} onPress={onScanQR} />

      <View style={styles.card}>
        <AccessibleText variant="caption" color={colors.textMuted}>
          {t('addPlace.codeLabel')}
        </AccessibleText>
        <TextInput
          value={code}
          onChangeText={(value) => {
            setCode(value);
            setError(null);
          }}
          placeholder={t('scan.codePlaceholder')}
          placeholderTextColor={colors.textMuted}
          autoCapitalize="characters"
          autoCorrect={false}
          accessibilityLabel={t('addPlace.codeLabel')}
          onSubmitEditing={() => code.trim() && void openByCode()}
          style={styles.input}
        />
        {busy ? (
          <View style={styles.busy}>
            <ActivityIndicator color={colors.primaryStrong} size="large" />
          </View>
        ) : (
          <AccessibleButton
            label={t('scan.codeButton')}
            variant={code.trim() ? 'primary' : 'secondary'}
            disabled={code.trim().length === 0}
            onPress={() => void openByCode()}
          />
        )}
      </View>

      {onBack && (
        <AccessibleButton label={t('common.back')} variant="secondary" onPress={onBack} />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  wordmark: {
    fontWeight: '800',
    letterSpacing: 2,
  },
  lead: {
    marginBottom: spacing.sm,
  },
  card: {
    ...cardSurface,
    borderRadius: radii.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  input: {
    minHeight: minTouchTarget,
    fontSize: fontSizes.body,
    color: colors.text,
    letterSpacing: 1,
    paddingHorizontal: spacing.md,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.background,
  },
  busy: {
    minHeight: minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
