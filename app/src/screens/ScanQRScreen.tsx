import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AccessibleText } from '../components/AccessibleText';
import { AccessibleButton } from '../components/AccessibleButton';
import { BackChevronIcon } from '../components/icons';
import { getPoiByQrCode } from '../api/pois';
import { DEMO_QR_TOKEN } from '../demo';
import { useI18n } from '../i18n/I18nContext';
import type { Poi } from '../api/types';
import { spacing } from '../theme/theme';

type Props = {
  onBack: () => void;
  onFound: (poi: Poi) => void;
};

/**
 * There's no real camera scanner wired up yet (that needs expo-camera and
 * permissions handling), so this screen mimics the mockup's viewfinder and
 * lets the demo proceed with a button instead of an actual scan.
 */
export function ScanQRScreen({ onBack, onFound }: Props) {
  const { t } = useI18n();
  // The viewfinder fills the screen edge to edge, so the chrome over it
  // is what has to stay clear of the camera cutout and the gesture bar.
  const insets = useSafeAreaInsets();
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  async function simulateScan() {
    setStatus('loading');
    try {
      const poi = await getPoiByQrCode(DEMO_QR_TOKEN);
      onFound(poi);
    } catch {
      setStatus('error');
    }
  }

  return (
    <View style={styles.container}>
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
          {t('scan.subtitle')}
        </AccessibleText>
      </View>

      <View style={styles.viewfinder}>
        <View style={[styles.corner, styles.cornerTopLeft]} />
        <View style={[styles.corner, styles.cornerTopRight]} />
        <View style={[styles.corner, styles.cornerBottomLeft]} />
        <View style={[styles.corner, styles.cornerBottomRight]} />
      </View>

      <View style={[styles.footer, { bottom: insets.bottom + spacing.xl, left: insets.left + spacing.lg, right: insets.right + spacing.lg }]}>
        {status === 'error' && (
          <AccessibleText variant="caption" color="#FFB4A8" style={[styles.centerText, styles.errorText]}>
            {t('scan.error')}
          </AccessibleText>
        )}

        {status === 'loading' ? (
          <View style={styles.loading}>
            <ActivityIndicator color="#FFFFFF" size="large" />
          </View>
        ) : (
          <AccessibleButton label={t('scan.simulateButton')} onPress={simulateScan} />
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
  viewfinder: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 260,
    height: 260,
    marginLeft: -130,
    marginTop: -130,
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
