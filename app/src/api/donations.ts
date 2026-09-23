import { apiGet, apiPost } from './client';

export type DonationsConfig = {
  paymentsEnabled: boolean;
  currency: string;
};

export type CheckoutResult =
  | { mode: 'demo'; donationId: string }
  | { mode: 'stripe'; donationId: string; checkoutUrl: string };

export type DonationStatus = {
  status: 'pending' | 'completed' | 'failed';
  amount: number;
};

export function getDonationsConfig(): Promise<DonationsConfig> {
  return apiGet<DonationsConfig>('/donations/config');
}

export type DonationPurpose = 'general' | 'collection' | 'campaign';

// A project the community is raising money for (a new roof, the organ).
export type Campaign = {
  id: string;
  title: string;
  description: string | null;
  goalAmount: number | null;
  endsAt: string | null;
  active: boolean;
  raised: number;
  giftCount: number;
};

export type CheckoutBody = {
  amount: number;
  donorName?: string;
  purpose?: DonationPurpose;
  campaignId?: string;
  // Monthly; needs the giver to be signed in.
  recurring?: boolean;
  wantsReceipt?: boolean;
  donorAddress?: string;
  donorPostalCode?: string;
  donorCity?: string;
  donorTaxId?: string | null;
};

export type MonthlyGift = {
  id: string;
  amount: number;
  purpose: DonationPurpose;
  campaign: { id: string; title: string } | null;
  createdAt: string;
};

// A year the giver asked for a receipt in. `url` is a signed link to the
// printable receipt: prefix it with API_BASE_URL.
export type ReceiptYear = { year: number; total: number; url: string };

/**
 * Starts a gift. Comes back with a Stripe checkout page to open, or
 * `mode: 'demo'` when the backend has no Stripe key — see the backend's
 * donations/stripe.service.ts.
 */
export function startDonationCheckout(
  poiId: string,
  body: CheckoutBody,
): Promise<CheckoutResult> {
  return apiPost<CheckoutResult>(`/pois/${encodeURIComponent(poiId)}/donations/checkout`, body);
}

export function getDonationStatus(poiId: string, donationId: string): Promise<DonationStatus> {
  return apiGet<DonationStatus>(
    `/pois/${encodeURIComponent(poiId)}/donations/${encodeURIComponent(donationId)}/status`,
  );
}

export function getCampaigns(poiId: string): Promise<Campaign[]> {
  return apiGet<Campaign[]>(`/pois/${encodeURIComponent(poiId)}/campaigns`);
}

export function getMyMonthlyGifts(poiId: string): Promise<MonthlyGift[]> {
  return apiGet<MonthlyGift[]>(`/pois/${encodeURIComponent(poiId)}/donations/mine/monthly`);
}

export function stopMonthlyGift(poiId: string, donationId: string): Promise<void> {
  return apiPost<void>(
    `/pois/${encodeURIComponent(poiId)}/donations/mine/monthly/${encodeURIComponent(donationId)}/stop`,
  );
}

export function getMyReceipts(poiId: string): Promise<ReceiptYear[]> {
  return apiGet<ReceiptYear[]>(`/pois/${encodeURIComponent(poiId)}/donations/mine/receipts`);
}
