import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { AccessibleText } from '../components/AccessibleText';
import { AccessibleButton } from '../components/AccessibleButton';
import { ChevronRightIcon, PlayIcon } from '../components/icons';
import { uploadUri } from '../api/client';
import { getPoiPageBlocks } from '../api/poiPage';
import { getAnnouncements } from '../api/announcements';
import { getEvents } from '../api/events';
import { getLivestreams } from '../api/livestreams';
import { TimetableRows } from '../components/Timetable';
import { formatWhen, isWeekly, upcomingOccurrences, weeklyTimetable } from '../utils/schedule';
import type {
  ActiveModule,
  Announcement,
  Event,
  Livestream,
  ModuleType,
  PageBlockType,
  Poi,
  PoiPageBlock,
} from '../api/types';
import type { HubTab } from '../components/PoiShell';
import { cardSurface, colors, radii, spacing } from '../theme/theme';
import { getPoiTheme } from '../theme/poiThemes';
import { useI18n } from '../i18n/I18nContext';

type Props = {
  poi: Poi;
  modules: ActiveModule[] | null;
  onSelectTab: (tab: HubTab) => void;
};

// What a POI that hasn't built a page yet gets: the two things a
// congregant opens the app for. The admin dashboard offers exactly this
// as a starting point, so a POI can adopt it and then edit it.
const DEFAULT_BLOCKS: PoiPageBlock[] = [
  {
    id: 'default:celebration-times',
    type: 'celebration_times',
    position: 0,
    title: null,
    body: null,
    imageUrl: null,
    itemCount: 1,
  },
  {
    id: 'default:next-events',
    type: 'next_events',
    position: 0,
    title: null,
    body: null,
    imageUrl: null,
    itemCount: 1,
  },
  {
    id: 'default:latest-announcements',
    type: 'latest_announcements',
    position: 1,
    title: null,
    body: null,
    imageUrl: null,
    itemCount: 2,
  },
];

// A live block is only worth rendering while the module behind it is on.
const BLOCK_MODULE: Partial<Record<PageBlockType, ModuleType>> = {
  celebration_times: 'events',
  next_events: 'events',
  past_events: 'events',
  latest_announcements: 'announcements',
  next_livestream: 'livestreams',
  donate: 'donations',
};

function formatShortDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

/**
 * A POI's home page: the blocks its admins arranged in the dashboard, in
 * their order, falling back to a sensible default page when they haven't
 * built one. This is what a congregant lands on when they open the place,
 * before they pick anything from the menu.
 */
