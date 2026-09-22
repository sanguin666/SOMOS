import { useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { Screen } from '../components/Screen';
import { AccessibleText } from '../components/AccessibleText';
import { AccessibleButton } from '../components/AccessibleButton';
import { LogoMark } from '../components/icons';
import { getPoi, getPoiByQrCode } from '../api/pois';
import { getSavedPlaces } from '../storage/savedPlaces';
import { useAuth } from '../auth/AuthContext';
import { DEMO_QR_TOKEN } from '../demo';
import { useI18n } from '../i18n/I18nContext';
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '../i18n/translations';
import type { Poi } from '../api/types';
import { colors, radii, spacing } from '../theme/theme';

const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  en: 'EN',
  es: 'ES',
  fr: 'FR',
};

type Props = {
  onScanQR: () => void;
  onSignIn: () => void;
  onOpenPoi: (poi: Poi) => void;
};

export function HomeScreen({ onScanQR, onSignIn, onOpenPoi }: Props) {
  const { t, language, setLanguage } = useI18n();
  const { me, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  /**
   * Re-opens the place the person was in last. A signed-in account's own
   * places come first — they follow the person across devices — then this
   * device's history, then the demo POI, so the button always leads
   * somewhere even on a phone that has never scanned anything.
   */
  async function openMyPlaces() {
    setLoading(true);
    setError(false);
    try {
      const [mine] = me?.pois ?? [];
      if (mine) {
        onOpenPoi(await getPoi(mine.id));
        return;
      }
      const [mostRecent] = await getSavedPlaces();
      const poi = mostRecent ? await getPoi(mostRecent.id) : await getPoiByQrCode(DEMO_QR_TOKEN);
      onOpenPoi(poi);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
        <LogoMark size={40} />
        <AccessibleText variant="title">ANSAE</AccessibleText>
      </View>
      <AccessibleText variant="bodyLarge">{t('home.welcome')}</AccessibleText>

      {error && (
        <AccessibleText variant="body" color={colors.danger}>
          {t('home.error')}
        </AccessibleText>
      )}

      <AccessibleButton
        label={t('home.scanButton')}
        onPress={onScanQR}
        style={{ marginTop: spacing.lg }}
      />

      {loading ? (
        <View style={{ minHeight: 64, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : (
        <AccessibleButton label={t('home.myPlacesButton')} variant="secondary" onPress={openMyPlaces} />
      )}

      {me ? (
        <View style={{ marginTop: spacing.lg, gap: spacing.sm }}>
          <AccessibleText variant="caption" color={colors.textMuted}>
            {t('home.signedInAs', { name: me.firstName ?? me.phone ?? '' })}
          </AccessibleText>
          <AccessibleButton
            label={t('home.signOutButton')}
            variant="secondary"
            onPress={() => {
              void signOut();
            }}
          />
        </View>
      ) : (
        <AccessibleButton
          label={t('home.signInButton')}
          variant="secondary"
          onPress={onSignIn}
          style={{ marginTop: spacing.lg }}
        />
      )}

      <View style={{ marginTop: spacing.xl, alignItems: 'center', gap: spacing.sm }}>
        <AccessibleText variant="caption" color={colors.textMuted}>
          {t('home.languageLabel')}
        </AccessibleText>
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          {SUPPORTED_LANGUAGES.map((code) => {
            const isSelected = code === language;
            return (
              <Pressable
                key={code}
                accessibilityRole="button"
                accessibilityLabel={LANGUAGE_LABELS[code]}
                onPress={() => setLanguage(code)}
                style={{
                  minWidth: 64,
                  minHeight: 44,
                  paddingHorizontal: spacing.md,
                  borderRadius: radii.md,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 2,
                  borderColor: isSelected ? colors.primary : colors.border,
                  backgroundColor: isSelected ? colors.primary : colors.background,
                }}
              >
                <AccessibleText variant="body" color={isSelected ? colors.primaryText : colors.text}>
                  {LANGUAGE_LABELS[code]}
                </AccessibleText>
              </Pressable>
            );
          })}
        </View>
      </View>
    </Screen>
  );
}
