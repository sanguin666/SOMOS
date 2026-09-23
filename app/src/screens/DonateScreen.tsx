import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Switch, TextInput, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { AccessibleText } from '../components/AccessibleText';
import { AccessibleButton } from '../components/AccessibleButton';
import { FormCard, FormDivider, FormField } from '../components/FormCard';
import { CheckIcon, ChevronRightIcon, HeartIcon } from '../components/icons';
import { uploadUri } from '../api/client';
import {
  getCampaigns,
  getDonationStatus,
  getDonationsConfig,
  getMyMonthlyGifts,
  getMyReceipts,
  startDonationCheckout,
  stopMonthlyGift,
  type Campaign,
  type DonationPurpose,
  type MonthlyGift,
  type ReceiptYear,
} from '../api/donations';
import { useAuth } from '../auth/AuthContext';
import { useI18n } from '../i18n/I18nContext';
import { cardSurface, colors, minTouchTarget, radii, spacing } from '../theme/theme';
import { currencySymbol, formatAmount } from '../utils/currency';
import type { Poi } from '../api/types';

type Props = {
  poi: Poi;
  // Leaves the donation flow once it is confirmed — back to the hub feed.
  onDone: () => void;
  // Giving every month needs an account, so it can be stopped later.
  onSignIn: () => void;
};

