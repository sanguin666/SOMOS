import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { AccessibleText } from '../components/AccessibleText';
import { AccessibleButton } from '../components/AccessibleButton';
import { ChatBubbleIcon, ChevronRightIcon } from '../components/icons';
import { createCommunityPost, getCommunityPosts } from '../api/community';
import { SignInNotice } from '../components/SignInNotice';
import { useAuth } from '../auth/AuthContext';
import { useI18n } from '../i18n/I18nContext';
import type { CommunityPost, Poi } from '../api/types';
import { colors, radii, spacing } from '../theme/theme';

type Props = {
  poi: Poi;
  onOpenPost: (post: CommunityPost) => void;
  onSignIn: () => void;
};

export function CommunityScreen({ poi, onOpenPost, onSignIn }: Props) {
  const { t } = useI18n();
  const { me } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[] | null>(null);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function load() {
    getCommunityPosts(poi.id)
      .then(setPosts)
      .catch(() => setError(true));
  }

  useEffect(load, [poi.id]);

  async function submit() {
    if (!message.trim()) return;
    setSubmitting(true);
    try {
      const created = await createCommunityPost(poi.id, {
        message: message.trim(),
        authorName: authorName.trim() || undefined,
      });
      setPosts((current) => [created, ...(current ?? [])]);
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
      <View style={styles.titleBlock}>
        <AccessibleText variant="title">{t('community.title')}</AccessibleText>
      </View>

      {me ? (
        <View style={styles.form}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder={t('community.messagePlaceholder')}
            multiline
            style={styles.messageInput}
          />
          <TextInput
            value={authorName}
            onChangeText={setAuthorName}
            placeholder={t('community.namePlaceholder')}
            style={styles.nameInput}
          />
          <AccessibleButton
            label={submitting ? t('community.postingButton') : t('community.postButton')}
            onPress={submit}
            disabled={submitting || !message.trim()}
          />
        </View>
      ) : (
        <SignInNotice onSignIn={onSignIn} />
      )}

      {error && (
        <AccessibleText variant="body" color={colors.danger}>
          {t('community.error')}
        </AccessibleText>
      )}

      {!error && posts === null && (
        <AccessibleText variant="body" color={colors.textMuted}>
          {t('community.loading')}
        </AccessibleText>
      )}

      {posts?.map((item) => (
        <Pressable
          key={item.id}
          accessibilityRole="button"
          accessibilityLabel={t('community.openAria', { message: item.message })}
          onPress={() => onOpenPost(item)}
          style={styles.card}
        >
          <View style={styles.cardBody}>
            <AccessibleText variant="body">{item.message}</AccessibleText>
            <View style={styles.cardFooter}>
              <AccessibleText variant="caption">— {item.authorName ?? t('common.anonymous')}</AccessibleText>
              <View style={styles.commentCount}>
                <ChatBubbleIcon size={16} color={colors.primary} />
                <AccessibleText variant="caption" color={colors.primary} style={styles.commentCountLabel}>
                  {item.commentCount}
                </AccessibleText>
              </View>
            </View>
          </View>
          <ChevronRightIcon size={20} color={colors.textMuted} />
        </Pressable>
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
  },
  cardBody: {
    flex: 1,
    gap: spacing.sm,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  commentCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  commentCountLabel: {
    fontWeight: '700',
  },
});
