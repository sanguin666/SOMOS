import type { Me } from './api/auth';
import type { Poi } from './api/types';

/**
 * Which place the app should open for somebody who is already signed in.
 *
 * One place and there is nothing to choose; several and it is wherever
 * they were last, which the backend remembers so it survives a new phone.
 * A remembered place they have since left — or that has been deleted —
 * is ignored rather than opened, and null means they belong to nowhere
 * yet and should be asked to add a place.
 */
export function landingPoi(me: Me): Poi | null {
  const [first, ...rest] = me.pois;
  if (!first) return null;
  if (rest.length === 0) return first;
  return me.pois.find((poi) => poi.id === me.lastActivePoiId) ?? first;
}
