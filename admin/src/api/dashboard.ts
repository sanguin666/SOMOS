import { apiGet } from './client';
import type { DashboardSummary } from './types';

// What is waiting on the office, and the week's numbers; see
// backend/src/dashboard/dashboard.service.ts.
export function getDashboard(poiId: string): Promise<DashboardSummary> {
  return apiGet<DashboardSummary>(`/pois/${poiId}/dashboard`);
}
