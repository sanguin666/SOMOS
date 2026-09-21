import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { Screen } from '../components/Screen';
import { AccessibleText } from '../components/AccessibleText';
import { AccessibleButton } from '../components/AccessibleButton';
import { BackChevronIcon, HeartIcon } from '../components/icons';
import { getDonationStatus, getDonationsConfig, startDonationCheckout } from '../api/donations';
import { useI18n } from '../i18n/I18nContext';
import { colors, radii, spacing } from '../theme/theme';
import { currencySymbol, formatAmount } from '../utils/currency';
import type { Poi } from '../api/types';

type Props = {
  poi: Poi;
  onBack: () => void;
};

const PRESET_AMOUNTS = [10, 25, 50, 100];

const POLL_INTERVAL_MS = 2000;

/**
 * Gifts go through Stripe Checkout: the backend creates the session, the
 * payer finishes on Stripe's own hosted page in the browser, and this screen
 * polls until the payment confirms.
 *
 * Polling rather than a redirect back into the app: Stripe only accepts
 * http(s) redirect URLs, so it can't hand control back to a React Native app
 * directly, and on Android openBrowserAsync resolves as soon as the tab opens
 * rather than when it closes. Polling the backend covers every case — the
 * payer closing the tab, switching apps, or paying on a different device.
 *
 * When the backend has no Stripe key it answers `mode: 'demo'` and the gift is
 * recorded without a payment, so a fresh clone still demos end to end.
 *
 * The confirmation is a screen state rather than Alert.alert(): RN's Alert
 * has no effect at all on the web target (react-native-web doesn't
 * implement it), so a native-only confirmation would look broken there.
 */
