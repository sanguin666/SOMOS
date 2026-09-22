import { describe, expect, it } from 'vitest';
import { landingPoi } from './landing';
import type { Me } from './api/auth';
import type { Poi } from './api/types';

function poi(id: string): Poi {
  return { id, name: `Place ${id}`, type: 'church', qrCodeToken: `QR-${id}` } as Poi;
}

function me(pois: Poi[], lastActivePoiId?: string): Me {
  return { id: 'u1', language: 'en', adminPois: [], pois, lastActivePoiId } as Me;
}

describe('landingPoi', () => {
  it('sends somebody with no place to add one', () => {
    expect(landingPoi(me([]))).toBeNull();
  });

  it('opens the only place without consulting anything else', () => {
    // Even a stale remembered id can't send them somewhere they don't belong.
    expect(landingPoi(me([poi('a')], 'gone'))?.id).toBe('a');
  });

  it('reopens where they were last when they belong to several', () => {
    expect(landingPoi(me([poi('a'), poi('b'), poi('c')], 'c'))?.id).toBe('c');
  });

  it('falls back to the first place when the remembered one is not theirs', () => {
    // A place they have left, or one that has been deleted since.
    expect(landingPoi(me([poi('a'), poi('b')], 'deleted'))?.id).toBe('a');
  });

  it('falls back to the first place when nothing was ever remembered', () => {
    expect(landingPoi(me([poi('a'), poi('b')]))?.id).toBe('a');
  });
});
