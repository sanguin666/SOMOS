import { apiGet } from './client';
import type { Livestream } from './types';

export function getLivestreams(poiId: string): Promise<Livestream[]> {
  return apiGet<Livestream[]>(`/pois/${encodeURIComponent(poiId)}/livestreams`);
}
