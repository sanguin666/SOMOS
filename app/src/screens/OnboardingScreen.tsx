import { ImageBackground, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AccessibleButton } from '../components/AccessibleButton';
import { AccessibleText } from '../components/AccessibleText';
import { HaloBackdrop } from '../components/HaloBackdrop';
import { LogoMark } from '../components/icons';
import { useI18n } from '../i18n/I18nContext';
import { colors, spacing } from '../theme/theme';

type Props = {
  onSignUp: () => void;
  onSignIn: () => void;
};

/**
 * The first thing anyone sees who is not signed in. Two doors, nothing
 * else: there is nothing to read here and nothing to get wrong.
 *
 * Both doors lead to the same phone-and-code screen — the backend makes
 * an account on the first code that verifies, so "sign up" and "sign in"
 * differ only in where somebody lands afterwards, and pressing the wrong
 * one costs nothing.
 */
export function OnboardingScreen({ onSignUp, onSignIn }: Props) {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  return (
    /* The illustration is the screen, edge to edge and under the status
       bar and the home indicator alike — hence ImageBackground as the
       root rather than a sized layer behind it, which is what left a
       band of nothing at the bottom.

       Nothing here is inset: the picture is sized against this view, so a
       padding on it would shrink the picture too and leave a strip of
       bare colour down one side. The margin the panel needs lives on the
       panel. */
    <ImageBackground
      source={require('../../assets/onboarding-crowd.jpg')}
      resizeMode="cover"
      style={styles.root}
    >
      {/* The words and the buttons sit in a patch of white light rather
          than on the illustration, so nothing is ever read against a
          figure. */}
      <HaloBackdrop width={width} height={height} />

      <View
        style={[
          styles.panel,
          {
            marginTop: insets.top + spacing.lg,
            marginBottom: insets.bottom + spacing.lg,
          },
        ]}
      >
        <LogoMark size={184} />

        <AccessibleText variant="title" style={styles.wordmark}>
          ANSAE
        </AccessibleText>
        <AccessibleText variant="bodyLarge" color={colors.textMuted} style={styles.welcome}>
          {t('onboarding.welcome')}
        </AccessibleText>

        <View style={styles.buttons}>
          <AccessibleButton label={t('onboarding.signUp')} onPress={onSignUp} />
          <AccessibleButton label={t('onboarding.signIn')} variant="secondary" onPress={onSignIn} />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    // Shows only for the instant before the picture decodes.
    backgroundColor: colors.background,
  },
  panel: {
    // No background and no border: the light behind it is what separates
    // these words from the crowd now.
    marginHorizontal: spacing.lg,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
  wordmark: {
    fontWeight: '800',
    letterSpacing: 2,
  },
  welcome: {
    textAlign: 'center',
  },
  buttons: {
    alignSelf: 'stretch',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
});
