import { useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AccessibleText } from '../components/AccessibleText';
import { AccessibleButton } from '../components/AccessibleButton';
import { BackChevronIcon } from '../components/icons';
import { getPoiByQrCode } from '../api/pois';
import { ApiError } from '../api/client';
import { extractPoiToken } from '../qr';
import { DEMO_QR_TOKEN } from '../demo';
import { useI18n } from '../i18n/I18nContext';
import type { Poi } from '../api/types';
import { colors, radii, spacing } from '../theme/theme';

type Props = {
  onBack: () => void;
  onFound: (poi: Poi) => void;
};

type Status = 'idle' | 'loading' | 'error' | 'not-found' | 'unknown-code';

/**
 * Points the camera at a flyer's QR code and opens the place it belongs to.
 *
 * Typing the code by hand stays on the screen underneath, and is not just a
 * fallback for a refused permission: every flyer prints the code under the
 * QR, and for an elderly audience holding a phone steady over a printed
 * square is the part most likely to go wrong.
 */
export function ScanQRScreen({ onBack, onFound }: Props) {
  const { t } = useI18n();
  // The viewfinder fills the screen edge to edge, so the chrome over it
  // is what has to stay clear of the camera cutout and the gesture bar.
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [status, setStatus] = useState<Status>('idle');
  const [code, setCode] = useState('');

  // onBarcodeScanned fires continuously while a code is in frame. Keeping
  // the last payload we acted on stops one flyer becoming dozens of
  // lookups, while still letting the user try a different code after a
  // failure without leaving the screen.
  const lastScanned = useRef<string | null>(null);

  async function open(token: string) {
    setStatus('loading');
    try {
      onFound(await getPoiByQrCode(token));
    } catch (error) {
      // A wrong code and an unreachable backend need different advice, and
      // only the first is the user's to fix.
      setStatus(error instanceof ApiError && error.status === 404 ? 'not-found' : 'error');
    }
  }

  function handleScan(data: string) {
    if (status === 'loading' || data === lastScanned.current) return;
    lastScanned.current = data;

    const token = extractPoiToken(data);
    if (!token) {
      // Something scannable, but not one of ours — a poster, a payment
      // code, a website. Say so rather than asking the backend about it.
      setStatus('unknown-code');
      return;
    }
    void open(token);
  }

  const cameraReady = permission?.granted === true;

  return (
    <View style={styles.container}>
      {cameraReady && (
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={({ data }) => handleScan(data)}
        />
      )}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('common.back')}
        onPress={onBack}
        style={[styles.backButton, { top: insets.top + spacing.sm, left: insets.left + spacing.lg }]}
      >
        <BackChevronIcon size={20} color="#FFFFFF" />
      </Pressable>

      <View style={[styles.header, { top: insets.top + 76, left: insets.left + spacing.lg, right: insets.right + spacing.lg }]}>
        <AccessibleText variant="bodyLarge" color="#FFFFFF" style={styles.centerText}>
          {t('scan.title')}
        </AccessibleText>
        <AccessibleText variant="caption" color="rgba(255,255,255,0.7)" style={styles.centerText}>
          {t(cameraReady ? 'scan.subtitle' : 'scan.cameraExplainer')}
        </AccessibleText>
      </View>

      <View style={styles.viewfinder}>
        <View style={[styles.corner, styles.cornerTopLeft]} />
        <View style={[styles.corner, styles.cornerTopRight]} />
        <View style={[styles.corner, styles.cornerBottomLeft]} />
        <View style={[styles.corner, styles.cornerBottomRight]} />
      </View>

      <View style={[styles.footer, { bottom: insets.bottom + spacing.xl, left: insets.left + spacing.lg, right: insets.right + spacing.lg }]}>
        {status !== 'idle' && status !== 'loading' && (
          <AccessibleText variant="caption" color="#FFB4A8" style={[styles.centerText, styles.errorText]}>
            {t(
              status === 'not-found'
                ? 'scan.codeNotFound'
                : status === 'unknown-code'
                  ? 'scan.unknownCode'
                  : 'scan.error',
            )}
          </AccessibleText>
        )}

        {status === 'loading' ? (
          <View style={styles.loading}>
            <ActivityIndicator color="#FFFFFF" size="large" />
          </View>
        ) : (
          <>
            {/* `permission` is null only while the current status is still
                being read; showing nothing for that moment avoids offering
                a button that's about to disappear. */}
            {permission && !permission.granted && (
              <AccessibleButton
                label={t('scan.enableCamera')}
                onPress={() => {
                  void requestPermission();
                }}
              />
            )}

            <AccessibleButton
              label={t('scan.simulateButton')}
              variant={cameraReady ? 'secondary' : 'primary'}
              onPress={() => open(DEMO_QR_TOKEN)}
            />

            {/* Every flyer prints the code under the QR, for anyone whose
                camera won't focus or who would rather type. */}
            <AccessibleText variant="caption" color="rgba(255,255,255,0.7)" style={styles.centerText}>
              {t('scan.codeLabel')}
            </AccessibleText>
            <TextInput
              value={code}
              onChangeText={setCode}
              placeholder={t('scan.codePlaceholder')}
              placeholderTextColor="rgba(255,255,255,0.45)"
              autoCapitalize="characters"
              autoCorrect={false}
              onSubmitEditing={() => code.trim() && open(code.trim())}
              style={styles.codeInput}
            />
            <AccessibleButton
              label={t('scan.codeButton')}
              variant="secondary"
              disabled={code.trim().length === 0}
              onPress={() => open(code.trim())}
              style={code.trim().length === 0 ? styles.codeButtonDisabled : undefined}
            />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121214',
  },
  backButton: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 9999,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  header: {
    position: 'absolute',
    gap: spacing.sm,
  },
  centerText: {
    textAlign: 'center',
  },
  codeInput: {
    minHeight: 56,
    borderRadius: radii.md,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
    paddingHorizontal: spacing.md,
    fontSize: 22,
    color: '#FFFFFF',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  codeButtonDisabled: {
    opacity: 0.5,
  },
  viewfinder: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 220,
    height: 220,
    marginLeft: -110,
    // Sits above the true center: the code entry under the shutter button
    // makes the footer tall enough to swallow a centered frame.
    marginTop: -180,
  },
  corner: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderColor: '#FFFFFF',
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 16,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 16,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 16,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 16,
  },
  footer: {
    position: 'absolute',
    gap: spacing.md,
  },
  errorText: {
    lineHeight: 22,
  },
  loading: {
    minHeight: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
