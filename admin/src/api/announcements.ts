import { apiDelete, apiGet, apiPatch, apiPost } from './client';
import type { Announcement } from './types';

export function getAnnouncements(poiId: string): Promise<Announcement[]> {
  return apiGet<Announcement[]>(`/pois/${poiId}/announcements`);
}

export function createAnnouncement(
  poiId: string,
  body: { title: string; body?: string },
): Promise<Announcement> {
  return apiPost<Announcement>(`/pois/${poiId}/announcements`, body);
}

export function updateAnnouncement(
  poiId: string,
  id: string,
  body: { title?: string; body?: string },
): Promise<Announcement> {
  return apiPatch<Announcement>(`/pois/${poiId}/announcements/${id}`, body);
}

export function deleteAnnouncement(poiId: string, id: string): Promise<void> {
  return apiDelete<void>(`/pois/${poiId}/announcements/${id}`);
}
