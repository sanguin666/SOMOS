import { apiDelete, apiGet, apiPatch, apiPost } from './client';
import type { ActiveModule, ModuleStatus, ModuleType } from './types';

export function getActiveModules(poiId: string): Promise<ActiveModule[]> {
  return apiGet<ActiveModule[]>(`/pois/${poiId}/active-modules`);
}

export function activateModule(poiId: string, moduleType: ModuleType): Promise<ActiveModule> {
  return apiPost<ActiveModule>(`/pois/${poiId}/active-modules`, {
    moduleType,
    status: 'active' satisfies ModuleStatus,
  });
}

export function setModuleStatus(
  poiId: string,
  id: string,
  status: ModuleStatus,
): Promise<ActiveModule> {
  return apiPatch<ActiveModule>(`/pois/${poiId}/active-modules/${id}`, { status });
}

export function removeModule(poiId: string, id: string): Promise<void> {
  return apiDelete<void>(`/pois/${poiId}/active-modules/${id}`);
}
