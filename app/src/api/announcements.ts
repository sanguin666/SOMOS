import { apiGet } from './client';
import type { Announcement } from './types';

export function getAnnouncements(poiId: string): Promise<Announcement[]> {
  return apiGet<Announcement[]>(`/pois/${encodeURIComponent(poiId)}/announcements`);
}
