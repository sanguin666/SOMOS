import { apiDelete, apiGet, apiPatch, apiPut } from './client';

export type ReadingKind = 'first' | 'psalm' | 'second' | 'gospel' | 'other';

export type ReadingSection = {
  kind: ReadingKind;
  title: string | null;
  reference: string | null;
  text: string;
};

export type DailyReading = {
  id: string;
  // YYYY-MM-DD
  date: string;
  word: string | null;
  sections: ReadingSection[];
  published: boolean;
  // "07:00", or null for no notification.
  notifyAt: string | null;
  notifiedAt: string | null;
};

export type DailyReadingInput = Pick<DailyReading, 'word' | 'sections' | 'published' | 'notifyAt'>;

/** Every day between two dates, drafts included. */
export function getReadingsForOffice(poiId: string, from: string, to: string): Promise<DailyReading[]> {
  return apiGet<DailyReading[]>(`/pois/${poiId}/readings/manage?from=${from}&to=${to}`);
}

export function saveReading(poiId: string, date: string, body: DailyReadingInput): Promise<DailyReading> {
  return apiPut<DailyReading>(`/pois/${poiId}/readings/${date}`, body);
}

export function deleteReading(poiId: string, date: string): Promise<void> {
  return apiDelete<void>(`/pois/${poiId}/readings/${date}`);
}

export function getReadingsSettings(poiId: string): Promise<{ linkUrl: string | null }> {
  return apiGet<{ linkUrl: string | null }>(`/pois/${poiId}/readings/settings`);
}

export function updateReadingsSettings(poiId: string, linkUrl: string | null): Promise<{ linkUrl: string | null }> {
  return apiPatch<{ linkUrl: string | null }>(`/pois/${poiId}/readings/settings`, { linkUrl });
}
