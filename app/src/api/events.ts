import { apiGet } from './client';
import type { Event } from './types';

// Events (Mass times, baptisms, weddings, etc.) are posted by parish staff
// from the admin dashboard — the app only ever reads them.
export function getEvents(poiId: string): Promise<Event[]> {
  return apiGet<Event[]>(`/pois/${encodeURIComponent(poiId)}/events`);
}
