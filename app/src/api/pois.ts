import { apiGet } from './client';
import type { ActiveModule, Poi } from './types';

export function getPoiByQrCode(qrCodeToken: string): Promise<Poi> {
  return apiGet<Poi>(`/pois/qr/${encodeURIComponent(qrCodeToken)}`);
}

// Used when re-opening a place the device already remembers: only its id
// is stored, and the place may have been renamed since.
export function getPoi(id: string): Promise<Poi> {
  return apiGet<Poi>(`/pois/${encodeURIComponent(id)}`);
}

export function getActiveModules(poiId: string): Promise<ActiveModule[]> {
  return apiGet<ActiveModule[]>(`/pois/${encodeURIComponent(poiId)}/active-modules`);
}
