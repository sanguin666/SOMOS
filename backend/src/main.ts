import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module.js';
import { UPLOADS_ROOT } from './common/upload/multer-storage.js';

async function bootstrap() {
  // rawBody keeps the untouched request body around for Stripe's webhook
  // signature check, which is computed over the exact bytes Stripe sent.
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { rawBody: true });
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true }),
  );
  // Serves recorded voice messages etc. — see common/upload/multer-storage.ts.
  app.useStaticAssets(UPLOADS_ROOT, { prefix: '/uploads/' });
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
