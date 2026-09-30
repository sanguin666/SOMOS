import { apiGet } from './client';
import type { ActiveModule } from './types';

export function getActiveModules(poiId: string): Promise<ActiveModule[]> {
  return apiGet<ActiveModule[]>(`/pois/${poiId}/active-modules`);
}

