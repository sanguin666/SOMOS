import type { INestApplication } from '@nestjs/common';
import { client, createPlace, createTestApp, resetDatabase, signInWithId } from './harness.js';

/**
 * The badges at the top of a place's home page: a place starts with the
 * next Mass and the office hours, its staff add and arrange the rest, and
 * members only ever see what is switched on and still current.
 */
describe('Home badges (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;
  let memberToken: string;
  let place: { id: string };

  const as = (token: string) => ({ Authorization: `Bearer ${token}` });
  const kinds = (body: { kind: string }[]) => body.map((b) => b.kind);

  beforeAll(async () => {
    app = await createTestApp();
  });

  beforeEach(async () => {
    await resetDatabase(app);
    ({ token: adminToken } = await signInWithId(app, '+34600300001', 'Admin'));
    place = await createPlace(app, adminToken, 'San Roque');
    ({ token: memberToken } = await signInWithId(app, '+34600300002', 'Ana'));
  });

  afterAll(async () => {
    await app.close();
  });

  it('starts every place with the next Mass and the office hours', async () => {
    const shown = await client(app).get(`/pois/${place.id}/badges`).expect(200);
    expect(kinds(shown.body)).toEqual(['next_mass', 'office_hours']);

    const all = await client(app).get(`/pois/${place.id}/badges/all`).set(as(adminToken)).expect(200);
    expect(all.body.map((b: { kind: string; enabled: boolean }) => [b.kind, b.enabled])).toEqual([
      ['next_mass', true],
      ['office_hours', true],
      ['next_confession', false],
      ['campaign', false],
    ]);
  });

  it('keeps the dashboard side to the place’s staff', async () => {
    await client(app).get(`/pois/${place.id}/badges/all`).expect(401);
    await client(app).get(`/pois/${place.id}/badges/all`).set(as(memberToken)).expect(403);
    await client(app).post(`/pois/${place.id}/badges`).set(as(memberToken)).send({ kind: 'message', text: 'Hola' }).expect(403);
  });

  it('adds a message after the starter badges, and shows it until its last day', async () => {
    await client(app).post(`/pois/${place.id}/badges`).set(as(adminToken)).send({ kind: 'message' }).expect(400);
    await client(app)
      .post(`/pois/${place.id}/badges`)
      .set(as(adminToken))
      .send({ kind: 'message', text: 'x'.repeat(41) })
      .expect(400);

    const closed = await client(app)
      .post(`/pois/${place.id}/badges`)
      .set(as(adminToken))
      .send({ kind: 'message', text: 'Iglesia cerrada el lunes', important: true, linkModule: 'announcements', showUntil: '2099-12-31' })
      .expect(201);
    expect(closed.body).toMatchObject({ position: 4, important: true, linkModule: 'announcements' });
    await client(app)
      .post(`/pois/${place.id}/badges`)
      .set(as(adminToken))
      .send({ kind: 'message', text: 'Ya pasó', showUntil: '2020-01-01' })
      .expect(201);

    const shown = await client(app).get(`/pois/${place.id}/badges`).expect(200);
    expect(shown.body.map((b: { kind: string; text: string | null }) => b.text ?? b.kind)).toEqual([
      'next_mass',
      'office_hours',
      'Iglesia cerrada el lunes',
    ]);
  });

  it('switches badges off and puts them in a new order', async () => {
    const all = await client(app).get(`/pois/${place.id}/badges/all`).set(as(adminToken)).expect(200);
    const [mass, office, confession, campaign] = all.body.map((b: { id: string }) => b.id);

    await client(app).patch(`/pois/${place.id}/badges/${mass}`).set(as(adminToken)).send({ enabled: false }).expect(200);
    await client(app).patch(`/pois/${place.id}/badges/${confession}`).set(as(adminToken)).send({ enabled: true }).expect(200);
    await client(app)
      .post(`/pois/${place.id}/badges/reorder`)
      .set(as(adminToken))
      .send({ ids: [confession, office, mass] })
      .expect(400);
    await client(app)
      .post(`/pois/${place.id}/badges/reorder`)
      .set(as(adminToken))
      .send({ ids: [confession, office, mass, campaign] })
      .expect(201);

    const shown = await client(app).get(`/pois/${place.id}/badges`).expect(200);
    expect(kinds(shown.body)).toEqual(['next_confession', 'office_hours']);

    await client(app).delete(`/pois/${place.id}/badges/${office}`).set(as(adminToken)).expect(200);
    const after = await client(app).get(`/pois/${place.id}/badges/all`).set(as(adminToken)).expect(200);
    expect(after.body.map((b: { position: number }) => b.position)).toEqual([0, 1, 2]);
  });
});
