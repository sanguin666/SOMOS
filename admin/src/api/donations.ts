import { apiDelete, apiGet, apiPatch, apiPost } from './client';
import type { Campaign, Donation, DonationStats, ReceiptList } from './types';

export function getDonationStats(poiId: string): Promise<DonationStats> {
  return apiGet<DonationStats>(`/pois/${poiId}/donations/stats`);
}

export function getRecentDonations(poiId: string, limit = 8): Promise<Donation[]> {
  return apiGet<Donation[]>(`/pois/${poiId}/donations?limit=${limit}`);
}

// ---- Campaigns ----

export type CampaignInput = {
  title: string;
  description?: string | null;
  goalAmount?: number | null;
  endsAt?: string | null;
  active?: boolean;
};

// Every campaign, the hidden ones too, with what each has raised.
export function getCampaigns(poiId: string): Promise<Campaign[]> {
  return apiGet<Campaign[]>(`/pois/${poiId}/campaigns/all`);
}

export function createCampaign(poiId: string, body: CampaignInput): Promise<Campaign> {
  return apiPost<Campaign>(`/pois/${poiId}/campaigns`, body);
}

export function updateCampaign(poiId: string, id: string, body: Partial<CampaignInput>): Promise<Campaign> {
  return apiPatch<Campaign>(`/pois/${poiId}/campaigns/${id}`, body);
}

// The campaign's gifts are kept; they just stop counting towards a goal.
export function deleteCampaign(poiId: string, id: string): Promise<void> {
  return apiDelete<void>(`/pois/${poiId}/campaigns/${id}`);
}

// ---- Tax receipts ----

export function getReceipts(poiId: string, year: number): Promise<ReceiptList> {
  return apiGet<ReceiptList>(`/pois/${poiId}/donations/receipts?year=${year}`);
}
