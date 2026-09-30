import { apiGet } from './client';

export type ReadingKind = 'first' | 'psalm' | 'second' | 'gospel' | 'other';

export type ReadingSection = {
  kind: ReadingKind;
  // Shown in place of the kind's name when the office wrote one.
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
};

export type ReadingsSettings = {
  // An official site for the day's readings; `{date}` stands for YYYY-MM-DD.
  linkUrl: string | null;
};

/** Published days up to `today` (the phone's date), newest first. */
export function getReadings(poiId: string, today: string): Promise<DailyReading[]> {
  return apiGet<DailyReading[]>(`/pois/${encodeURIComponent(poiId)}/readings?today=${today}`);
}

export function getReadingsSettings(poiId: string): Promise<ReadingsSettings> {
  return apiGet<ReadingsSettings>(`/pois/${encodeURIComponent(poiId)}/readings/settings`);
}
