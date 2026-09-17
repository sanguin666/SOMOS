import { apiDelete, apiGet } from './client';
import type { PrayerRequest } from './types';

export function getPrayerRequests(poiId: string): Promise<PrayerRequest[]> {
  return apiGet<PrayerRequest[]>(`/pois/${poiId}/prayer-requests`);
}

export function deletePrayerRequest(poiId: string, id: string): Promise<void> {
  return apiDelete<void>(`/pois/${poiId}/prayer-requests/${id}`);
}
