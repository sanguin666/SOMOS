import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { AccessibleText } from '../components/AccessibleText';
import { AccessibleButton } from '../components/AccessibleButton';
import { HeartIcon } from '../components/icons';
import { createDonation } from '../api/donations';
import { useI18n } from '../i18n/I18nContext';
import { colors, radii, spacing } from '../theme/theme';
import type { Poi } from '../api/types';

type Props = {
  poi: Poi;
  // Leaves the donation flow once it is confirmed — back to the hub feed.
  onDone: () => void;
};

const PRESET_AMOUNTS = [10, 25, 50, 100];

/**
 * No payment processor is wired up yet (planned: Stripe) — donating here
 * confirms the demo interaction without moving any real money, but the
 * amount is still recorded so the admin dashboard's donations graph has
 * real data to show.
 *
 * The confirmation is a screen state rather than Alert.alert(): RN's Alert
 * has no effect at all on the web target (react-native-web doesn't
 * implement it), so a native-only confirmation would look broken there.
 */
export function DonateScreen({ poi, onDone }: Props) {
  const { t } = useI18n();
  const [selected, setSelected] = useState<number>(50);
  const [customMode, setCustomMode] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [donated, setDonated] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const amount = customMode ? Number(customAmount) || 0 : selected;

  async function donate() {
    setSubmitting(true);
    try {
      await createDonation(poi.id, { amount });
    } catch {
      // Non-critical for this demo flow — no real payment is at stake, so
      // still show the confirmation rather than blocking the user on it.
    } finally {
      setSubmitting(false);
      setDonated(true);
    }
  }

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
          {t('donate.confirmation', { amount, poiName: poi.name })}
        </AccessibleText>
        <View style={styles.spacer} />
        <AccessibleButton label={t('donate.doneButton')} onPress={onDone} />
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
        {t('donate.chooseAmount')}
      </AccessibleText>

      <View style={styles.grid}>
        {PRESET_AMOUNTS.map((preset) => {
          const isSelected = !customMode && preset === selected;
          return (
            <Pressable
              key={preset}
              accessibilityRole="button"
              accessibilityLabel={`$${preset}`}
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
                ${preset}
              </AccessibleText>
            </Pressable>
          );
        })}
      </View>

      {customMode ? (
        <View style={[styles.customInput, styles.amountCellSelected]}>
          <AccessibleText variant="bodyLarge" color={colors.primary}>
            $
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

      <AccessibleButton
        label={submitting ? t('donate.processingButton') : t('donate.donateButton', { amount })}
        onPress={donate}
        disabled={submitting || amount <= 0}
      />

      <AccessibleText variant="caption" style={styles.footnote}>
        {t('donate.footnote')}
      </AccessibleText>
    </>
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
