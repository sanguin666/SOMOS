import { apiGet } from './client';
import type { ActiveModule, Poi } from './types';

export function getPoiByQrCode(qrCodeToken: string): Promise<Poi> {
  return apiGet<Poi>(`/pois/qr/${encodeURIComponent(qrCodeToken)}`);
}

export function getActiveModules(poiId: string): Promise<ActiveModule[]> {
  return apiGet<ActiveModule[]>(`/pois/${encodeURIComponent(poiId)}/active-modules`);
}
