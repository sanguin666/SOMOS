import { normalizePhone } from './phone-auth.service.js';

/**
 * Normalization decides whether two spellings of a number reach the same
 * account, so it is worth pinning down on its own. The rest of the login —
 * expiry, one-shot codes, throttling — needs a database to mean anything
 * and is covered in test/auth.e2e-spec.ts.
 */
describe('normalizePhone', () => {
  it('strips the punctuation people type', () => {
    expect(normalizePhone('+34 600 11 22 33')).toBe('+34600112233');
    expect(normalizePhone('+34-600-112-233')).toBe('+34600112233');
    expect(normalizePhone('+34 (600) 112.233')).toBe('+34600112233');
    expect(normalizePhone('  +34600112233  ')).toBe('+34600112233');
  });

  it('keeps a leading + and only a leading +', () => {
    expect(normalizePhone('+34600112233')).toBe('+34600112233');
    expect(normalizePhone('600112233')).toBe('600112233');
    expect(normalizePhone('00 34 600 112 233')).toBe('0034600112233');
  });

  it('treats a national and an international spelling as different', () => {
    // Known limitation, documented on the function: resolving one to the
    // other needs a country, and there's no country picker yet.
    expect(normalizePhone('600112233')).not.toBe(normalizePhone('+34600112233'));
  });
});
