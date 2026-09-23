import { apiDelete, apiGet, apiPatch, apiPost } from './client';
import type { Event, EventCategory, EventRecurrence } from './types';

// null clears endsAt / repeatUntil on an update.
export type EventInput = {
  title: string;
  startsAt: string;
  endsAt?: string | null;
  location?: string;
  description?: string;
  category?: EventCategory;
  recurrence?: EventRecurrence;
  repeatUntil?: string | null;
};

export function getEvents(poiId: string): Promise<Event[]> {
  return apiGet<Event[]>(`/pois/${poiId}/events`);
}

export function createEvent(poiId: string, body: EventInput): Promise<Event> {
  return apiPost<Event>(`/pois/${poiId}/events`, body);
}

export function updateEvent(poiId: string, id: string, body: Partial<EventInput>): Promise<Event> {
  return apiPatch<Event>(`/pois/${poiId}/events/${id}`, body);
}

export function deleteEvent(poiId: string, id: string): Promise<void> {
  return apiDelete<void>(`/pois/${poiId}/events/${id}`);
}
