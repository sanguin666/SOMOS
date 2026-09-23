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
 * Whether an event happens once or every week at the same time. Weekly
 * is what turns the events list into a timetable: "Sunday Mass at 10:30"
 * is one row the community writes once, not fifty-two.
 */
export enum EventRecurrence {
  NONE = 'none',
  WEEKLY = 'weekly',
}
