import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { AccessibleText } from '../components/AccessibleText';
import { ChevronRightIcon, PlusIcon } from '../components/icons';
import { getAnnouncements } from '../api/announcements';
import { uploadUri } from '../api/client';
import { useI18n } from '../i18n/I18nContext';
import type { Announcement, Poi } from '../api/types';
import { cardSurface, colors, minTouchTarget, radii, spacing } from '../theme/theme';
import { formatNewsDate, ImportantLabel } from './AnnouncementScreen';

type Props = {
  poi: Poi;
  onCompose: () => void;
  onOpen: (item: Announcement) => void;
  // Announcements are the community speaking to its members, so only staff
  // get the compose button. See the backend's announcements controller.
  canCompose: boolean;
};

// A post this recent is flagged "New" above its title.
const NEW_FOR_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * The News tab: the newest post big, with its photo and the start of its
 * text, then every earlier one as a row in one white box — the same list
 * as the projects on the Donations tab. Any post opens its own page.
 */
export function AnnouncementsScreen({ poi, onCompose, onOpen, canCompose }: Props) {
  const { t } = useI18n();
  const [announcements, setAnnouncements] = useState<Announcement[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getAnnouncements(poi.id)
      .then((result) => {
        if (!cancelled) setAnnouncements(result);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [poi.id]);

  const [latest, ...earlier] = announcements ?? [];

  return (
    <>
      <View style={styles.headerRow}>
        <AccessibleText variant="title" style={styles.title} accessibilityRole="header">
          {t('announcements.title')}
        </AccessibleText>
        {canCompose && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('announcements.newAria')}
            onPress={onCompose}
            style={styles.iconButton}
          >
            <PlusIcon size={20} color={colors.text} />
          </Pressable>
        )}
      </View>

      {error && (
        <AccessibleText variant="body" color={colors.danger}>
          {t('announcements.error')}
        </AccessibleText>
      )}

      {!error && announcements === null && (
        <AccessibleText variant="body" color={colors.textMuted}>
          {t('announcements.loading')}
        </AccessibleText>
      )}

      {announcements?.length === 0 && (
        <AccessibleText variant="body" color={colors.textMuted}>
          {t('announcements.empty')}
        </AccessibleText>
      )}

      {latest && <LatestPost item={latest} onPress={() => onOpen(latest)} />}

      {earlier.length > 0 && (
        <>
          <AccessibleText variant="caption" style={styles.sectionLabel}>
            {t('announcements.earlier')}
          </AccessibleText>
          <View style={styles.listCard}>
            {earlier.map((item, index) => (
              <PostRow key={item.id} item={item} divider={index > 0} onPress={() => onOpen(item)} />
            ))}
          </View>
        </>
      )}
    </>
  );
}

function LatestPost({ item, onPress }: { item: Announcement; onPress: () => void }) {
  const { t } = useI18n();
  const isNew = Date.now() - new Date(item.createdAt).getTime() < NEW_FOR_MS;
  const date = formatNewsDate(item.createdAt);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${item.title}, ${date}`}
      accessibilityHint={t('announcements.readMore')}
      onPress={onPress}
      style={styles.latestCard}
    >
      {item.imageUrl ? (
        <Image source={{ uri: uploadUri(item.imageUrl) }} style={styles.latestPhoto} resizeMode="cover" />
      ) : null}
      <View style={styles.latestText}>
        <View style={styles.metaRow}>
          {item.important && <ImportantLabel />}
          <AccessibleText variant="caption" color={colors.primaryStrong} style={styles.meta}>
            {isNew ? `${t('announcements.new')} · ${date}` : date}
          </AccessibleText>
        </View>
        <AccessibleText variant="bodyLarge" style={styles.bold}>
          {item.title}
        </AccessibleText>
        {!!item.body && (
          <AccessibleText variant="body" color={colors.textMuted} numberOfLines={3}>
            {item.body}
          </AccessibleText>
        )}
        {!item.body && !!item.audioUrl && (
          <AccessibleText variant="body" color={colors.textMuted}>
            {t('announcements.voiceMessage')}
          </AccessibleText>
        )}
        <AccessibleText variant="body" color={colors.primaryStrong} style={styles.bold}>
          {t('announcements.readMore')} ›
        </AccessibleText>
      </View>
    </Pressable>
  );
}

/** An earlier post: its photo, or its date on a coral tile, then its title. */
function PostRow({ item, divider, onPress }: { item: Announcement; divider: boolean; onPress: () => void }) {
  const { t } = useI18n();
  const created = new Date(item.createdAt);
  const date = formatNewsDate(item.createdAt);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${item.title}, ${date}`}
      onPress={onPress}
      style={[styles.row, divider && styles.divider]}
    >
      {item.imageUrl ? (
        <Image source={{ uri: uploadUri(item.imageUrl) }} style={styles.thumb} resizeMode="cover" />
      ) : (
        <View style={[styles.thumb, styles.dateTile]}>
          <AccessibleText variant="bodyLarge" color={colors.primaryStrong} style={styles.dateDay}>
            {created.getDate()}
          </AccessibleText>
          <AccessibleText variant="caption" color={colors.primaryStrong} style={styles.dateMonth}>
            {created.toLocaleDateString(undefined, { month: 'short' }).replace('.', '')}
          </AccessibleText>
        </View>
      )}
      <View style={styles.flex}>
        {item.important && <ImportantLabel />}
        <AccessibleText variant="bodyLarge" style={styles.bold}>
          {item.title}
        </AccessibleText>
        {/* A date tile already says the day, so the line under the title
            only repeats it next to a photo. */}
        {(!!item.imageUrl || !!item.audioUrl) && (
          <AccessibleText variant="caption">
            {[item.imageUrl ? date : null, item.audioUrl ? t('announcements.voiceMessage') : null]
              .filter(Boolean)
              .join(' · ')}
          </AccessibleText>
        )}
      </View>
      <ChevronRightIcon size={22} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    gap: 2,
    alignItems: 'flex-start',
  },
  bold: {
    fontWeight: '700',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  title: {
    fontSize: 28,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 9999,
    ...cardSurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  latestCard: {
    ...cardSurface,
    borderRadius: radii.lg,
    overflow: 'hidden',
  },
  latestPhoto: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  latestText: {
    padding: spacing.md,
    gap: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  meta: {
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  sectionLabel: {
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginTop: spacing.md,
  },
  listCard: {
    ...cardSurface,
    borderRadius: radii.lg,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: minTouchTarget,
    padding: spacing.md,
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  thumb: {
    width: 60,
    height: 60,
    borderRadius: radii.md,
  },
  // Not a box inside the white one: a filled tile, like the thumbnails.
  dateTile: {
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateDay: {
    fontWeight: '800',
    lineHeight: 26,
  },
  dateMonth: {
    fontWeight: '700',
    fontSize: 13,
    lineHeight: 15,
    textTransform: 'uppercase',
  },
});
