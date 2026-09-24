import { apiDelete, apiGet, apiPatch, apiPost } from './client';
import type { BadgeKind, ModuleType, PoiBadge } from './types';

export type BadgeInput = {
  enabled?: boolean;
  text?: string | null;
  important?: boolean;
  linkModule?: ModuleType | null;
  campaignId?: string | null;
  showUntil?: string | null;
};

// Every badge, the switched-off ones too. The first call saves the
// starter set, so the list is never empty.
export function getBadges(poiId: string): Promise<PoiBadge[]> {
  return apiGet<PoiBadge[]>(`/pois/${poiId}/badges/all`);
}

// Added at the end of the list. A `message` needs its text.
export function createBadge(poiId: string, body: BadgeInput & { kind: BadgeKind }): Promise<PoiBadge> {
  return apiPost<PoiBadge>(`/pois/${poiId}/badges`, body);
}

export function updateBadge(poiId: string, id: string, body: BadgeInput): Promise<PoiBadge> {
  return apiPatch<PoiBadge>(`/pois/${poiId}/badges/${id}`, body);
}

export function deleteBadge(poiId: string, id: string): Promise<void> {
  return apiDelete<void>(`/pois/${poiId}/badges/${id}`);
}

// Must list every badge of the POI, in the order they should appear.
export function reorderBadges(poiId: string, ids: string[]): Promise<PoiBadge[]> {
  return apiPost<PoiBadge[]>(`/pois/${poiId}/badges/reorder`, { ids });
}
