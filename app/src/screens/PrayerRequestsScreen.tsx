import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { AccessibleText } from '../components/AccessibleText';
import { AccessibleButton } from '../components/AccessibleButton';
import { CandleIcon } from '../components/icons';
import { createPrayerRequest, getPrayerRequests, prayForRequest } from '../api/prayerRequests';
import { SignInNotice } from '../components/SignInNotice';
import { useAuth } from '../auth/AuthContext';
import { useI18n } from '../i18n/I18nContext';
import type { PrayerRequest, Poi } from '../api/types';
import { cardSurface, colors, radii, spacing } from '../theme/theme';

type Props = {
  poi: Poi;
  onSignIn: () => void;
};

export function PrayerRequestsScreen({ poi, onSignIn }: Props) {
  const { t } = useI18n();
  const { me } = useAuth();
  const [requests, setRequests] = useState<PrayerRequest[] | null>(null);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function load() {
    getPrayerRequests(poi.id)
      .then(setRequests)
      .catch(() => setError(true));
  }

  useEffect(load, [poi.id]);

  async function submit() {
    if (!message.trim()) return;
    setSubmitting(true);
    try {
      const created = await createPrayerRequest(poi.id, {
        message: message.trim(),
        authorName: authorName.trim() || undefined,
      });
      setRequests((current) => [created, ...(current ?? [])]);
      setMessage('');
      setAuthorName('');
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  }

  async function pray(id: string) {
    // The counter is behind a session too, so send them to sign in rather
    // than letting the tap fail silently.
    if (!me) {
      onSignIn();
      return;
    }
    try {
      const updated = await prayForRequest(poi.id, id);
      setRequests((current) => current?.map((r) => (r.id === id ? updated : r)) ?? null);
    } catch {
      // Non-critical — leave the count as-is if this single tap fails.
    }
  }

  return (
    <>
      <View style={styles.titleBlock}>
        <AccessibleText variant="title">{t('prayerRequests.title')}</AccessibleText>
      </View>

      {me ? (
        <View style={styles.form}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder={t('prayerRequests.messagePlaceholder')}
            multiline
            style={styles.messageInput}
          />
          <TextInput
            value={authorName}
            onChangeText={setAuthorName}
            placeholder={t('prayerRequests.namePlaceholder')}
            style={styles.nameInput}
          />
          <AccessibleButton
            label={submitting ? t('prayerRequests.sharingButton') : t('prayerRequests.shareButton')}
            onPress={submit}
            disabled={submitting || !message.trim()}
          />
        </View>
      ) : (
        <SignInNotice onSignIn={onSignIn} />
      )}

      {error && (
        <AccessibleText variant="body" color={colors.danger}>
          {t('prayerRequests.error')}
        </AccessibleText>
      )}

      {!error && requests === null && (
        <AccessibleText variant="body" color={colors.textMuted}>
          {t('prayerRequests.loading')}
        </AccessibleText>
      )}

      {requests?.map((item) => (
        <View key={item.id} style={styles.card}>
          <AccessibleText variant="body">{item.message}</AccessibleText>
          <View style={styles.cardFooter}>
            <AccessibleText variant="caption">
              — {item.authorName ?? t('common.anonymous')} · {item.prayerCount} {t('prayerRequests.prayingSuffix')}
            </AccessibleText>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('prayerRequests.prayAria')}
              onPress={() => pray(item.id)}
              style={styles.prayButton}
            >
              <CandleIcon size={16} color={colors.primary} />
              <AccessibleText variant="caption" color={colors.primary} style={styles.prayLabel}>
                {t('prayerRequests.prayButton')}
              </AccessibleText>
            </Pressable>
          </View>
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  titleBlock: {
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  form: {
    gap: spacing.sm,
    ...cardSurface,
    borderRadius: radii.lg,
    padding: spacing.lg,
  },
  messageInput: {
    minHeight: 88,
    borderRadius: radii.md,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.background,
    padding: spacing.md,
    fontSize: 18,
    textAlignVertical: 'top',
  },
  nameInput: {
    minHeight: 56,
    borderRadius: radii.md,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    fontSize: 18,
  },
  card: {
    ...cardSurface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  prayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: 44,
    paddingHorizontal: spacing.md,
    borderRadius: 9999,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  prayLabel: {
    fontWeight: '700',
  },
});
