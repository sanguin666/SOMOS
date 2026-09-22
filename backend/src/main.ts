import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module.js';
import { UPLOADS_ROOT } from './common/upload/multer-storage.js';

/**
 * Who may call the API from a browser.
 *
 * Development allows anything: the app runs from Expo on a phone, from a
 * browser on localhost, and sometimes through an ngrok URL, and pinning
 * that list down would only cost time. Production takes the list from
 * CORS_ORIGINS, and allows nothing cross-origin if it isn't set — the admin
 * dashboard is the only browser client, so a deployment that forgets the
 * variable should break loudly rather than stay open to every site.
 *
 * Note this bounds browsers, not clients in general: the mobile app isn't
 * subject to CORS at all, so this is not what keeps the API safe. The
 * guards are.
 */
function corsOrigins(configService: ConfigService): string[] | boolean {
  const configured = configService.get<string>('CORS_ORIGINS');
  if (configured) {
    return configured
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean);
  }
  const isProduction =
    configService.get<string>('NODE_ENV', 'development') === 'production';
  if (isProduction) {
    new Logger('Bootstrap').warn(
      'CORS_ORIGINS is not set: no cross-origin browser requests will be allowed. The admin dashboard needs its URL listed here.',
    );
    return false;
  }
  return true;
}

async function bootstrap() {
  // rawBody keeps the untouched request body around for Stripe's webhook
  // signature check, which is computed over the exact bytes Stripe sent.
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { rawBody: true });
  const configService = app.get(ConfigService);

  app.enableCors({ origin: corsOrigins(configService) });
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true }),
  );
  // Serves recorded voice messages etc. — see common/upload/multer-storage.ts.
  app.useStaticAssets(UPLOADS_ROOT, { prefix: '/uploads/' });
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
