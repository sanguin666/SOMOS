import type { Event } from './entities/event.entity.js';
import { EventRecurrence } from './entities/event-kinds.js';

/**
 * When a place's events happen, worked out on the server for reminders.
 * The same rules as the app's app/src/utils/schedule.ts (keep them in
 * step), but in a given time zone rather than the machine's: a repeating
 * event happens at the wall-clock time of its `startsAt` in that zone, so
 * "Sunday 10:00" stays 10:00 on either side of a clock change.
 */

type LocalDay = { year: number; month: number; day: number };
type LocalTime = LocalDay & { hour: number; minute: number; weekday: number };

const WEEKDAYS: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
const formatters = new Map<string, Intl.DateTimeFormat>();

function formatter(timeZone: string): Intl.DateTimeFormat {
  let found = formatters.get(timeZone);
  if (!found) {
    found = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hourCycle: 'h23',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      weekday: 'short',
    });
    formatters.set(timeZone, found);
  }
  return found;
}

/** Whether `timeZone` is a zone this machine knows. */
export function isTimeZone(timeZone: string | null | undefined): timeZone is string {
  if (!timeZone) return false;
  try {
    formatter(timeZone);
    return true;
  } catch {
    return false;
  }
}

/** The wall clock in `timeZone` at `date`. */
export function localTime(date: Date, timeZone: string): LocalTime {
  const parts: Record<string, string> = {};
  for (const part of formatter(timeZone).formatToParts(date)) parts[part.type] = part.value;
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour) % 24,
    minute: Number(parts.minute),
    weekday: WEEKDAYS[parts.weekday],
  };
}

/** "2026-11-11", the way exceptions are stored. */
export function dayKey(day: LocalDay): string {
  return `${day.year}-${String(day.month).padStart(2, '0')}-${String(day.day).padStart(2, '0')}`;
}

function addDays(day: LocalDay, days: number): LocalDay {
  const date = new Date(Date.UTC(day.year, day.month - 1, day.day + days));
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() };
}

function weekdayOf(day: LocalDay): number {
  return new Date(Date.UTC(day.year, day.month - 1, day.day)).getUTCDay();
}

/** The instant the wall clock in `timeZone` reads this day at hour:minute. */
function atWallClock(day: LocalDay, hour: number, minute: number, timeZone: string): Date {
  const wanted = Date.UTC(day.year, day.month - 1, day.day, hour, minute);
  let guess = wanted;
  // Two corrections settle any offset, including across a clock change.
  for (let i = 0; i < 2; i++) {
    const seen = localTime(new Date(guess), timeZone);
    guess += wanted - Date.UTC(seen.year, seen.month - 1, seen.day, seen.hour, seen.minute);
  }
  return new Date(guess);
}

export function repeats(event: Event): boolean {
  return event.recurrence === EventRecurrence.WEEKLY || event.recurrence === EventRecurrence.MONTHLY;
}

function fallsOn(event: Event, day: LocalDay, first: LocalTime, timeZone: string): boolean {
  const key = dayKey(day);
  if (key < dayKey(first)) return false;
  if (event.repeatUntil && dayKey(localTime(new Date(event.repeatUntil), timeZone)) < key) return false;
  if (event.exceptions?.some((exception) => exception.date === key)) return false;
  const weekday = weekdayOf(day);
  if (event.recurrence === EventRecurrence.MONTHLY) {
    if (event.monthlyDay) return day.day === event.monthlyDay;
    if (event.monthlyWeek == null || event.monthlyWeekday == null || weekday !== event.monthlyWeekday) return false;
    // The last one is the one with no same weekday left in the month.
    if (event.monthlyWeek === -1) return addDays(day, 7).month !== day.month;
    return Math.ceil(day.day / 7) === event.monthlyWeek;
  }
  const weekdays = event.repeatDays?.length ? event.repeatDays : [first.weekday];
  return weekdays.includes(weekday);
}

/**
 * The times an event starts after `from` and no later than `to`, soonest
 * first, days off left out. Meant for short windows (an hour or so).
 */
export function startsBetween(event: Event, from: Date, to: Date, timeZone: string): Date[] {
  const startsAt = new Date(event.startsAt);
  if (!repeats(event)) return startsAt > from && startsAt <= to ? [startsAt] : [];

  const first = localTime(startsAt, timeZone);
  const found: Date[] = [];
  const lastKey = dayKey(localTime(to, timeZone));
  // From the day before, in case the zone is behind the window's start.
  for (let day = addDays(localTime(from, timeZone), -1); dayKey(day) <= lastKey; day = addDays(day, 1)) {
    if (!fallsOn(event, day, first, timeZone)) continue;
    const start = atWallClock(day, first.hour, first.minute, timeZone);
    if (start > from && start <= to) found.push(start);
  }
  return found;
}
