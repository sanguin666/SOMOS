import { createContext, useContext } from 'react';
import type { PoiBadge, PoiPageBlock } from '../api/types';

/**
 * What the dashboard's live preview hands the home page instead of what
 * the server has: the badges and sections as they stand in the editor,
 * saved or not, and which of them are not saved yet so they can be drawn
 * as drafts. Null everywhere but inside the preview.
 */
export type PreviewState = {
  badges: PoiBadge[] | null;
  blocks: PoiPageBlock[] | null;
  drafts: string[];
};

export const PreviewContext = createContext<PreviewState | null>(null);

export function usePreview(): PreviewState | null {
  return useContext(PreviewContext);
}
