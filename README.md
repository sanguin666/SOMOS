# Ansae

Mobile + web app for churches and other points of interest: donations, events, and future modules, with a strong focus on accessibility for a mostly elderly audience.

## Repo structure

```
backend/   NestJS API (Node.js + TypeORM + PostgreSQL)
app/       Expo / React Native app (+ React Native Web) — the congregant-facing app
admin/     React (Vite) admin dashboard for parish staff
landing/   Static marketing site (no build step) advertising Ansae to churches
docker-compose.yml   Local PostgreSQL for development
```

## Base data model

- `users` — either a congregant (identified by phone number — the SMS login flow itself isn't built yet) or a parish admin (identified by email + password, used by the admin dashboard); each has a `language` (`en`/`es`/`fr`) for their own UI
- `pois` — a point of interest a user can join, with a name, `type` (only `church` for now — the name stays generic since other kinds of venues/organizations may be supported later), `language` (the language this POI publishes content in), address, and the QR code token used for onboarding
- `user_pois` — many-to-many join table: a user can belong to several POIs, with a `role` (`member` or `admin`) per POI — an admin user can manage several churches this way
- `active_modules` — the product modules subscribed to by a POI (e.g. `donations`, `events`), with subscription status and expiration date

## Local demo (no cost)

**Windows:** double-click `start.bat` to do all of the below in one go (installs/updates dependencies, starts Postgres if Docker is available, seeds demo data, and launches the backend, admin dashboard, and mobile app each in their own window). Re-run it any time for a full restart. Otherwise, follow the manual steps below.

### 1. PostgreSQL database

With Docker (recommended):

```bash
docker compose up -d
```

This starts a local Postgres on `localhost:5432` (database `ansae`, user `ansae` / password `ansae`).

> **Coming from the old `mypeople` database?** Postgres only creates the
> database and role named in `docker-compose.yml` the first time its volume
> is initialised, so an existing volume still holds `mypeople` and the
> backend won't be able to connect. Run `docker compose down -v` once, then
> `docker compose up -d` and re-run the seed below — everything in there is
> demo data, so nothing real is lost.

> No Docker handy? A local PostgreSQL install (`apt install postgresql`) also works: create an `ansae` user and database matching `backend/.env.example`.

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

Opens on `http://localhost:5173`. Sign in with the demo admin account above. If the account manages more than one POI (like the demo one), a switcher appears in the sidebar. From there: schedule Events, publish and edit Announcements, schedule Livestreams, moderate Prayer Requests and Community posts/replies (remove anything inappropriate), print a QR flyer from **My QR**, and manage **Settings** — active modules plus the parish's own info (description, picture) shown in the app.

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
- **Events** — Masses, baptisms, weddings, funerals, communions, etc. (`backend/src/events`); scheduling/editing is admin-only, the app only reads them (a reminder toggle per event is a local, device-only preference — there's no account yet to attach it to)
- **Announcements** — bulletin/newsletter-style posts (`src/announcements`), optionally recorded as a voice message from the app instead of typed; editing/deleting is admin-only, posting is still open from the app (no congregant login yet)
- **Prayer Requests** — community prayer requests with a "praying" counter (`src/prayer-requests`); moderated (removed) from the admin dashboard
- **Livestream** — links out to livestreamed/recorded services on an external platform (`src/livestreams`); scheduling/editing is admin-only
- **Community** — a discussion board: posts with flat (non-nested) comment replies (`src/community`); moderated from the admin dashboard, posting is still open from the app

More modules can be added following the same pattern (an entry in `ModuleType`, its own tables, its own NestJS module).

## Languages

The app and admin dashboard UI (menus, buttons, labels, error messages — everything that isn't content posted by a POI) is available in English, Spanish, and French.

- **POI language** (`pois.language`) — the language a POI's own staff publish content in (announcements, prayer requests, community posts, livestream titles, etc.). Set from the admin dashboard's Settings page ("Content language" card); it's metadata only for now — posted content is stored and shown exactly as written, in that language, to every reader regardless of their own UI language.
- **User language** (`users.language`) — each person's own UI language preference. In the app, a language pill switcher on the home screen sets it (device-local, via AsyncStorage, since there's no real congregant account/session yet). In the admin dashboard, it's set from the login screen or the sidebar switcher, stored locally, and synced to the signed-in admin's account (`PATCH /auth/me/language`) so it follows them across devices/browsers.
- **Not built yet:** automatic translation of POI-authored content into each reader's own language. The `language` fields above lay the groundwork for this (an AI translation service could use the POI's source language and the reader's target language) but for now a POI's posts are shown as-is, in the POI's language, to everyone.

## Admin auth

The admin dashboard (`admin/`) uses a real email + password login (`POST /auth/login`, JWT), separate from the congregant app which has no working login yet. A `PoiAdminGuard` (`backend/src/auth/guards`) checks the caller has an `admin` `user_pois` row for the `:poiId` in the URL before allowing an admin-only action — see `backend/src/auth` for the guard and `backend/src/user-pois/user-pois.service.ts` for the membership lookups it uses.

## Settings & the QR flyer

The admin dashboard's **Settings** page (`admin/src/pages/SettingsPage.tsx`, `PATCH /pois/:poiId/profile`) combines the active-module toggles with the POI's own public info — a description and a picture (pasted in as a URL for now; the upload pipeline used for announcement voice messages could be reused for direct uploads later) — plus the content-language picker.

The **My QR** page (`admin/src/pages/MyQrPage.tsx`) generates a printable flyer for the parish's entrance: a QR code (via the `qrcode` package) encoding a link to the landing site's `#join` section (`/?token=<poi token>#join`), an editable headline/subtext (`qrFlyerHeadline`/`qrFlyerSubtext` on `Poi`, defaulting to generic copy if left blank), and a "Print / Save as PDF" button that uses the browser's own print dialog with a dedicated print stylesheet — no PDF library needed.

## Marketing landing page

`landing/` is a small static site (plain HTML/CSS/JS, no build step, no framework) advertising Ansae to churches — open `landing/index.html` directly in a browser, or serve the folder with any static file server (e.g. `npx serve landing`). It's one scrolling page: features, pricing, and the "join" flow are all sections of `index.html` (`#pricing`, `#join`), not separate pages. The `#join` section is what the QR flyer's code links to: today it explains how to get the app (the store links are placeholders — the app isn't published yet) and displays the scanned POI token for manual entry as a fallback (`landing/assets/main.js` reads it from the URL's `?token=` query param). Text is in Spanish by default, switchable to English/French via the header pills (`landing/assets/i18n.js`, persisted in `localStorage`). Getting a real domain and deploying this site (and pointing `VITE_LANDING_URL` in `admin/.env` at it) is a manual step outside this repo.
