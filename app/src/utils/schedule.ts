import type { Event, EventCategory } from '../api/types';

/**
 * A place's timetable. A weekly event is stored once, with its first
 * occurrence in `startsAt`; every later one is the same weekday and wall
 * clock time, up to `repeatUntil`. All of it is worked out here, on the
 * phone, in the phone's own time zone, so "Sunday 10:00" stays 10:00 on
 * either side of a clock change.
 */

export type Occurrence = {
  event: Event;
  startsAt: Date;
  endsAt: Date | null;
};

// The order a timetable lists its sections in.
export const CATEGORY_ORDER: EventCategory[] = [
  'mass',
  'confession',
  'adoration',
  'prayer',
  'office_hours',
  'other',
];

export function isWeekly(event: Event): boolean {
  return event.recurrence === 'weekly';
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function endOfDay(date: Date): Date {
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return end;
}

function durationOf(event: Event): number {
  if (!event.endsAt) return 0;
  return Math.max(0, new Date(event.endsAt).getTime() - new Date(event.startsAt).getTime());
}

function occurrence(event: Event, startsAt: Date): Occurrence {
  const duration = durationOf(event);
  return { event, startsAt, endsAt: event.endsAt ? new Date(startsAt.getTime() + duration) : null };
}

/**
 * An event's occurrences that haven't finished by `now`, soonest first,
 * up to `limit` of them. One that is happening right now counts.
 */
export function occurrencesOf(event: Event, now: Date, limit: number): Occurrence[] {
  const first = new Date(event.startsAt);
  const duration = durationOf(event);
  const stillOn = (start: Date) => start.getTime() + duration >= now.getTime();

  if (!isWeekly(event)) {
    return stillOn(first) && limit > 0 ? [occurrence(event, first)] : [];
  }

  const until = event.repeatUntil ? endOfDay(new Date(event.repeatUntil)) : null;
  // Jump close to now in whole weeks, then step: setDate keeps the wall
  // clock time, which a plain 7 × 24 h would lose at a clock change.
  const weeksBehind = Math.floor((now.getTime() - duration - first.getTime()) / (7 * 86_400_000));
  let start = addDays(first, 7 * Math.max(0, weeksBehind - 1));
  const found: Occurrence[] = [];
  while (found.length < limit) {
    if (until && start > until) break;
    if (stillOn(start)) found.push(occurrence(event, start));
    start = addDays(start, 7);
  }
  return found;
}

/** Every event's next occurrences together, soonest first. */
export function upcomingOccurrences(
  events: Event[],
  now: Date,
  limit: number,
  filter: (event: Event) => boolean = () => true,
): Occurrence[] {
  return events
    .filter(filter)
    .flatMap((event) => occurrencesOf(event, now, limit))
    .sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime())
    .slice(0, limit);
}

/** "08:30", from the phone's local time. */
export function timeKey(date: Date): string {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

// One line of a timetable: a run of days that share the same times.
// `days` are JavaScript weekdays (0 is Sunday), in the order shown.
export type TimetableRow = { days: number[]; times: string[] };

export type TimetableSection = { category: EventCategory; rows: TimetableRow[] };

/**
 * The weekly timetable, one section per kind of celebration, each line a
 * run of consecutive days with the same times: "Mon–Fri 08:30",
 * "Sun 10:00, 18:30". Weeks start on `firstDay` (1, Monday, in most of
 * Europe). Weekly events already over are left out.
 */
export function weeklyTimetable(events: Event[], now: Date, firstDay = 1): TimetableSection[] {
  const weekly = events.filter(
    (event) => isWeekly(event) && (!event.repeatUntil || endOfDay(new Date(event.repeatUntil)) >= now),
  );
  const weekOrder = Array.from({ length: 7 }, (_, i) => (firstDay + i) % 7);

  const sections: TimetableSection[] = [];
  for (const category of CATEGORY_ORDER) {
    const inCategory = weekly.filter((event) => event.category === category);
    if (inCategory.length === 0) continue;

    const timesByDay = new Map<number, Set<string>>();
    for (const event of inCategory) {
      const start = new Date(event.startsAt);
      const times = timesByDay.get(start.getDay()) ?? new Set<string>();
      // A Mass is a moment; an open office or an hour of adoration is a
      // stretch of time someone can drop in on, so it shows when it ends.
      const end = category !== 'mass' && event.endsAt ? new Date(event.endsAt) : null;
      times.add(end ? `${timeKey(start)}–${timeKey(end)}` : timeKey(start));
      timesByDay.set(start.getDay(), times);
    }

    const rows: TimetableRow[] = [];
    for (const day of weekOrder) {
      const times = timesByDay.get(day);
      if (!times) continue;
      const sorted = [...times].sort();
      const previous = rows[rows.length - 1];
      const lastDay = previous?.days[previous.days.length - 1];
      const follows = lastDay !== undefined && weekOrder.indexOf(day) === weekOrder.indexOf(lastDay) + 1;
      if (previous && follows && previous.times.join() === sorted.join()) {
        previous.days.push(day);
      } else {
        rows.push({ days: [day], times: sorted });
      }
    }
    sections.push({ category, rows });
  }
  return sections;
}

// The locale weekday names are written in, from the app's language.
const DAY_LOCALES: Record<string, string> = { en: 'en-GB', es: 'es-ES', fr: 'fr-FR' };

function capitalise(text: string): string {
  return text.charAt(0).toLocaleUpperCase() + text.slice(1);
}

/** A JavaScript weekday (0 is Sunday) by name, in the app's language. */
export function weekdayName(day: number, language: string, style: 'long' | 'short' = 'long'): string {
  // 6 September 2026 is a Sunday; any week would do.
  const date = new Date(2026, 8, 6 + day, 12);
  return date.toLocaleDateString(DAY_LOCALES[language] ?? language, { weekday: style });
}

/**
 * A timetable row's days: "Sunday", "Saturday, Sunday", or for three or
 * more in a row "Mon–Fri".
 */
export function formatDays(days: number[], language: string): string {
  if (days.length >= 3) {
    const first = weekdayName(days[0], language, 'short');
    const last = weekdayName(days[days.length - 1], language, 'short');
    return capitalise(`${first}–${last}`);
  }
  return capitalise(days.map((day) => weekdayName(day, language)).join(', '));
}

function sameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/**
 * When an occurrence is, the short way people say it: "Today", "Tomorrow",
 * the weekday within the week, a date after that, and just the date for
 * one already past (a message, say). The caller supplies the
 * words for today and tomorrow in the app's language.
 */
export function formatWhen(
  date: Date,
  now: Date,
  language: string,
  words: { today: string; tomorrow: string },
): string {
  const locale = DAY_LOCALES[language] ?? language;
  let day: string;
  if (sameDay(date, now)) day = words.today;
  else if (sameDay(date, addDays(now, 1))) day = words.tomorrow;
  else if (date > now && date.getTime() - now.getTime() < 6 * 86_400_000) {
    day = capitalise(weekdayName(date.getDay(), language));
  } else if (date > now) {
    day = capitalise(date.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' }));
  } else {
    // Something already said or done: its date is what matters.
    day = date.toLocaleDateString(locale, { day: 'numeric', month: 'long' });
  }
  return `${day} · ${timeKey(date)}`;
}
