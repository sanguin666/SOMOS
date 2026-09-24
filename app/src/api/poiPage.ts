import { apiGet } from './client';
import type { PoiBadge, PoiPageBlock } from './types';

export function getPoiPageBlocks(poiId: string): Promise<PoiPageBlock[]> {
  return apiGet<PoiPageBlock[]>(`/pois/${encodeURIComponent(poiId)}/page-blocks`);
}

export function getPoiBadges(poiId: string): Promise<PoiBadge[]> {
  return apiGet<PoiBadge[]>(`/pois/${encodeURIComponent(poiId)}/badges`);
}