// What a gift is for: the community's general needs, the Sunday
// collection, or one of its campaigns.
type Purpose = { kind: Exclude<DonationPurpose, 'campaign'> } | { kind: 'campaign'; campaign: Campaign };

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
export function DonateScreen({ poi, onDone, onSignIn }: Props) {
  const { t, language } = useI18n();
  const { me } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [purpose, setPurpose] = useState<Purpose>({ kind: 'general' });
  const [monthly, setMonthly] = useState(false);
  const [wantsReceipt, setWantsReceipt] = useState(false);
  const [donorName, setDonorName] = useState([me?.firstName, me?.lastName].filter(Boolean).join(' '));
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [taxId, setTaxId] = useState('');
  const [monthlyGifts, setMonthlyGifts] = useState<MonthlyGift[]>([]);
  const [receipts, setReceipts] = useState<ReceiptYear[]>([]);
  const [stopping, setStopping] = useState<string | null>(null);
  const [confirmingStop, setConfirmingStop] = useState<string | null>(null);
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

  useEffect(() => {
    getCampaigns(poi.id)
      .then(setCampaigns)
      .catch(() => {});
  }, [poi.id]);

  // The giver's own standing gifts and receipts, when signed in.
  const loadMine = useCallback(() => {
    if (!me) return;
    getMyMonthlyGifts(poi.id)
      .then(setMonthlyGifts)
      .catch(() => {});
    getMyReceipts(poi.id)
      .then(setReceipts)
      .catch(() => {});
  }, [poi.id, me]);

  useEffect(loadMine, [loadMine]);

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
            loadMine();
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
  }, [pending, poi.id, loadMine]);

  async function donate() {
    setSubmitting(true);
    setError(false);
    try {
      const result = await startDonationCheckout(poi.id, {
        amount,
        purpose: purpose.kind,
        campaignId: purpose.kind === 'campaign' ? purpose.campaign.id : undefined,
        recurring: monthly || undefined,
        donorName: donorName.trim() || undefined,
        wantsReceipt: wantsReceipt || undefined,
        ...(wantsReceipt
          ? {
              donorAddress: address.trim(),
              donorPostalCode: postalCode.trim(),
              donorCity: city.trim(),
              donorTaxId: taxId.trim() || null,
            }
          : {}),
      });
      if (result.mode === 'demo') {
        paidAmount.current = amount;
        setDonated(true);
        loadMine();
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

  async function stopMonthly(id: string) {
    setStopping(id);
    try {
      await stopMonthlyGift(poi.id, id);
      setMonthlyGifts((current) => current.filter((gift) => gift.id !== id));
      setConfirmingStop(null);
    } catch {
      setError(true);
    } finally {
      setStopping(null);
    }
  }

  function openReceipt(receipt: ReceiptYear) {
    WebBrowser.openBrowserAsync(uploadUri(receipt.url)).catch(() => setError(true));
  }

  const receiptReady = !wantsReceipt || (!!donorName.trim() && !!address.trim() && !!postalCode.trim() && !!city.trim());
  const blockedOnSignIn = monthly && !me;

  if (donated) {
    return (
      <>
        <View style={styles.confirmationIcon}>
          <HeartIcon size={32} color={colors.primary} />
        </View>
        <AccessibleText variant="title" style={styles.centerText}>
          {t('donate.thankYou')}
        </AccessibleText>
        <AccessibleText variant="body" color={colors.textMuted} style={styles.centerText}>
          {t(
            monthly
              ? 'donate.monthlyConfirmation'
              : paymentsEnabled
                ? 'donate.confirmation'
                : 'donate.demoConfirmation',
            {
              amount: formatted(paidAmount.current),
              poiName: poi.name,
            },
          )}
        </AccessibleText>
        <View style={styles.spacer} />
        <AccessibleButton label={t('donate.doneButton')} onPress={onDone} />
      </>
    );
  }

  if (pending) {
    return (
      <>
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
      </>
    );
  }

  return (
    <>
      <View style={styles.titleBlock}>
        <AccessibleText variant="title" style={styles.title}>
          {t('donate.title', { poiName: poi.name })}
        </AccessibleText>
        <AccessibleText variant="body" color={colors.textMuted}>
          {t('donate.subtitle')}
        </AccessibleText>
      </View>

      <AccessibleText variant="caption" style={styles.sectionLabel}>
        {t('donate.purposeLabel')}
      </AccessibleText>
      <View style={styles.listCard} accessibilityRole="radiogroup">
        <PurposeRow
          label={t('donate.purposeGeneral')}
          selected={purpose.kind === 'general'}
          onPress={() => setPurpose({ kind: 'general' })}
        />
        <PurposeRow
          label={t('donate.purposeCollection')}
          detail={t('donate.purposeCollectionHint')}
          selected={purpose.kind === 'collection'}
          divider
          onPress={() => setPurpose({ kind: 'collection' })}
        />
        {campaigns.map((campaign) => (
          <PurposeRow
            key={campaign.id}
            label={campaign.title}
            detail={campaign.description ?? undefined}
            selected={purpose.kind === 'campaign' && purpose.campaign.id === campaign.id}
            divider
            onPress={() => setPurpose({ kind: 'campaign', campaign })}
          >
            {campaign.goalAmount ? (
              <View style={styles.progress}>
                <View
                  style={styles.progressTrack}
                  accessibilityRole="progressbar"
                  accessibilityValue={{ min: 0, max: campaign.goalAmount, now: campaign.raised }}
                >
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${Math.min(100, (campaign.raised / campaign.goalAmount) * 100)}%` },
                    ]}
                  />
                </View>
                <AccessibleText variant="caption">
                  {t('donate.campaignProgress', {
                    raised: formatted(campaign.raised),
                    goal: formatted(campaign.goalAmount),
                  })}
                </AccessibleText>
              </View>
            ) : null}
          </PurposeRow>
        ))}
      </View>

      <AccessibleText variant="caption" style={styles.sectionLabel}>
        {t('donate.frequencyLabel')}
      </AccessibleText>
      <View style={styles.grid} accessibilityRole="radiogroup">
        {[false, true].map((isMonthly) => {
          const isSelected = monthly === isMonthly;
          const label = isMonthly ? t('donate.monthly') : t('donate.once');
          return (
            <Pressable
              key={label}
              accessibilityRole="radio"
              accessibilityState={{ checked: isSelected }}
              accessibilityLabel={label}
              onPress={() => setMonthly(isMonthly)}
              style={[styles.frequencyCell, isSelected && styles.amountCellSelected]}
            >
              <AccessibleText
                variant="body"
                style={styles.amountText}
                color={isSelected ? colors.primary : colors.text}
              >
                {label}
              </AccessibleText>
            </Pressable>
          );
        })}
      </View>
      {monthly && (
        <AccessibleText variant="caption">{t('donate.monthlyHint')}</AccessibleText>
      )}

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

      <FormCard>
        <Pressable
          accessibilityRole="switch"
          accessibilityState={{ checked: wantsReceipt }}
          accessibilityLabel={t('donate.receiptToggle')}
          onPress={() => setWantsReceipt((value) => !value)}
          style={styles.switchRow}
        >
          <View style={styles.flex}>
            <AccessibleText variant="body" style={styles.bold}>
              {t('donate.receiptToggle')}
            </AccessibleText>
            <AccessibleText variant="caption">{t('donate.receiptHint')}</AccessibleText>
          </View>
          <Switch
            value={wantsReceipt}
            onValueChange={setWantsReceipt}
            trackColor={{ true: colors.primary, false: colors.cardBorder }}
            thumbColor="#FFFFFF"
            accessibilityElementsHidden
            importantForAccessibility="no"
          />
        </Pressable>
        {wantsReceipt && (
          <>
            <FormDivider />
            <FormField label={t('donate.nameLabel')} value={donorName} onChangeText={setDonorName} autoComplete="name" />
            <FormDivider />
            <FormField
              label={t('donate.addressLabel')}
              value={address}
              onChangeText={setAddress}
              autoComplete="street-address"
            />
            <FormDivider />
            <FormField
              label={t('donate.postalCodeLabel')}
              value={postalCode}
              onChangeText={setPostalCode}
              autoComplete="postal-code"
            />
            <FormDivider />
            <FormField label={t('donate.cityLabel')} value={city} onChangeText={setCity} />
            <FormDivider />
            <FormField label={t('donate.taxIdLabel')} value={taxId} onChangeText={setTaxId} autoCapitalize="characters" />
          </>
        )}
      </FormCard>

      {blockedOnSignIn && (
        <View style={styles.notice}>
          <AccessibleText variant="body">{t('donate.monthlySignIn')}</AccessibleText>
          <AccessibleButton label={t('home.signInButton')} onPress={onSignIn} />
        </View>
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
            : t(monthly ? 'donate.donateMonthlyButton' : 'donate.donateButton', { amount: formatted(amount) })
        }
        onPress={donate}
        disabled={submitting || amount <= 0 || !receiptReady || blockedOnSignIn}
      />

      <AccessibleText variant="caption" style={styles.footnote}>
        {t(paymentsEnabled ? 'donate.footnote' : 'donate.demoFootnote')}
      </AccessibleText>

      {monthlyGifts.length > 0 && (
        <>
          <AccessibleText variant="caption" style={styles.sectionLabel}>
            {t('donate.myMonthly')}
          </AccessibleText>
          <View style={styles.listCard}>
            {monthlyGifts.map((gift, index) => (
              <View key={gift.id} style={[styles.mineRow, index > 0 && styles.divider]}>
                <AccessibleText variant="bodyLarge" style={styles.bold}>
                  {t('donate.monthlyAmount', { amount: formatted(gift.amount) })}
                </AccessibleText>
                <AccessibleText variant="caption">
                  {gift.campaign?.title ??
                    t(gift.purpose === 'collection' ? 'donate.purposeCollection' : 'donate.purposeGeneral')}
                  {' · '}
                  {t('donate.since', {
                    date: new Date(gift.createdAt).toLocaleDateString(language, { month: 'long', year: 'numeric' }),
                  })}
                </AccessibleText>
                {confirmingStop === gift.id ? (
                  <View style={styles.confirm}>
                    <AccessibleText variant="body" style={styles.bold}>
                      {t('donate.stopQuestion')}
                    </AccessibleText>
                    <AccessibleButton
                      label={stopping === gift.id ? t('donate.processingButton') : t('donate.stopConfirm')}
                      onPress={() => stopMonthly(gift.id)}
                      disabled={stopping === gift.id}
                    />
                    <AccessibleButton
                      variant="secondary"
                      label={t('donate.stopKeep')}
                      onPress={() => setConfirmingStop(null)}
                    />
                  </View>
                ) : (
                  <AccessibleButton
                    variant="destructive"
                    label={t('donate.stopMonthly')}
                    onPress={() => setConfirmingStop(gift.id)}
                  />
                )}
              </View>
            ))}
          </View>
        </>
      )}

      {receipts.length > 0 && (
        <>
          <AccessibleText variant="caption" style={styles.sectionLabel}>
            {t('donate.myReceipts')}
          </AccessibleText>
          <View style={styles.listCard}>
            {receipts.map((receipt, index) => (
              <Pressable
                key={receipt.year}
                accessibilityRole="link"
                accessibilityLabel={t('donate.receiptFor', { year: receipt.year, amount: formatted(receipt.total) })}
                onPress={() => openReceipt(receipt)}
                style={[styles.receiptRow, index > 0 && styles.divider]}
              >
                <View style={styles.flex}>
                  <AccessibleText variant="bodyLarge" style={styles.bold}>
                    {String(receipt.year)}
                  </AccessibleText>
                  <AccessibleText variant="caption">{formatted(receipt.total)}</AccessibleText>
                </View>
                <AccessibleText variant="body" color={colors.primaryStrong} style={styles.bold}>
                  {t('donate.openReceipt')}
                </AccessibleText>
                <ChevronRightIcon size={20} color={colors.primaryStrong} />
              </Pressable>
            ))}
          </View>
        </>
      )}
    </>
  );
}

function PurposeRow({
  label,
  detail,
  selected,
  divider = false,
  onPress,
  children,
}: {
  label: string;
  detail?: string;
  selected: boolean;
  divider?: boolean;
  onPress: () => void;
  children?: ReactNode;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={detail ? `${label}. ${detail}` : label}
      onPress={onPress}
      style={[styles.purposeRow, divider && styles.divider, selected && styles.purposeRowSelected]}
    >
      <View style={styles.purposeHeader}>
        <View style={styles.flex}>
          <AccessibleText
            variant="body"
            color={selected ? colors.primaryStrong : colors.text}
            style={selected ? styles.bold : undefined}
          >
            {label}
          </AccessibleText>
          {!!detail && (
            <AccessibleText variant="caption" numberOfLines={2}>
              {detail}
            </AccessibleText>
          )}
        </View>
        {selected && <CheckIcon size={24} color={colors.primaryStrong} />}
      </View>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  bold: {
    fontWeight: '700',
  },
  listCard: {
    ...cardSurface,
    borderRadius: radii.lg,
    overflow: 'hidden',
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  purposeRow: {
    minHeight: minTouchTarget,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  purposeRowSelected: {
    backgroundColor: colors.primarySoft,
  },
  purposeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  progress: {
    gap: spacing.xs,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.cardBorder,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  frequencyCell: {
    width: '46%',
    flexGrow: 1,
    minHeight: minTouchTarget,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: minTouchTarget,
    paddingVertical: spacing.sm,
  },
  notice: {
    ...cardSurface,
    borderRadius: radii.lg,
    padding: spacing.md,
    gap: spacing.md,
  },
  mineRow: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  confirm: {
    gap: spacing.sm,
  },
  receiptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: minTouchTarget,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  confirmationIcon: {
    width: 64,
    height: 64,
    borderRadius: 9999,
    ...cardSurface,
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
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amountCellSelected: {
    borderWidth: 3,
    borderColor: colors.primary,
    // The beige surface, not the blue tint this screen used before the
    // SOMOS palette landed.
    backgroundColor: colors.primarySoft,
  },
  customButton: {
    minHeight: 64,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.surface,
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
