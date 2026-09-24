import { apiDelete, apiGet, apiPatch, apiPost, apiPostForm } from './client';
import type { Announcement } from './types';

export type AnnouncementInput = { title: string; body?: string; important: boolean };

export function getAnnouncements(poiId: string): Promise<Announcement[]> {
  return apiGet<Announcement[]>(`/pois/${poiId}/announcements`);
}

export function createAnnouncement(poiId: string, body: AnnouncementInput): Promise<Announcement> {
  return apiPost<Announcement>(`/pois/${poiId}/announcements`, body);
}

export function updateAnnouncement(
  poiId: string,
  id: string,
  body: Partial<AnnouncementInput>,
): Promise<Announcement> {
  return apiPatch<Announcement>(`/pois/${poiId}/announcements/${id}`, body);
}

export function deleteAnnouncement(poiId: string, id: string): Promise<void> {
  return apiDelete<void>(`/pois/${poiId}/announcements/${id}`);
}

// The post's photo goes up on its own, once the post exists.
export function uploadAnnouncementImage(poiId: string, id: string, file: File): Promise<Announcement> {
  const formData = new FormData();
  formData.append('image', file);
  return apiPostForm<Announcement>(`/pois/${poiId}/announcements/${id}/image`, formData);
}

export function removeAnnouncementImage(poiId: string, id: string): Promise<Announcement> {
  return apiDelete<Announcement>(`/pois/${poiId}/announcements/${id}/image`);
}
