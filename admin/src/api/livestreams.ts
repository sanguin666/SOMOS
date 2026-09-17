import { apiDelete, apiGet, apiPatch, apiPost } from './client';
import type { Livestream, LivestreamStatus } from './types';

export function getLivestreams(poiId: string): Promise<Livestream[]> {
  return apiGet<Livestream[]>(`/pois/${poiId}/livestreams`);
}

export function createLivestream(
  poiId: string,
  body: { title: string; url: string; scheduledAt: string; status?: LivestreamStatus },
): Promise<Livestream> {
  return apiPost<Livestream>(`/pois/${poiId}/livestreams`, body);
}

export function updateLivestream(
  poiId: string,
  id: string,
  body: Partial<{ title: string; url: string; scheduledAt: string; status: LivestreamStatus }>,
): Promise<Livestream> {
  return apiPatch<Livestream>(`/pois/${poiId}/livestreams/${id}`, body);
}

export function deleteLivestream(poiId: string, id: string): Promise<void> {
  return apiDelete<void>(`/pois/${poiId}/livestreams/${id}`);
}
