import type { ConfigService } from '@nestjs/config';

// Development keeps a fixed fallback so the demo starts with no .env at
// all, but production refuses to boot without a real secret: a predictable
// signing key means anyone can mint a token for any account, including a
// parish admin's.
export function requireJwtSecret(configService: ConfigService): string {
  const secret = configService.get<string>('JWT_SECRET');
  if (secret) {
    return secret;
  }
  if (configService.get<string>('NODE_ENV', 'development') === 'production') {
    throw new Error(
      'JWT_SECRET must be set in production — see backend/.env.example.',
    );
  }
  return 'dev-only-insecure-secret';
}
