import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Screen } from '../components/Screen';
import { AccessibleText } from '../components/AccessibleText';
import { AccessibleButton } from '../components/AccessibleButton';
import { BackChevronIcon } from '../components/icons';
import { requestPhoneCode, verifyPhoneCode } from '../api/auth';
import { useAuth } from '../auth/AuthContext';
import { useI18n } from '../i18n/I18nContext';
import { ApiError } from '../api/client';
import { cardSurface, colors, fontSizes, radii, spacing } from '../theme/theme';

type Props = {
  onBack: () => void;
  onSignedIn: () => void;
};

/**
 * Signing in with a phone number and a 6-digit code. No password: the
 * audience is mostly elderly, and a password is the single thing most
 * likely to stop them using the app at all.
 *
 * Two steps on one screen rather than two routes, so the number stays
 * visible while the code is typed and "wrong number" is a tap away.
 */
export function PhoneLoginScreen({ onBack, onSignedIn }: Props) {
  const { t } = useI18n();
  const { signIn } = useAuth();

  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phone, setPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Shown only when the backend has no SMS provider — it hands the code
  // back so the flow can be completed on a development machine.
  const [devCode, setDevCode] = useState<string | null>(null);

  async function sendCode() {
    setBusy(true);
    setError(null);
    try {
      const result = await requestPhoneCode(phone.trim());
      setDevCode(result.devCode ?? null);
      setStep('code');
      setCode('');
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : t('signIn.genericError'));
    } finally {
      setBusy(false);
    }
  }

  async function submitCode() {
    setBusy(true);
    setError(null);
    try {
      const { accessToken } = await verifyPhoneCode(phone.trim(), code.trim(), firstName);
      await signIn(accessToken);
      onSignedIn();
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : t('signIn.genericError'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen scroll>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('common.back')}
        onPress={onBack}
        style={styles.backButton}
      >
        <BackChevronIcon size={20} color={colors.text} />
        <AccessibleText variant="body">{t('common.back')}</AccessibleText>
      </Pressable>

      <AccessibleText variant="title">{t('signIn.title')}</AccessibleText>

      {step === 'phone' ? (
        <>
          <AccessibleText variant="body" color={colors.textMuted}>
            {t('signIn.phoneExplainer')}
          </AccessibleText>

          <AccessibleText variant="body">{t('signIn.phoneLabel')}</AccessibleText>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder={t('signIn.phonePlaceholder')}
            keyboardType="phone-pad"
            autoComplete="tel"
            textContentType="telephoneNumber"
            style={styles.input}
          />

          <AccessibleText variant="body">{t('signIn.nameLabel')}</AccessibleText>
          <TextInput
            value={firstName}
            onChangeText={setFirstName}
            placeholder={t('signIn.namePlaceholder')}
            autoComplete="given-name"
            style={styles.input}
          />

          {error && (
            <AccessibleText variant="body" color={colors.danger}>
              {error}
            </AccessibleText>
          )}

          <AccessibleButton
            label={busy ? t('signIn.sending') : t('signIn.sendCode')}
            onPress={sendCode}
            disabled={busy || phone.trim().length < 6}
          />
        </>
      ) : (
        <>
          <AccessibleText variant="body" color={colors.textMuted}>
            {t('signIn.codeExplainer', { phone: phone.trim() })}
          </AccessibleText>

          {devCode && (
            <View style={styles.devCode}>
              <AccessibleText variant="caption" color={colors.textMuted}>
                {t('signIn.devCodeLabel')}
              </AccessibleText>
              <AccessibleText variant="bodyLarge">{devCode}</AccessibleText>
            </View>
          )}

          <TextInput
            value={code}
            onChangeText={(next) => setCode(next.replace(/[^0-9]/g, ''))}
            placeholder="000000"
            keyboardType="number-pad"
            maxLength={6}
            autoComplete="one-time-code"
            textContentType="oneTimeCode"
            style={[styles.input, styles.codeInput]}
          />

          {error && (
            <AccessibleText variant="body" color={colors.danger}>
              {error}
            </AccessibleText>
          )}

          <AccessibleButton
            label={busy ? t('signIn.checking') : t('signIn.confirm')}
            onPress={submitCode}
            disabled={busy || code.length !== 6}
          />

          <AccessibleButton
            label={t('signIn.changeNumber')}
            variant="secondary"
            onPress={() => {
              setStep('phone');
              setError(null);
              setDevCode(null);
            }}
            disabled={busy}
          />
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 48,
  },
  input: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.md,
    minHeight: 64,
    fontSize: fontSizes.body,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  // The code is short and typed from memory, so it gets the room to be
  // read back at a glance.
  codeInput: {
    fontSize: fontSizes.title,
    letterSpacing: 6,
    textAlign: 'center',
  },
  devCode: {
    ...cardSurface,
    borderRadius: radii.md,
    padding: spacing.md,
    gap: spacing.xs,
  },
});
