import type { INestApplication } from '@nestjs/common';
import { client, createTestApp } from './harness.js';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', async () => {
    await client(app).get('/').expect(200).expect('Hello World!');
  });
});
