# myPeople

Mobile + web app for churches and other points of interest: donations, events, and future modules, with a strong focus on accessibility for a mostly elderly audience.

## Repo structure

```
backend/   NestJS API (Node.js + TypeORM + PostgreSQL)
app/       Expo / React Native app (+ React Native Web)
docker-compose.yml   Local PostgreSQL for development
```

## Base data model

- `users` — a user, identified by their phone number
- `pois` — a point of interest a user can join (a church today; the name stays generic since other kinds of venues/organizations may be supported later), with a name, address, and the QR code token used for onboarding
- `user_pois` — many-to-many join table: a user can belong to several POIs
- `active_modules` — the product modules subscribed to by a POI (e.g. `donations`, `events`), with subscription status and expiration date

## Local demo (no cost)

### 1. PostgreSQL database

With Docker (recommended):

```bash
docker compose up -d
```

This starts a local Postgres on `localhost:5432` (database `mypeople`, user `mypeople` / password `mypeople`).

> No Docker handy? A local PostgreSQL install (`apt install postgresql`) also works: create a `mypeople` user and database matching `backend/.env.example`.

### 2. Backend (NestJS)

```bash
cd backend
cp .env.example .env
npm install
npm run start:dev
```

The API starts on `http://localhost:3000`. In development, tables are created/synced automatically from the entities (`synchronize: true`) — no migration to run for the demo.

Seed a demo POI (with all modules active and sample content) so the app has something real to show:

```bash
npm run seed
```

Safe to re-run — it only creates what's missing. This gives you a fixed, known place ("St. Mary's Parish") that the app's demo flow fetches by QR token.

### 3. Mobile app (Expo Go)

```bash
cd app
cp .env.example .env
npm install
npm run start
```

Scan the QR code shown in the terminal with the **Expo Go** app (Android/iOS) to launch the app on your phone, no app store submission needed.

To test in a browser: `npm run web`.

From the home screen, **"My places"** or **"Scan a place's QR code" → Simulate scan** both open the seeded demo POI, with real Donations, Events, Announcements, Prayer Requests, and Livestream screens.

### 4. Access from a physical phone remotely

The app needs to reach the backend's API. On the same Wi-Fi network, edit `app/.env` and set `EXPO_PUBLIC_API_URL` to your dev machine's LAN IP (e.g. `http://192.168.1.23:3000`) — a phone can't resolve `localhost` as your computer. See the comments in `app/.env.example` for how to find your IP.

If the phone isn't on the same network at all, temporarily expose the backend with a tunnel (e.g. [ngrok](https://ngrok.com/)):

```bash
ngrok http 3000
```

Then set `EXPO_PUBLIC_API_URL` in `app/.env` to the URL ngrok provides.

## Accessibility (app)

The accessibility foundations live in `app/src/theme` and `app/src/components`:

- `theme.ts` — high-contrast palette and a deliberately large text size scale
- `AccessibleText` — never disables the system text scaling (`allowFontScaling`)
- `AccessibleButton` — large touch target (≥64px), large text, no complex gestures
- `Screen` — layout with generous margins and safe area (notch/system bars) support

Every new screen should reuse these components instead of raw `Text`/`Pressable`.

## Product modules

Each POI activates modules à la carte (`active_modules`). Currently built:

- **Donations** — in-app donations (Stripe integration still to come), with a demo confirmation flow
- **Events** — event notifications (baptisms, weddings, funerals, communions, etc.) — currently demo content in the app, no backend table yet
- **Announcements** — bulletin/newsletter-style posts (`src/announcements`)
- **Prayer Requests** — community prayer requests with a "praying" counter (`src/prayer-requests`)
- **Livestream** — links out to livestreamed/recorded services on an external platform (`src/livestreams`)

More modules can be added following the same pattern (an entry in `ModuleType`, its own tables, its own NestJS module).
