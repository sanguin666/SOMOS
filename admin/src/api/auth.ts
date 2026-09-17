import { apiGet, apiPost } from './client';
import type { CurrentUser } from './types';

export function login(email: string, password: string): Promise<{ accessToken: string }> {
  return apiPost<{ accessToken: string }>('/auth/login', { email, password });
}

export function getCurrentUser(): Promise<CurrentUser> {
  return apiGet<CurrentUser>('/auth/me');
}
