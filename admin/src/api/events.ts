import { apiDelete, apiGet, apiPatch, apiPost } from './client';
import type { Event } from './types';

export function getEvents(poiId: string): Promise<Event[]> {
  return apiGet<Event[]>(`/pois/${poiId}/events`);
}

export function createEvent(
  poiId: string,
  body: { title: string; startsAt: string; location?: string; description?: string },
): Promise<Event> {
  return apiPost<Event>(`/pois/${poiId}/events`, body);
}

export function updateEvent(
  poiId: string,
  id: string,
  body: { title?: string; startsAt?: string; location?: string; description?: string },
): Promise<Event> {
  return apiPatch<Event>(`/pois/${poiId}/events/${id}`, body);
}

export function deleteEvent(poiId: string, id: string): Promise<void> {
  return apiDelete<void>(`/pois/${poiId}/events/${id}`);
}
