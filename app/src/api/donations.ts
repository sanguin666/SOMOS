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

/**
 * Starts a gift. Comes back with a Stripe checkout page to open, or
 * `mode: 'demo'` when the backend has no Stripe key — see the backend's
 * donations/stripe.service.ts.
 */
export function startDonationCheckout(
  poiId: string,
  body: { amount: number },
): Promise<CheckoutResult> {
  return apiPost<CheckoutResult>(`/pois/${encodeURIComponent(poiId)}/donations/checkout`, body);
}

export function getDonationStatus(poiId: string, donationId: string): Promise<DonationStatus> {
  return apiGet<DonationStatus>(
    `/pois/${encodeURIComponent(poiId)}/donations/${encodeURIComponent(donationId)}/status`,
  );
}
