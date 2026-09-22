import { StyleSheet, View } from 'react-native';
import { AccessibleText } from './AccessibleText';
import { AccessibleButton } from './AccessibleButton';
import { useI18n } from '../i18n/I18nContext';
import { colors, radii, spacing } from '../theme/theme';

/**
 * Shown in place of a compose form when nobody is signed in. Reading never
 * needs an account, so this only ever replaces the form, never the content
 * below it.
 */
export function SignInNotice({ onSignIn }: { onSignIn: () => void }) {
  const { t } = useI18n();

  return (
    <View style={styles.box}>
      <AccessibleText variant="body">{t('signIn.requiredToPost')}</AccessibleText>
      <AccessibleButton label={t('home.signInButton')} onPress={onSignIn} />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    gap: spacing.md,
  },
});
