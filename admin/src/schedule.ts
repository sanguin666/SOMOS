import type { Event } from './api/types';

/**
 * When a community's events happen. The app has the same rules in
 * app/src/utils/schedule.ts: a repeating event's `startsAt` is the first
 * day it can happen and its time every time; a weekly one falls on
 * `repeatDays` (or the weekday of `startsAt`), a monthly one on the nth
 * weekday or a day of the month; it stops after `repeatUntil` and skips
 * the days in `exceptions`. Worked out in the browser's own time.
 */

function startOfDay(date: Date): Date {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

/** "2026-11-11", the browser's own day, the way exceptions are stored. */
export function dayKey(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** The weekdays a weekly event happens on (0 is Sunday). */
export function weekdaysOf(event: Pick<Event, 'repeatDays' | 'startsAt'>): number[] {
  return event.repeatDays?.length ? event.repeatDays : [new Date(event.startsAt).getDay()];
}

function occursOn(event: Event, day: Date): boolean {
  if (event.recurrence === 'none') return startOfDay(new Date(event.startsAt)).getTime() === day.getTime();
  if (startOfDay(new Date(event.startsAt)) > day) return false;
  if (event.repeatUntil && new Date(event.repeatUntil) < day) return false;
  if (event.exceptions?.some((exception) => exception.date === dayKey(day))) return false;
  if (event.recurrence === 'weekly') return weekdaysOf(event).includes(day.getDay());
  if (event.monthlyDay) return day.getDate() === event.monthlyDay;
  if (event.monthlyWeek == null || day.getDay() !== event.monthlyWeekday) return false;
  if (event.monthlyWeek === -1) return addDays(day, 7).getMonth() !== day.getMonth();
  return Math.ceil(day.getDate() / 7) === event.monthlyWeek;
}

/** Every time the events start between `from` and `to`, soonest first. */
export function occurrencesBetween(events: Event[], from: Date, to: Date): { event: Event; at: Date }[] {
  const found: { event: Event; at: Date }[] = [];
  for (let day = startOfDay(from); day <= to; day = addDays(day, 1)) {
    for (const event of events) {
      if (!occursOn(event, day)) continue;
      const first = new Date(event.startsAt);
      const at = new Date(day);
      at.setHours(first.getHours(), first.getMinutes(), 0, 0);
      if (event.recurrence === 'none') at.setTime(first.getTime());
      if (at >= from && at <= to) found.push({ event, at });
    }
  }
  return found.sort((a, b) => a.at.getTime() - b.at.getTime());
}
