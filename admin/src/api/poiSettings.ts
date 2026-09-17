import { apiPatch } from './client';
import type { Poi, SupportedLanguage } from './types';

export function updatePoiLanguage(poiId: string, language: SupportedLanguage): Promise<Poi> {
  return apiPatch<Poi>(`/pois/${poiId}/language`, { language });
}

export function updatePoiProfile(
  poiId: string,
  body: { description?: string; pictureUrl?: string; qrFlyerHeadline?: string; qrFlyerSubtext?: string },
): Promise<Poi> {
  return apiPatch<Poi>(`/pois/${poiId}/profile`, body);
}
