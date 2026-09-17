import { apiPatch } from './client';
import type { Poi, SupportedLanguage } from './types';

export function updatePoiLanguage(poiId: string, language: SupportedLanguage): Promise<Poi> {
  return apiPatch<Poi>(`/pois/${poiId}/language`, { language });
}
