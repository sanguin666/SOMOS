import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AccessibleText } from '../components/AccessibleText';
import { AccessibleButton } from '../components/AccessibleButton';
import { FormCard, FormDivider, FormField } from '../components/FormCard';
import { BackChevronIcon } from '../components/icons';
import { createComment, getComments } from '../api/community';
import { SignInNotice } from '../components/SignInNotice';
import { useAuth } from '../auth/AuthContext';
import { useI18n } from '../i18n/I18nContext';
import type { CommunityComment, CommunityPost, Poi } from '../api/types';
import { cardSurface, colors, radii, spacing } from '../theme/theme';

type Props = {
  poi: Poi;
  post: CommunityPost;
  onBack: () => void;
  onSignIn: () => void;
};

export function CommunityThreadScreen({ poi, post, onBack, onSignIn }: Props) {
  const { t } = useI18n();
  const { me } = useAuth();
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
    <>
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

      {me ? (
        <>
          <FormCard>
              <FormField
                label={t('communityThread.messagePlaceholder')}
                value={message}
                onChangeText={setMessage}
                multiline
                tall
              />
              <FormDivider />
              <FormField
                label={t('communityThread.namePlaceholder')}
                value={authorName}
                onChangeText={setAuthorName}
              />
            </FormCard>

            <AccessibleButton
              label={submitting ? t('communityThread.replyingButton') : t('communityThread.replyButton')}
              onPress={submit}
              disabled={submitting || !message.trim()}
            />
        </>
      ) : (
        <SignInNotice onSignIn={onSignIn} />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 9999,
    ...cardSurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postCard: {
    marginTop: spacing.sm,
    gap: spacing.sm,
    ...cardSurface,
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
    ...cardSurface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.xs,
  },
});