export function DonateScreen({ poi, onBack }: Props) {
  const { t, language } = useI18n();
  const [selected, setSelected] = useState<number>(50);
  const [customMode, setCustomMode] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [donated, setDonated] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const [currency, setCurrency] = useState('eur');
  const [paymentsEnabled, setPaymentsEnabled] = useState(false);
  const [pending, setPending] = useState<{ donationId: string; checkoutUrl: string } | null>(null);
  const paidAmount = useRef(0);

  const amount = customMode ? Number(customAmount) || 0 : selected;
  const formatted = (value: number) => formatAmount(value, currency, language);

  useEffect(() => {
    getDonationsConfig()
      .then((config) => {
        setCurrency(config.currency);
        setPaymentsEnabled(config.paymentsEnabled);
      })
      .catch(() => {
        // Keep the defaults — the donate call itself will surface any real
        // connection problem.
      });
  }, []);

  // While the payer is on Stripe's page, ask the backend whether the payment
  // has landed. The backend re-checks with Stripe on each call, so this works
  // without a webhook (the local demo has no public URL for one).
  useEffect(() => {
    if (!pending) return;
    let cancelled = false;

    const timer = setInterval(() => {
      getDonationStatus(poi.id, pending.donationId)
        .then((result) => {
          if (cancelled || result.status === 'pending') return;
          if (result.status === 'completed') {
            paidAmount.current = result.amount;
            setPending(null);
            setDonated(true);
          } else {
            setPending(null);
            setError(true);
          }
        })
        .catch(() => {
          // A dropped request just means we try again on the next tick.
        });
    }, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [pending, poi.id]);

  async function donate() {
    setSubmitting(true);
    setError(false);
    try {
      const result = await startDonationCheckout(poi.id, { amount });
      if (result.mode === 'demo') {
        paidAmount.current = amount;
        setDonated(true);
        return;
      }
      paidAmount.current = amount;
      setPending({ donationId: result.donationId, checkoutUrl: result.checkoutUrl });
      // On the web target the browser is opened from the button below instead:
      // window.open() right after an await is treated as a popup and blocked.
      if (Platform.OS !== 'web') {
        await WebBrowser.openBrowserAsync(result.checkoutUrl);
      }
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (donated) {
    return (
      <Screen>
        <View style={styles.confirmationIcon}>
          <HeartIcon size={32} color={colors.primary} />
        </View>
        <AccessibleText variant="title" style={styles.centerText}>
          {t('donate.thankYou')}
        </AccessibleText>
        <AccessibleText variant="body" color={colors.textMuted} style={styles.centerText}>
          {t(paymentsEnabled ? 'donate.confirmation' : 'donate.demoConfirmation', {
            amount: formatted(paidAmount.current),
            poiName: poi.name,
          })}
        </AccessibleText>
        <View style={styles.spacer} />
        <AccessibleButton label={t('donate.doneButton')} onPress={onBack} />
      </Screen>
    );
  }

  if (pending) {
    return (
      <Screen>
        <View style={styles.confirmationIcon}>
          <HeartIcon size={32} color={colors.primary} />
        </View>
        <AccessibleText variant="title" style={styles.centerText}>
          {t('donate.payingTitle')}
        </AccessibleText>
        <AccessibleText variant="body" color={colors.textMuted} style={styles.centerText}>
          {t('donate.payingMessage')}
        </AccessibleText>

        <View style={styles.waitingRow}>
          <ActivityIndicator color={colors.primary} />
          <AccessibleText variant="body" color={colors.textMuted}>
            {t('donate.checkingPayment')}
          </AccessibleText>
        </View>

        <View style={styles.spacer} />

        <AccessibleButton
          label={t('donate.openPaymentButton')}
          onPress={() => {
            WebBrowser.openBrowserAsync(pending.checkoutUrl).catch(() => setError(true));
          }}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('donate.cancelButton')}
          onPress={() => setPending(null)}
          style={styles.textButton}
        >
          <AccessibleText variant="body" color={colors.textMuted}>
            {t('donate.cancelButton')}
          </AccessibleText>
        </Pressable>
      </Screen>
    );
  }

  return (
    <Screen>
      <Pressable accessibilityRole="button" accessibilityLabel={t('common.back')} onPress={onBack} style={styles.iconButton}>
        <BackChevronIcon size={20} color={colors.text} />
      </Pressable>

      <View style={styles.titleBlock}>
        <AccessibleText variant="title" style={styles.title}>
          {t('donate.title', { poiName: poi.name })}
        </AccessibleText>
        <AccessibleText variant="body" color={colors.textMuted}>
          {t('donate.subtitle')}
        </AccessibleText>
      </View>

      <AccessibleText variant="caption" style={styles.sectionLabel}>
        {t('donate.chooseAmount')}
      </AccessibleText>

      <View style={styles.grid}>
        {PRESET_AMOUNTS.map((preset) => {
          const isSelected = !customMode && preset === selected;
          return (
            <Pressable
              key={preset}
              accessibilityRole="button"
              accessibilityLabel={formatted(preset)}
              onPress={() => {
                setCustomMode(false);
                setSelected(preset);
              }}
              style={[styles.amountCell, isSelected && styles.amountCellSelected]}
            >
              <AccessibleText
                variant="bodyLarge"
                style={styles.amountText}
                color={isSelected ? colors.primary : colors.text}
              >
                {formatted(preset)}
              </AccessibleText>
            </Pressable>
          );
        })}
      </View>

      {customMode ? (
        <View style={[styles.customInput, styles.amountCellSelected]}>
          <AccessibleText variant="bodyLarge" color={colors.primary}>
            {currencySymbol(currency)}
          </AccessibleText>
          <TextInput
            value={customAmount}
            onChangeText={setCustomAmount}
            keyboardType="number-pad"
            placeholder="0"
            autoFocus
            style={styles.customInputField}
          />
        </View>
      ) : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('donate.customAmount')}
          onPress={() => setCustomMode(true)}
          style={styles.customButton}
        >
          <AccessibleText variant="bodyLarge">{t('donate.customAmount')}</AccessibleText>
        </Pressable>
      )}

      <View style={styles.spacer} />

      {error ? (
        <AccessibleText variant="body" color={colors.primary} style={styles.centerText}>
          {t('donate.error')}
        </AccessibleText>
      ) : null}

      <AccessibleButton
        label={
          submitting
            ? t('donate.processingButton')
            : t('donate.donateButton', { amount: formatted(amount) })
        }
        onPress={donate}
        disabled={submitting || amount <= 0}
      />

      <AccessibleText variant="caption" style={styles.footnote}>
        {t(paymentsEnabled ? 'donate.footnote' : 'donate.demoFootnote')}
      </AccessibleText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  confirmationIcon: {
    width: 64,
    height: 64,
    borderRadius: 9999,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: spacing.xl,
  },
  centerText: {
    textAlign: 'center',
  },
  waitingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  textButton: {
    minHeight: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 9999,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBlock: {
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  title: {
    fontSize: 28,
  },
  sectionLabel: {
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginTop: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  amountCell: {
    width: '46%',
    flexGrow: 1,
    minHeight: 72,
    borderRadius: radii.lg,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amountCellSelected: {
    borderWidth: 3,
    borderColor: colors.primary,
    // The beige surface, not the blue tint this screen used before the
    // SOMOS palette landed.
    backgroundColor: colors.surface,
  },
  customButton: {
    minHeight: 64,
    borderRadius: radii.lg,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: 64,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.lg,
  },
  customInputField: {
    flex: 1,
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
  },
  amountText: {
    fontWeight: '800',
  },
  spacer: {
    flexGrow: 1,
    minHeight: spacing.lg,
  },
  footnote: {
    textAlign: 'center',
  },
});
