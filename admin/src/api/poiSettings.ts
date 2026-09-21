import { apiPatch } from './client';
import type { ModuleType, Poi, SupportedLanguage } from './types';

export function updatePoiLanguage(poiId: string, language: SupportedLanguage): Promise<Poi> {
  return apiPatch<Poi>(`/pois/${poiId}/language`, { language });
}

export function updatePoiProfile(
  poiId: string,
  body: { description?: string; pictureUrl?: string; qrFlyerHeadline?: string; qrFlyerSubtext?: string },
): Promise<Poi> {
  return apiPatch<Poi>(`/pois/${poiId}/profile`, body);
}

export function updatePoiMenuOrder(poiId: string, menuOrder: ModuleType[]): Promise<Poi> {
  return apiPatch<Poi>(`/pois/${poiId}/menu-order`, { menuOrder });
}
