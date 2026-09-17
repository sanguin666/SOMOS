import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Screen } from '../components/Screen';
import { AccessibleText } from '../components/AccessibleText';
import { AccessibleButton } from '../components/AccessibleButton';
import { BackChevronIcon } from '../components/icons';
import { createComment, getComments } from '../api/community';
import { useI18n } from '../i18n/I18nContext';
import type { CommunityComment, CommunityPost, Poi } from '../api/types';
import { colors, radii, spacing } from '../theme/theme';

type Props = {
  poi: Poi;
  post: CommunityPost;
  onBack: () => void;
};

export function CommunityThreadScreen({ poi, post, onBack }: Props) {
  const { t } = useI18n();
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
      <Pressable accessibilityRole="button" accessibilityLabel={t('common.back')} onPress={onBack} style={styles.iconButton}>
        <BackChevronIcon size={20} color={colors.text} />
      </Pressable>

      <View style={styles.postCard}>
        <AccessibleText variant="body">{post.message}</AccessibleText>
        <AccessibleText variant="caption">— {post.authorName ?? t('common.anonymous')}</AccessibleText>
      </View>

      <AccessibleText variant="caption" style={styles.sectionLabel}>
        {t('communityThread.repliesLabel')}
      </AccessibleText>

      {error && (
        <AccessibleText variant="body" color={colors.danger}>
          {t('communityThread.error')}
        </AccessibleText>
      )}

      {!error && comments === null && (
        <AccessibleText variant="body" color={colors.textMuted}>
          {t('communityThread.loading')}
        </AccessibleText>
      )}

      {comments !== null && comments.length === 0 && (
        <AccessibleText variant="body" color={colors.textMuted}>
          {t('communityThread.empty')}
        </AccessibleText>
      )}

      {comments?.map((item) => (
        <View key={item.id} style={styles.commentCard}>
          <AccessibleText variant="body">{item.message}</AccessibleText>
          <AccessibleText variant="caption">— {item.authorName ?? t('common.anonymous')}</AccessibleText>
        </View>
      ))}

      <View style={styles.form}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder={t('communityThread.messagePlaceholder')}
          multiline
          style={styles.messageInput}
        />
        <TextInput
          value={authorName}
          onChangeText={setAuthorName}
          placeholder={t('communityThread.namePlaceholder')}
          style={styles.nameInput}
        />
        <AccessibleButton
          label={submitting ? t('communityThread.replyingButton') : t('communityThread.replyButton')}
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
