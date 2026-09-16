import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Screen } from '../components/Screen';
import { AccessibleText } from '../components/AccessibleText';
import { AccessibleButton } from '../components/AccessibleButton';
import { BackChevronIcon } from '../components/icons';
import { createComment, getComments } from '../api/community';
import type { CommunityComment, CommunityPost, Poi } from '../api/types';
import { colors, radii, spacing } from '../theme/theme';

type Props = {
  poi: Poi;
  post: CommunityPost;
  onBack: () => void;
};

export function CommunityThreadScreen({ poi, post, onBack }: Props) {
  const [comments, setComments] = useState<CommunityComment[] | null>(null);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function load() {
    getComments(poi.id, post.id)
      .then(setComments)
      .catch(() => setError(true));
  }

  useEffect(load, [poi.id, post.id]);

  async function submit() {
    if (!message.trim()) return;
    setSubmitting(true);
    try {
      const created = await createComment(poi.id, post.id, {
        message: message.trim(),
        authorName: authorName.trim() || undefined,
      });
      setComments((current) => [...(current ?? []), created]);
      setMessage('');
      setAuthorName('');
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Screen scroll>
      <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={onBack} style={styles.iconButton}>
        <BackChevronIcon size={20} color={colors.text} />
      </Pressable>

      <View style={styles.postCard}>
        <AccessibleText variant="body">{post.message}</AccessibleText>
        <AccessibleText variant="caption">— {post.authorName ?? 'Anonymous'}</AccessibleText>
      </View>

      <AccessibleText variant="caption" style={styles.sectionLabel}>
        REPLIES
      </AccessibleText>

      {error && (
        <AccessibleText variant="body" color={colors.danger}>
          Couldn't load replies. Pull up the app again to retry.
        </AccessibleText>
      )}

      {!error && comments === null && (
        <AccessibleText variant="body" color={colors.textMuted}>
          Loading…
        </AccessibleText>
      )}

      {comments !== null && comments.length === 0 && (
        <AccessibleText variant="body" color={colors.textMuted}>
          No replies yet — be the first to respond.
        </AccessibleText>
      )}

      {comments?.map((item) => (
        <View key={item.id} style={styles.commentCard}>
          <AccessibleText variant="body">{item.message}</AccessibleText>
          <AccessibleText variant="caption">— {item.authorName ?? 'Anonymous'}</AccessibleText>
        </View>
      ))}

      <View style={styles.form}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Write a reply…"
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
          label={submitting ? 'Replying…' : 'Reply'}
          onPress={submit}
          disabled={submitting || !message.trim()}
        />
      </View>
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
  postCard: {
    marginTop: spacing.sm,
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
  },
  sectionLabel: {
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginTop: spacing.md,
  },
  commentCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  form: {
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginTop: spacing.sm,
  },
  messageInput: {
    minHeight: 72,
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
});
