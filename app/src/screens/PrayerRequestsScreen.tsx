import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Screen } from '../components/Screen';
import { AccessibleText } from '../components/AccessibleText';
import { AccessibleButton } from '../components/AccessibleButton';
import { BackChevronIcon, CandleIcon } from '../components/icons';
import { createPrayerRequest, getPrayerRequests, prayForRequest } from '../api/prayerRequests';
import type { PrayerRequest, Poi } from '../api/types';
import { colors, radii, spacing } from '../theme/theme';

type Props = {
  poi: Poi;
  onBack: () => void;
};

export function PrayerRequestsScreen({ poi, onBack }: Props) {
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
    try {
      const updated = await prayForRequest(poi.id, id);
      setRequests((current) => current?.map((r) => (r.id === id ? updated : r)) ?? null);
    } catch {
      // Non-critical — leave the count as-is if this single tap fails.
    }
  }

  return (
    <Screen scroll>
      <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={onBack} style={styles.iconButton}>
        <BackChevronIcon size={20} color={colors.text} />
      </Pressable>

      <View style={styles.titleBlock}>
        <AccessibleText variant="title">Prayer Requests</AccessibleText>
        <AccessibleText variant="body" color={colors.textMuted}>
          {poi.name}
        </AccessibleText>
      </View>

      <View style={styles.form}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Share a prayer request…"
          multiline
          style={styles.messageInput}
        />
        <TextInput
          value={authorName}
          onChangeText={setAuthorName}
          placeholder="Your name (optional)"
          style={styles.nameInput}
        />
        <AccessibleButton
          label={submitting ? 'Sharing…' : 'Share request'}
          onPress={submit}
          disabled={submitting || !message.trim()}
        />
      </View>

      {error && (
        <AccessibleText variant="body" color={colors.danger}>
          Couldn't load prayer requests. Pull up the app again to retry.
        </AccessibleText>
      )}

      {!error && requests === null && (
        <AccessibleText variant="body" color={colors.textMuted}>
          Loading…
        </AccessibleText>
      )}

      {requests?.map((item) => (
        <View key={item.id} style={styles.card}>
          <AccessibleText variant="body">{item.message}</AccessibleText>
          <View style={styles.cardFooter}>
            <AccessibleText variant="caption">
              — {item.authorName ?? 'Anonymous'} · {item.prayerCount} praying
            </AccessibleText>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`I'm praying for this`}
              onPress={() => pray(item.id)}
              style={styles.prayButton}
            >
              <CandleIcon size={16} color={colors.primary} />
              <AccessibleText variant="caption" color={colors.primary} style={styles.prayLabel}>
                Pray
              </AccessibleText>
            </Pressable>
          </View>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
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
  form: {
    gap: spacing.sm,
    backgroundColor: colors.surface,
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
    backgroundColor: colors.surface,
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
