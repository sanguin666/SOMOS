import { apiGet } from './client';
import type { PoiPageBlock } from './types';

export function getPoiPageBlocks(poiId: string): Promise<PoiPageBlock[]> {
  return apiGet<PoiPageBlock[]>(`/pois/${encodeURIComponent(poiId)}/page-blocks`);
}
