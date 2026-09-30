import { apiGet, apiPost, apiPut } from './client';
import type { BillingInterval, BillingSummary, ModuleType } from './types';

const base = (poiId: string) => `/pois/${poiId}/billing`;

export function getBilling(poiId: string): Promise<BillingSummary> {
  return apiGet<BillingSummary>(base(poiId));
}

// "Essayer 1 mois gratuit", or "Activer" for a free or offered module.
export function startModule(poiId: string, type: ModuleType): Promise<BillingSummary> {
  return apiPost<BillingSummary>(`${base(poiId)}/modules/${type}/start`, {});
}

// Pays straight away for a module whose trial is used.
export function subscribeModule(poiId: string, type: ModuleType): Promise<BillingSummary> {
  return apiPost<BillingSummary>(`${base(poiId)}/modules/${type}/subscribe`, {});
}

export function stopModule(poiId: string, type: ModuleType): Promise<BillingSummary> {
  return apiPost<BillingSummary>(`${base(poiId)}/modules/${type}/stop`, {});
}

export function resumeModule(poiId: string, type: ModuleType): Promise<BillingSummary> {
  return apiPost<BillingSummary>(`${base(poiId)}/modules/${type}/resume`, {});
}

export function setBillingInterval(poiId: string, interval: BillingInterval): Promise<BillingSummary> {
  return apiPut<BillingSummary>(`${base(poiId)}/interval`, { interval });
}

export function setPaymentMethod(poiId: string, kind: 'sepa' | 'card', last4: string): Promise<BillingSummary> {
  return apiPut<BillingSummary>(`${base(poiId)}/payment-method`, { kind, last4 });
}

