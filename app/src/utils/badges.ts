import type { Event, ModuleType, PoiBadge } from '../api/types';
import type { Campaign } from '../api/donations';
import type { useI18n } from '../i18n/I18nContext';
import { formatShortWhen, occurrencesOf, timeKey, upcomingOccurrences } from './schedule';

/** One tile, ready to draw: a small label over a bold value. */
export type BadgeTile = {
  id: string;
  // A message fills the row and has no label; the rest share it in two.
  wide: boolean;
  important: boolean;
  label: string | null;
  value: string;
  icon: 'mass' | 'confession' | 'open' | 'closed' | 'campaign' | 'message' | 'alert';
  // The module a touch opens, when it is on for this place.
  opens: ModuleType | null;
};

export type BadgeContext = {
  events: Event[] | null;
  campaigns: Campaign[] | null;
  isLive: (module: ModuleType) => boolean;
  now: Date;
  language: string;
  t: ReturnType<typeof useI18n>['t'];
};

function capitalise(text: string): string {
  return text.charAt(0).toLocaleUpperCase() + text.slice(1);
}

/** Today as YYYY-MM-DD in the phone's own calendar. */
function localDay(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/**
 * What each badge says right now, in the staff's order. An automatic
 * badge with nothing to say (no Mass on the timetable, events switched
 * off) is left out rather than drawn empty. There is no cap: a place
 * shows as many as it switches on.
 */
export function badgeTiles(badges: PoiBadge[], ctx: BadgeContext): BadgeTile[] {
  const { events, campaigns, isLive, now, language, t } = ctx;
  const words = { today: t('badges.today'), tomorrow: t('badges.tomorrow') };
  // On its own line ("Sat 18:30", "Sam. 18:30"), or inside a sentence
  // ("opens today 10:00", "ouvre mar. 10:00").
  const when = (date: Date) => capitalise(formatShortWhen(date, now, language, words));
  const whenInline = (date: Date) =>
    formatShortWhen(date, now, language, {
      today: words.today.toLocaleLowerCase(),
      tomorrow: words.tomorrow.toLocaleLowerCase(),
    });
  const timetable = isLive('events') ? (events ?? []) : [];

  const tiles: BadgeTile[] = [];
  for (const badge of badges) {
    const tile = tileFor(badge);
    if (tile) tiles.push(tile);
  }
  return tiles;

  function tileFor(badge: PoiBadge): BadgeTile | null {
    const base = { id: badge.id, wide: false, important: false };
    switch (badge.kind) {
      case 'message': {
        // The server already hides these, but a phone left open overnight
        // shouldn't keep yesterday's "closed today".
        if (!badge.text || (badge.showUntil && badge.showUntil < localDay(now))) return null;
        const opens = badge.linkModule && isLive(badge.linkModule) ? badge.linkModule : null;
        return {
          ...base,
          wide: true,
          important: badge.important,
          label: null,
          value: badge.text,
          icon: badge.important ? 'alert' : 'message',
          opens,
        };
      }
      case 'next_mass':
      case 'next_confession': {
        const category = badge.kind === 'next_mass' ? 'mass' : 'confession';
        const [next] = upcomingOccurrences(timetable, now, 1, (e) => e.category === category);
        if (!next) return null;
        return {
          ...base,
          label: t(badge.kind === 'next_mass' ? 'badges.mass' : 'badges.confession'),
          value: when(next.startsAt),
          icon: category,
          opens: 'events',
        };
      }
      case 'office_hours': {
        const office = timetable.filter((e) => e.category === 'office_hours');
        const openNow = office
          .flatMap((e) => occurrencesOf(e, now, 1))
          .find((o) => o.startsAt <= now && o.endsAt && o.endsAt > now);
        if (openNow?.endsAt) {
          return {
            ...base,
            label: t('badges.officeOpen'),
            value: t('badges.until', { time: timeKey(openNow.endsAt) }),
            icon: 'open',
            opens: 'events',
          };
        }
        const [next] = upcomingOccurrences(office, now, 1);
        if (!next) return null;
        return {
          ...base,
          label: t('badges.officeClosed'),
          value: t('badges.opens', { when: whenInline(next.startsAt) }),
          icon: 'closed',
          opens: 'events',
        };
      }
      case 'campaign': {
        if (!isLive('donations')) return null;
        const open = (campaigns ?? []).filter((c) => c.active);
        // Without a choice, the newest open campaign: the API lists them
        // newest first.
        const campaign = badge.campaignId ? open.find((c) => c.id === badge.campaignId) : open[0];
        if (!campaign) return null;
        const percent = campaign.goalAmount
          ? Math.min(100, Math.round((campaign.raised / campaign.goalAmount) * 100))
          : null;
        return {
          ...base,
          label: campaign.title,
          value: percent === null ? t('badges.give') : t('badges.raised', { percent }),
          icon: 'campaign',
          opens: 'donations',
        };
      }
      default:
        return null;
    }
  }
}
