import { apiDelete, apiGet, apiPatch, apiPost, apiPostForm } from './client';
import type { PageBlockType, PoiPageBlock } from './types';

export function getPageBlocks(poiId: string): Promise<PoiPageBlock[]> {
  return apiGet<PoiPageBlock[]>(`/pois/${poiId}/page-blocks`);
}

export function createPageBlock(
  poiId: string,
  body: { type: PageBlockType; title?: string; body?: string; imageUrl?: string; itemCount?: number },
): Promise<PoiPageBlock> {
  return apiPost<PoiPageBlock>(`/pois/${poiId}/page-blocks`, body);
}

export function updatePageBlock(
  poiId: string,
  id: string,
  body: { title?: string; body?: string; imageUrl?: string; itemCount?: number },
): Promise<PoiPageBlock> {
  return apiPatch<PoiPageBlock>(`/pois/${poiId}/page-blocks/${id}`, body);
}

export function deletePageBlock(poiId: string, id: string): Promise<void> {
  return apiDelete<void>(`/pois/${poiId}/page-blocks/${id}`);
}

// Must list every block of the POI, in the order they should appear.
export function reorderPageBlocks(poiId: string, ids: string[]): Promise<PoiPageBlock[]> {
  return apiPost<PoiPageBlock[]>(`/pois/${poiId}/page-blocks/reorder`, { ids });
}

export function uploadPageImage(poiId: string, file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append('image', file);
  return apiPostForm<{ url: string }>(`/pois/${poiId}/page-blocks/image`, formData);
}
