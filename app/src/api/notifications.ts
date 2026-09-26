import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from './client';

export type NotificationPreferences = {
  news: boolean;
  requests: boolean;
  events: boolean;
  live: boolean;
};

export type NotificationKind = keyof NotificationPreferences;

export function registerPushToken(token: string, language: string, timeZone?: string): Promise<void> {
  return apiPost<void>('/auth/me/push-tokens', { token, language, timeZone });
}

export function removePushToken(token: string): Promise<void> {
  return apiDelete(`/auth/me/push-tokens/${encodeURIComponent(token)}`);
}

export function getNotificationPreferences(poiId: string): Promise<NotificationPreferences> {
  return apiGet<NotificationPreferences>(`/auth/me/pois/${encodeURIComponent(poiId)}/notifications`);
}

export function updateNotificationPreferences(
  poiId: string,
  change: Partial<NotificationPreferences>,
): Promise<NotificationPreferences> {
  return apiPatch<NotificationPreferences>(`/auth/me/pois/${encodeURIComponent(poiId)}/notifications`, change);
}

/** The events in a place whose bell is on. */
export function getEventReminders(poiId: string): Promise<string[]> {
  return apiGet<string[]>(`/auth/me/pois/${encodeURIComponent(poiId)}/event-reminders`);
}

export function setEventReminder(eventId: string, on: boolean): Promise<void> {
  const path = `/auth/me/event-reminders/${encodeURIComponent(eventId)}`;
  return on ? apiPut(path) : apiDelete(path);
}
