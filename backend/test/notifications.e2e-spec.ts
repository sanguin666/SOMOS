import type { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { client, createPlace, createTestApp, resetDatabase, signInWithId } from './harness.js';
import { ExpoPushClient, type PushMessage } from '../src/notifications/expo-push.client.js';
import { NotificationsService } from '../src/notifications/notifications.service.js';

/**
 * Phones registering for push notifications, members choosing what they
 * get from each place, and sends reaching only the people who kept a kind
 * on. Expo itself is replaced by a recorder: nothing leaves the test.
 */
describe('Notifications (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;
  let ana: { token: string; userId: string };
  let luis: { token: string; userId: string };
  let place: { id: string; qrCodeToken: string };
  let sent: PushMessage[];

  const as = (token: string) => ({ Authorization: `Bearer ${token}` });
  const anaPhone = 'ExponentPushToken[ana-phone]';
  const luisPhone = 'ExponentPushToken[luis-phone]';

  beforeAll(async () => {
    app = await createTestApp();
    const push = app.get(ExpoPushClient);
    Object.defineProperty(push, 'enabled', { get: () => true });
    push.send = async (messages: PushMessage[]) => {
      sent.push(...messages);
      return messages.filter((m) => m.to.includes('dead')).map((m) => m.to);
    };
  });

  beforeEach(async () => {
    sent = [];
    await resetDatabase(app);
    ({ token: adminToken } = await signInWithId(app, '+34600400001', 'Admin'));
    place = await createPlace(app, adminToken, 'San Roque');
    ana = await signInWithId(app, '+34600400002', 'Ana');
    luis = await signInWithId(app, '+34600400003', 'Luis');
    for (const member of [ana, luis]) {
      await client(app).post('/auth/me/pois').set(as(member.token)).send({ qrCodeToken: place.qrCodeToken }).expect(201);
    }
    await client(app).post('/auth/me/push-tokens').set(as(ana.token)).send({ token: anaPhone }).expect(204);
    await client(app).post('/auth/me/push-tokens').set(as(luis.token)).send({ token: luisPhone }).expect(204);
  });

  afterAll(async () => {
    await app.close();
  });

  it('refuses anything that is not an Expo push token', async () => {
    await client(app).post('/auth/me/push-tokens').set(as(ana.token)).send({ token: 'hello' }).expect(400);
    await client(app).post('/auth/me/push-tokens').send({ token: anaPhone }).expect(401);
  });

  it('starts with everything on and lets a member turn kinds off', async () => {
    const url = `/auth/me/pois/${place.id}/notifications`;
    const initial = await client(app).get(url).set(as(ana.token)).expect(200);
    expect(initial.body).toEqual({ news: true, requests: true, events: true, live: true });

    const updated = await client(app).patch(url).set(as(ana.token)).send({ news: false }).expect(200);
    expect(updated.body).toEqual({ news: false, requests: true, events: true, live: true });

    // Only the member's own memberships: a stranger to the place gets nothing.
    const { token: outsider } = await signInWithId(app, '+34600400009', 'Eva');
    await client(app).get(url).set(as(outsider)).expect(404);
  });

  it('sends a place-wide notification only to members who kept that kind on', async () => {
    await client(app).patch(`/auth/me/pois/${place.id}/notifications`).set(as(luis.token)).send({ news: false }).expect(200);

    await app.get(NotificationsService).notifyPoiMembers(place.id, 'news', { title: 'Fiesta', body: 'Sábado' });

    expect(sent.map((m) => m.to)).toEqual([anaPhone]);
    expect(sent[0].data).toEqual({ poiId: place.id });
  });

  it('sends to named people only, and moves a phone to whoever signs in on it', async () => {
    const notifications = app.get(NotificationsService);
    await notifications.notifyUsers([luis.userId], place.id, 'requests', { title: 'Reply', body: 'Hola' });
    expect(sent.map((m) => m.to)).toEqual([luisPhone]);

    // Ana signs in on Luis's phone: Luis no longer gets notified there.
    sent = [];
    await client(app).post('/auth/me/push-tokens').set(as(ana.token)).send({ token: luisPhone }).expect(204);
    await notifications.notifyUsers([luis.userId], place.id, 'requests', { title: 'Reply', body: 'Hola' });
    expect(sent).toEqual([]);
  });

  it('forgets phones Expo reports as gone, and phones signed out of', async () => {
    const deadPhone = 'ExponentPushToken[dead-phone]';
    await client(app).post('/auth/me/push-tokens').set(as(ana.token)).send({ token: deadPhone }).expect(204);
    await client(app).delete(`/auth/me/push-tokens/${encodeURIComponent(luisPhone)}`).set(as(luis.token)).expect(204);

    await app.get(NotificationsService).notifyPoiMembers(place.id, 'live', { title: 'Live', body: 'Now' });
    expect(sent.map((m) => m.to).sort()).toEqual([anaPhone, deadPhone].sort());

    const left = await app.get(DataSource).query('SELECT token FROM push_tokens ORDER BY token');
    expect(left.map((row: { token: string }) => row.token)).toEqual([anaPhone]);
  });
});
