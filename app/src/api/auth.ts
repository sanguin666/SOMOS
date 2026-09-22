import { apiGet, apiPost } from './client';
import type { Poi } from './types';

export type RequestCodeResult = {
  expiresInSeconds: number;
  // Present only when the backend has no SMS provider configured, which is
  // the normal state on a development machine. The login screen shows it so
  // the flow can be completed without a real text message arriving.
  devCode?: string;
};

export type Me = {
  id: string;
  phone?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  language: string;
  adminPois: Poi[];
  pois: Poi[];
};

export function requestPhoneCode(phone: string): Promise<RequestCodeResult> {
  return apiPost<RequestCodeResult>('/auth/phone/request-code', { phone });
}

export function verifyPhoneCode(
  phone: string,
  code: string,
  firstName?: string,
): Promise<{ accessToken: string }> {
  return apiPost<{ accessToken: string }>('/auth/phone/verify', {
    phone,
    code,
    firstName: firstName?.trim() || undefined,
  });
}

export function getMe(): Promise<Me> {
  return apiGet<Me>('/auth/me');
}

// Called whenever a signed-in person opens a place, so "my places" follows
// the account rather than the device. Joining a place you already belong to
// is not an error — the backend returns the existing membership.
export function joinPoi(qrCodeToken: string): Promise<unknown> {
  return apiPost<unknown>('/auth/me/pois', { qrCodeToken });
}
