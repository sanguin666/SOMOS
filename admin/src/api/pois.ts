import { apiGet } from './client';
import type { Poi } from './types';

export function getPoi(poiId: string): Promise<Poi> {
  return apiGet<Poi>(`/pois/${poiId}`);
}