export function PoiHomeScreen({ poi, modules, onSelectTab }: Props) {
  const { t, language } = useI18n();
  const poiTheme = getPoiTheme(poi.type);

  const [blocks, setBlocks] = useState<PoiPageBlock[] | null>(null);
  const [events, setEvents] = useState<Event[] | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[] | null>(null);
  const [livestreams, setLivestreams] = useState<Livestream[] | null>(null);

  const isLive = (type: ModuleType) =>
    modules?.some((m) => m.moduleType === type && m.status !== 'expired' && m.status !== 'cancelled') ??
    false;

  useEffect(() => {
    let cancelled = false;
    getPoiPageBlocks(poi.id)
      .then((result) => {
        if (!cancelled) setBlocks(result.length > 0 ? result : DEFAULT_BLOCKS);
      })
      // A page nobody could load shouldn't leave the screen blank — the
      // default page is still better than nothing, and every module stays
      // reachable from the tab bar either way.
      .catch(() => {
        if (!cancelled) setBlocks(DEFAULT_BLOCKS);
      });
    return () => {
      cancelled = true;
    };
  }, [poi.id]);

  // Each live block's content is fetched once, only if some block on the
  // page actually asks for it and its module is on.
  const visible = (blocks ?? []).filter((block) => {
    const required = BLOCK_MODULE[block.type];
    return !required || isLive(required);
  });
  const needsEvents = visible.some(
    (b) => b.type === 'celebration_times' || b.type === 'next_events' || b.type === 'past_events',
  );
  const needsAnnouncements = visible.some((b) => b.type === 'latest_announcements');
  const needsLivestreams = visible.some((b) => b.type === 'next_livestream');

  useEffect(() => {
    if (!needsEvents) return;
    let cancelled = false;
    getEvents(poi.id)
      .then((result) => {
        if (!cancelled) setEvents(result);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [poi.id, needsEvents]);

  useEffect(() => {
    if (!needsAnnouncements) return;
    let cancelled = false;
    getAnnouncements(poi.id)
      .then((result) => {
        if (!cancelled) setAnnouncements(result);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [poi.id, needsAnnouncements]);

  useEffect(() => {
    if (!needsLivestreams) return;
    let cancelled = false;
    getLivestreams(poi.id)
      .then((result) => {
        if (!cancelled) setLivestreams(result);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [poi.id, needsLivestreams]);

  if (blocks === null) {
    return (
      <AccessibleText variant="body" color={colors.textMuted}>
        {t('common.loading')}
      </AccessibleText>
    );
  }

  if (visible.length === 0) {
    return (
      <AccessibleText variant="body" color={colors.textMuted}>
        {t('hub.noModules')}
      </AccessibleText>
    );
  }

  const now = Date.now();
  // The next and past event blocks are for one-off events. The weekly
  // ones have the timetable block, and would otherwise sit in "past"
  // forever, their first occurrence being long gone.
  const oneOffs = (events ?? []).filter((e) => !isWeekly(e));
  const upcoming = oneOffs
    .filter((e) => new Date(e.startsAt).getTime() >= now)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  const past = oneOffs
    .filter((e) => new Date(e.startsAt).getTime() < now)
    .sort((a, b) => b.startsAt.localeCompare(a.startsAt));
  // The API returns livestreams newest-scheduled first, so the last
  // not-yet-ended one is the soonest to come. If they have all ended, show
  // the most recent as a replay.
  const notEnded = (livestreams ?? []).filter((l) => l.status !== 'ended');
  const nextLivestream = notEnded[notEnded.length - 1] ?? (livestreams ?? [])[0];

  return (
    <>
      {visible.map((block) => {
        switch (block.type) {
          case 'text':
            return (
              <View key={block.id} style={styles.section}>
                {!!block.title && (
                  <AccessibleText variant="bodyLarge" style={styles.blockTitle}>
                    {block.title}
                  </AccessibleText>
                )}
                {!!block.body && <AccessibleText variant="body">{block.body}</AccessibleText>}
              </View>
            );

          case 'image':
            if (!block.imageUrl) return null;
            return (
              <View key={block.id} style={styles.section}>
                <Image
                  source={{ uri: uploadUri(block.imageUrl) }}
                  style={styles.image}
                  resizeMode="cover"
                  accessibilityLabel={block.title || poi.name}
                />
                {!!block.title && (
                  <AccessibleText variant="caption" color={colors.textMuted}>
                    {block.title}
                  </AccessibleText>
                )}
              </View>
            );

          case 'celebration_times': {
            // Succinct by design: the next Mass, then the week's Masses
            // in a few lines. Confessions and the rest are one tap away.
            const today = new Date(now);
            const timetable = weeklyTimetable(events ?? [], today);
            const [nextMass] = upcomingOccurrences(events ?? [], today, 1, (e) => e.category === 'mass');
            const massTimes = timetable.find((section) => section.category === 'mass');
            if (!nextMass && !massTimes) return null;
            return (
              <View key={block.id} style={styles.section}>
                <SectionHeader
                  label={block.title || t('hub.celebrationTimes')}
                  accent={poiTheme.accentStrong}
                  onSeeAll={() => onSelectTab('events')}
                  seeAllLabel={t('hub.seeAll')}
                />
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={
                    nextMass
                      ? `${t('hub.nextMass')}: ${formatWhen(nextMass.startsAt, today, language, {
                          today: t('schedule.today'),
                          tomorrow: t('schedule.tomorrow'),
                        })}`
                      : t('hub.celebrationTimes')
                  }
                  onPress={() => onSelectTab('events')}
                  style={styles.timesCard}
                >
                  {nextMass && (
                    <View style={styles.nextMass}>
                      <AccessibleText variant="caption" color={poiTheme.accentStrong} style={styles.nextMassLabel}>
                        {t('hub.nextMass')}
                      </AccessibleText>
                      <AccessibleText variant="bodyLarge" style={styles.cardTitle}>
                        {formatWhen(nextMass.startsAt, today, language, {
                          today: t('schedule.today'),
                          tomorrow: t('schedule.tomorrow'),
                        })}
                      </AccessibleText>
                      {!!(nextMass.event.location || nextMass.event.title) && (
                        <AccessibleText variant="caption" color={colors.textMuted}>
                          {[nextMass.event.title, nextMass.event.location].filter(Boolean).join(' · ')}
                        </AccessibleText>
                      )}
                    </View>
                  )}
                  {massTimes && <TimetableRows rows={massTimes.rows} />}
                </Pressable>
              </View>
            );
          }

          case 'next_events':
          case 'past_events': {
            const list = block.type === 'next_events' ? upcoming : past;
            const shown = list.slice(0, block.itemCount);
            if (shown.length === 0) return null;
            const fallbackHeading =
              block.type === 'past_events'
                ? t('hub.pastEvents')
                : block.itemCount === 1
                  ? t('hub.nextEvent')
                  : t('hub.upcomingEvents');
            return (
              <View key={block.id} style={styles.section}>
                <SectionHeader
                  label={block.title || fallbackHeading}
                  accent={poiTheme.accentStrong}
                  onSeeAll={() => onSelectTab('events')}
                  seeAllLabel={t('hub.seeAll')}
                />
                {shown.map((event) => (
                  <Pressable
                    key={event.id}
                    accessibilityRole="button"
                    accessibilityLabel={event.title}
                    onPress={() => onSelectTab('events')}
                    style={styles.eventCard}
                  >
                    <View style={[styles.eventDateChip, { backgroundColor: poiTheme.accentStrong }]}>
                      <AccessibleText variant="caption" color="#FFFFFF" style={styles.eventDateMonth}>
                        {new Date(event.startsAt)
                          .toLocaleDateString(undefined, { month: 'short' })
                          .toUpperCase()}
                      </AccessibleText>
                      <AccessibleText variant="bodyLarge" color="#FFFFFF" style={styles.eventDateDay}>
                        {new Date(event.startsAt).getDate()}
                      </AccessibleText>
                    </View>
                    <View style={styles.eventText}>
                      <AccessibleText variant="bodyLarge" style={styles.cardTitle}>
                        {event.title}
                      </AccessibleText>
                      {!!event.location && (
                        <AccessibleText variant="caption" color={colors.textMuted}>
                          {event.location}
                        </AccessibleText>
                      )}
                    </View>
                    <ChevronRightIcon size={20} color={colors.textMuted} />
                  </Pressable>
                ))}
              </View>
            );
          }

          case 'latest_announcements': {
            const shown = (announcements ?? []).slice(0, block.itemCount);
            if (shown.length === 0) return null;
            return (
              <View key={block.id} style={styles.section}>
                <SectionHeader
                  label={block.title || t('hub.latestAnnouncements')}
                  accent={poiTheme.accentStrong}
                  onSeeAll={() => onSelectTab('announcements')}
                  seeAllLabel={t('hub.seeAll')}
                />
                {shown.map((item) => (
                  <Pressable
                    key={item.id}
                    accessibilityRole="button"
                    accessibilityLabel={item.title}
                    onPress={() => onSelectTab('announcements')}
                    style={styles.feedCard}
                  >
                    <View style={styles.feedCardHeader}>
                      <AccessibleText variant="bodyLarge" style={styles.cardTitle}>
                        {item.title}
                      </AccessibleText>
                      <AccessibleText variant="caption">{formatShortDate(item.createdAt)}</AccessibleText>
                    </View>
                    {!!item.body && (
                      <AccessibleText variant="body" color={colors.textMuted} numberOfLines={2}>
                        {item.body}
                      </AccessibleText>
                    )}
                  </Pressable>
                ))}
              </View>
            );
          }

          case 'next_livestream': {
            if (!nextLivestream) return null;
            return (
              <View key={block.id} style={styles.section}>
                <SectionHeader
                  label={block.title || t('hub.nextLivestream')}
                  accent={poiTheme.accentStrong}
                  onSeeAll={() => onSelectTab('livestreams')}
                  seeAllLabel={t('hub.seeAll')}
                />
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={nextLivestream.title}
                  onPress={() => onSelectTab('livestreams')}
                  style={styles.feedCard}
                >
                  <View style={styles.livestreamRow}>
                    <View style={[styles.eventDateChip, { backgroundColor: poiTheme.accentStrong }]}>
                      <PlayIcon size={22} color="#FFFFFF" />
                    </View>
                    <View style={styles.eventText}>
                      <AccessibleText variant="bodyLarge" style={styles.cardTitle}>
                        {nextLivestream.title}
                      </AccessibleText>
                      <AccessibleText variant="caption" color={colors.textMuted}>
                        {formatShortDate(nextLivestream.scheduledAt)}
                      </AccessibleText>
                    </View>
                    <ChevronRightIcon size={20} color={colors.textMuted} />
                  </View>
                </Pressable>
              </View>
            );
          }

          case 'donate':
            return (
              <View key={block.id} style={styles.section}>
                {!!block.title && (
                  <AccessibleText variant="bodyLarge" style={styles.blockTitle}>
                    {block.title}
                  </AccessibleText>
                )}
                {!!block.body && (
                  <AccessibleText variant="body" color={colors.textMuted}>
                    {block.body}
                  </AccessibleText>
                )}
                <AccessibleButton
                  label={t('hub.donationsLabel')}
                  onPress={() => onSelectTab('donations')}
                />
              </View>
            );

          default:
            return null;
        }
      })}
    </>
  );
}

function SectionHeader({
  label,
  accent,
  onSeeAll,
  seeAllLabel,
}: {
  label: string;
  accent: string;
  onSeeAll: () => void;
  seeAllLabel: string;
}) {
  return (
    <View style={styles.sectionHeader}>
      <AccessibleText variant="caption" style={styles.sectionLabel}>
        {label}
      </AccessibleText>
      <Pressable accessibilityRole="button" accessibilityLabel={seeAllLabel} onPress={onSeeAll} style={styles.seeAllButton}>
        <AccessibleText variant="caption" color={accent} style={styles.seeAllLabel}>
          {seeAllLabel}
        </AccessibleText>
        <ChevronRightIcon size={16} color={accent} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.sm,
  },
  blockTitle: {
    fontWeight: '800',
  },
  image: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: radii.lg,
    ...cardSurface,
  },
  timesCard: {
    ...cardSurface,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xs,
  },
  nextMass: {
    paddingVertical: spacing.md,
    gap: 2,
  },
  nextMassLabel: {
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionLabel: {
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    flexShrink: 1,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    minHeight: 32,
  },
  seeAllLabel: {
    fontWeight: '700',
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    ...cardSurface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    minHeight: 64,
  },
  livestreamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  eventDateChip: {
    width: 48,
    height: 48,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventDateMonth: {
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  eventDateDay: {
    fontWeight: '800',
  },
  eventText: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    fontWeight: '700',
  },
  feedCard: {
    ...cardSurface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  feedCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
});
