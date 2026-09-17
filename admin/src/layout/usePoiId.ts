import { useOutletContext } from 'react-router-dom';

export function usePoiId(): string {
  return useOutletContext<{ poiId: string }>().poiId;
}
