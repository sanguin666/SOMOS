import { ImageBackground, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AccessibleButton } from '../components/AccessibleButton';
import { AccessibleText } from '../components/AccessibleText';
import { LogoMark } from '../components/icons';
import { useI18n } from '../i18n/I18nContext';
import { colors, radii, spacing } from '../theme/theme';

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

  return (
    /* The illustration is the screen, edge to edge and under the status
       bar and the home indicator alike — hence ImageBackground as the
       root rather than a sized layer behind it, which is what left a
       band of nothing at the bottom. */
    <ImageBackground
      source={require('../../assets/onboarding-crowd.jpg')}
      resizeMode="cover"
      style={styles.root}
      imageStyle={styles.image}
    >
      {/* The words and the buttons sit on their own panel rather than on
          the illustration, so nothing is ever read against a figure. */}
      <View
        style={[
          styles.panel,
          {
            marginTop: insets.top + spacing.lg,
            marginBottom: insets.bottom + spacing.lg,
          },
        ]}
      >
        <View style={styles.logoRing}>
          <LogoMark size={92} />
        </View>

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
    paddingHorizontal: spacing.lg,
    // Shows only for the instant before the picture decodes, and behind
    // it on any screen too wide for the crop.
    backgroundColor: colors.background,
  },
  image: {
    // The picture is taller than it is wide, so a wide phone crops the
    // top and bottom rather than the sides, where the crowd thins out.
    width: '100%',
    height: '100%',
  },
  panel: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg * 2,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
  logoRing: {
    width: 132,
    height: 132,
    borderRadius: 66,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
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
