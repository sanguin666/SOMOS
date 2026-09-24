import type { INestApplication } from '@nestjs/common';
import { client, createPlace, createTestApp, resetDatabase, signInWithId } from './harness.js';

/**
 * How an event repeats: chosen weekdays, once a month, and days off.
 * The server keeps only what the chosen rule uses.
 */
describe('Event repeat rules (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;
  let place: { id: string };

  const as = (token: string) => ({ Authorization: `Bearer ${token}` });
  const post = (body: object) => client(app).post(`/pois/${place.id}/events`).set(as(adminToken)).send(body);

  beforeAll(async () => {
    app = await createTestApp();
  });

  beforeEach(async () => {
    await resetDatabase(app);
    ({ token: adminToken } = await signInWithId(app, '+34600500001', 'Admin'));
    place = await createPlace(app, adminToken, 'San Pedro');
  });

  afterAll(async () => {
    await app.close();
  });

  it('keeps weekdays, sorted and once each, and days off in date order', async () => {
    const created = await post({
      title: 'Misa',
      startsAt: '2026-09-01T08:30:00.000Z',
      recurrence: 'weekly',
      repeatDays: [5, 1, 3, 1],
      monthlyDay: 15,
      exceptions: [{ date: '2026-12-25', reason: 'Navidad' }, { date: '2026-11-11' }],
    }).expect(201);
    expect(created.body).toMatchObject({
      repeatDays: [1, 3, 5],
      monthlyDay: null,
      exceptions: [{ date: '2026-11-11' }, { date: '2026-12-25', reason: 'Navidad' }],
    });

    const listed = await client(app).get(`/pois/${place.id}/events`).expect(200);
    expect(listed.body[0].repeatDays).toEqual([1, 3, 5]);
  });

  it('takes a monthly rule by weekday or by date, and refuses one with neither', async () => {
    const firstFriday = await post({
      title: 'Primer viernes',
      startsAt: '2026-09-01T19:00:00.000Z',
      recurrence: 'monthly',
      monthlyWeek: 1,
      monthlyWeekday: 5,
      repeatDays: [2],
    }).expect(201);
    expect(firstFriday.body).toMatchObject({ recurrence: 'monthly', monthlyWeek: 1, monthlyWeekday: 5, repeatDays: [] });

    const lastSaturday = await post({
      title: 'Último sábado',
      startsAt: '2026-09-01T19:00:00.000Z',
      recurrence: 'monthly',
      monthlyWeek: -1,
      monthlyWeekday: 6,
    }).expect(201);
    expect(lastSaturday.body.monthlyWeek).toBe(-1);

    await post({ title: 'Mal', startsAt: '2026-09-01T19:00:00.000Z', recurrence: 'monthly' }).expect(400);
    await post({ title: 'Mal', startsAt: '2026-09-01T19:00:00.000Z', recurrence: 'monthly', monthlyWeek: 5, monthlyWeekday: 1 }).expect(400);
    await post({ title: 'Mal', startsAt: '2026-09-01T19:00:00.000Z', recurrence: 'weekly', exceptions: [{ date: '11/11/2026' }] }).expect(400);
  });

  it('drops the rule and the days off of a one-off event', async () => {
    const created = await post({
      title: 'Concierto',
      startsAt: '2026-10-01T19:00:00.000Z',
      recurrence: 'weekly',
      repeatDays: [1],
      exceptions: [{ date: '2026-10-05' }],
    }).expect(201);
    const updated = await client(app)
      .patch(`/pois/${place.id}/events/${created.body.id}`)
      .set(as(adminToken))
      .send({ recurrence: 'none' })
      .expect(200);
    expect(updated.body).toMatchObject({ recurrence: 'none', repeatDays: [], exceptions: [] });
  });
});
