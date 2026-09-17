import { apiGet } from './client';
import type { Donation, DonationStats } from './types';

export function getDonationStats(poiId: string): Promise<DonationStats> {
  return apiGet<DonationStats>(`/pois/${poiId}/donations/stats`);
}

export function getRecentDonations(poiId: string, limit = 8): Promise<Donation[]> {
  return apiGet<Donation[]>(`/pois/${poiId}/donations?limit=${limit}`);
}
