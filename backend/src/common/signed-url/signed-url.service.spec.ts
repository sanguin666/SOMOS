import { ConfigService } from '@nestjs/config';
import { SignedUrlService } from './signed-url.service.js';

function service(secret = 'a-test-secret-that-is-long-enough-for-this') {
  return new SignedUrlService(new ConfigService({ JWT_SECRET: secret }));
}

function parts(signed: string) {
  const url = new URL(signed, 'http://x');
  return { path: url.pathname, exp: url.searchParams.get('exp') ?? undefined, sig: url.searchParams.get('sig') ?? undefined };
}

describe('SignedUrlService', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('accepts its own link for the path it was made for', () => {
    const signer = service();
    const { path, exp, sig } = parts(signer.sign('/private-files/requests/a.pdf'));
    expect(signer.verify(path, exp, sig)).toBe(true);
  });

  it('refuses the same signature on another path', () => {
    const signer = service();
    const { exp, sig } = parts(signer.sign('/private-files/requests/a.pdf'));
    expect(signer.verify('/private-files/requests/b.pdf', exp, sig)).toBe(false);
  });

  it('refuses a link whose expiry was pushed back', () => {
    const signer = service();
    const { path, exp, sig } = parts(signer.sign('/receipts/p/2026/k'));
    expect(signer.verify(path, String(Number(exp) + 3600), sig)).toBe(false);
  });

  it('refuses a link once it has expired', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-23T10:00:00Z'));
    const signer = service();
    const { path, exp, sig } = parts(signer.sign('/receipts/p/2026/k', 60));
    vi.setSystemTime(new Date('2026-09-23T10:02:00Z'));
    expect(signer.verify(path, exp, sig)).toBe(false);
  });

  it('refuses a link signed with another secret, or with nothing', () => {
    const { path, exp, sig } = parts(service('another-secret-that-is-long-enough-too').sign('/x'));
    expect(service().verify(path, exp, sig)).toBe(false);
    expect(service().verify(path, undefined, undefined)).toBe(false);
  });
});
