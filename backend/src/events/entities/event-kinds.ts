/**
 * What an event is, so the app can group a place's regular week under
 * headings people recognise ("Masses", "Confessions") and the Mass
 * intentions module knows which celebrations can carry an intention.
 */
export enum EventCategory {
  MASS = 'mass',
  CONFESSION = 'confession',
  ADORATION = 'adoration',
  PRAYER = 'prayer',
  // When the office (the welcome desk) is open — not a celebration, but
  // the other thing everybody asks the times of.
  OFFICE_HOURS = 'office_hours',
  OTHER = 'other',
}

/**
 * Whether an event happens once or repeats. Repeating is what turns the
 * events list into a timetable: "Sunday Mass at 10:30" is one row the
 * community writes once, not fifty-two.
 *
 * - WEEKLY: on the weekdays in `repeatDays` (all seven for "every day"),
 *   or on the weekday of `startsAt` when that is empty.
 * - MONTHLY: once a month, either on the nth weekday (`monthlyWeek` of
 *   `monthlyWeekday`, e.g. the first Friday; -1 is the last) or on a date
 *   (`monthlyDay`, e.g. the 15th).
 */
export enum EventRecurrence {
  NONE = 'none',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

/** A day a repeating event does not happen: Christmas, a retreat. */
export type EventException = {
  // YYYY-MM-DD, the place's local date.
  date: string;
  // Shown to members: "the priest is on retreat".
  reason?: string | null;
};
