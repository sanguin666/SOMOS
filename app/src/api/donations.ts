import { apiPost } from './client';

export function createDonation(poiId: string, body: { amount: number }): Promise<void> {
  return apiPost<void>(`/pois/${encodeURIComponent(poiId)}/donations`, body);
}
