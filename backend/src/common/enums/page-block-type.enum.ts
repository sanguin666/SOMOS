/**
 * The kinds of blocks a POI can stack on its home page — the screen a
 * congregant lands on when they open the place, before choosing anything
 * from the menu.
 *
 * Two families: the ones the POI writes itself (TEXT, IMAGE) and the ones
 * that pull live content from a module it already runs (the rest). The
 * live ones render nothing when their module isn't active, so turning a
 * module off never leaves a broken section behind.
 */
export enum PageBlockType {
  TEXT = 'text',
  IMAGE = 'image',
  NEXT_EVENTS = 'next_events',
  PAST_EVENTS = 'past_events',
  LATEST_ANNOUNCEMENTS = 'latest_announcements',
  NEXT_LIVESTREAM = 'next_livestream',
  DONATE = 'donate',
  // The place's regular week (Masses, confessions, office hours), built
  // from its repeating events: the short answer to "when is Mass?".
  CELEBRATION_TIMES = 'celebration_times',
}
