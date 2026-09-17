# myPeople

Mobile + web app for churches and other points of interest: donations, events, and future modules, with a strong focus on accessibility for a mostly elderly audience.

## Repo structure

```
backend/   NestJS API (Node.js + TypeORM + PostgreSQL)
app/       Expo / React Native app (+ React Native Web) — the congregant-facing app
admin/     React (Vite) admin dashboard for parish staff
docker-compose.yml   Local PostgreSQL for development
```

## Base data model

- `users` — either a congregant (identified by phone number — the SMS login flow itself isn't built yet) or a parish admin (identified by email + password, used by the admin dashboard)
- `pois` — a point of interest a user can join, with a name, `type` (only `church` for now — the name stays generic since other kinds of venues/organizations may be supported later), address, and the QR code token used for onboarding
- `user_pois` — many-to-many join table: a user can belong to several POIs, with a `role` (`member` or `admin`) per POI — an admin user can manage several churches this way
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

Seed two demo POIs (with all modules active and sample content) so the app has something real to show:

```bash
npm run seed
```

Safe to re-run — it only creates what's missing. This gives you two fixed, known places ("St. Mary's Parish", fetched by the app's demo flow via QR token, and "Holy Trinity Chapel") plus a demo admin account managing both:

```
email:    admin@stmarys.example
password: demo1234
```

### 3. Mobile app (Expo Go)

```bash
cd app
cp .env.example .env
npm install
npm run start
```

Scan the QR code shown in the terminal with the **Expo Go** app (Android/iOS) to launch the app on your phone, no app store submission needed.

To test in a browser: `npm run web`.

From the home screen, **"My places"** or **"Scan a place's QR code" → Simulate scan** both open the seeded demo POI, with real Donations, Events, Announcements, Prayer Requests, and Livestream screens. From Announcements, the **+** button opens a compose screen where you can type a message and/or record a voice message (tap the microphone, speak, tap Stop, then Post) — works in `npm run web` too, with a normal browser microphone permission prompt.

### 4. Admin dashboard (parish staff)

```bash
cd admin
cp .env.example .env
npm install
npm run dev
```

Opens on `http://localhost:5173`. Sign in with the demo admin account above. If the account manages more than one POI (like the demo one), a switcher appears in the sidebar. From there: publish and edit Announcements, schedule Livestreams, moderate Prayer Requests and Community posts/replies (remove anything inappropriate), and turn modules on or off for that parish.

Content that's meant to come from parish staff (editing/deleting announcements and livestreams, moderating prayer requests and community posts, toggling modules) requires this admin login. Posting itself — an announcement, a prayer request, a community post — is still open from the congregant app with no login yet, matching the phone-based auth that isn't built.

### 5. Access from a physical phone remotely

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

`app/src/theme/poiThemes.ts` layers a per-POI-`type` accent color and wording on top of that base theme (e.g. for the hub screen's hero banner) — it only ever changes brand color/imagery, never text size, contrast, or touch target sizing, which stay fixed regardless of POI type.

## Product modules

Each POI activates modules à la carte (`active_modules`). Currently built:

- **Donations** — in-app donations (Stripe integration still to come), with a demo confirmation flow
- **Events** — event notifications (baptisms, weddings, funerals, communions, etc.) — currently demo content in the app, no backend table yet
- **Announcements** — bulletin/newsletter-style posts (`src/announcements`), optionally recorded as a voice message from the app instead of typed; editing/deleting is admin-only, posting is still open from the app (no congregant login yet)
- **Prayer Requests** — community prayer requests with a "praying" counter (`src/prayer-requests`); moderated (removed) from the admin dashboard
- **Livestream** — links out to livestreamed/recorded services on an external platform (`src/livestreams`); scheduling/editing is admin-only
- **Community** — a discussion board: posts with flat (non-nested) comment replies (`src/community`); moderated from the admin dashboard, posting is still open from the app

More modules can be added following the same pattern (an entry in `ModuleType`, its own tables, its own NestJS module).

## Admin auth

The admin dashboard (`admin/`) uses a real email + password login (`POST /auth/login`, JWT), separate from the congregant app which has no working login yet. A `PoiAdminGuard` (`backend/src/auth/guards`) checks the caller has an `admin` `user_pois` row for the `:poiId` in the URL before allowing an admin-only action — see `backend/src/auth` for the guard and `backend/src/user-pois/user-pois.service.ts` for the membership lookups it uses.
