import { apiGet, apiPost } from './client';
import type { PrayerRequest } from './types';

export function getPrayerRequests(poiId: string): Promise<PrayerRequest[]> {
  return apiGet<PrayerRequest[]>(`/pois/${encodeURIComponent(poiId)}/prayer-requests`);
}

export function createPrayerRequest(
  poiId: string,
  body: { authorName?: string; message: string },
): Promise<PrayerRequest> {
  return apiPost<PrayerRequest>(`/pois/${encodeURIComponent(poiId)}/prayer-requests`, body);
}

export function prayForRequest(poiId: string, requestId: string): Promise<PrayerRequest> {
  return apiPost<PrayerRequest>(
    `/pois/${encodeURIComponent(poiId)}/prayer-requests/${encodeURIComponent(requestId)}/pray`,
  );
}
