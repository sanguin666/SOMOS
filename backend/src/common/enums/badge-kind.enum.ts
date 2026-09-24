/**
 * What a badge at the top of a place's home page says. MESSAGE is written
 * by the place's staff; the others are worked out on the phone from the
 * place's own timetable and giving, so they never go stale.
 */
export enum BadgeKind {
  MESSAGE = 'message',
  NEXT_MASS = 'next_mass',
  OFFICE_HOURS = 'office_hours',
  NEXT_CONFESSION = 'next_confession',
  CAMPAIGN = 'campaign',
}
