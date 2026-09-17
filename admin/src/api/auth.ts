import { apiGet, apiPatch, apiPost } from './client';
import type { CurrentUser, SupportedLanguage } from './types';

export function login(email: string, password: string): Promise<{ accessToken: string }> {
  return apiPost<{ accessToken: string }>('/auth/login', { email, password });
}

export function getCurrentUser(): Promise<CurrentUser> {
  return apiGet<CurrentUser>('/auth/me');
}

export function updateMyLanguage(language: SupportedLanguage): Promise<{ language: SupportedLanguage }> {
  return apiPatch<{ language: SupportedLanguage }>('/auth/me/language', { language });
}
