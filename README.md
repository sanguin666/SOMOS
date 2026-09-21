# SOMOS

Mobile + web app for churches and other points of interest: donations, events, and future modules, with a strong focus on accessibility for a mostly elderly audience.

## Repo structure

```
backend/   NestJS API (Node.js + TypeORM + PostgreSQL)
app/       Expo / React Native app (+ React Native Web) — the congregant-facing app
admin/     React (Vite) admin dashboard for parish staff
landing/   Static marketing site (no build step) advertising SOMOS to churches
docker-compose.yml   Local PostgreSQL for development
```

## Base data model

- `users` — either a congregant (identified by phone number — the SMS login flow itself isn't built yet) or a parish admin (identified by email + password, used by the admin dashboard); each has a `language` (`en`/`es`/`fr`) for their own UI
- `pois` — a point of interest a user can join, with a name, `type` (only `church` for now — the name stays generic since other kinds of venues/organizations may be supported later), `language` (the language this POI publishes content in), address, and the QR code token used for onboarding
- `user_pois` — many-to-many join table: a user can belong to several POIs, with a `role` (`member` or `admin`) per POI — an admin user can manage several churches this way
- `active_modules` — the product modules subscribed to by a POI (e.g. `donations`, `events`), with subscription status and expiration date

## Local demo (no cost)

**Windows:** there are two one-click launchers at the root of the repo.

| | `start.bat` | `start-demo.bat` |
|---|---|---|
| For | working at home | demoing anywhere |
| Phone runs | Expo Go, via the QR code | the installed APK |
| Phone needs | the same Wi-Fi as this PC | any internet connection |
| Starts | Postgres, backend, admin, Expo | Postgres, backend, ngrok tunnel |

`start.bat` also rewrites `EXPO_PUBLIC_API_URL` in `app/.env` to this PC's current network IP every time it runs, so Expo Go always points at the right place. Re-run either file any time for a clean restart — each closes the windows it opened last time. Otherwise, follow the manual steps below.

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

Opens on `http://localhost:5173`. Sign in with the demo admin account above. If the account manages more than one POI (like the demo one), a switcher appears in the sidebar. From there: schedule Events, publish and edit Announcements, schedule Livestreams, moderate Prayer Requests and Community posts/replies (remove anything inappropriate), print a QR flyer from **My QR**, and manage **Settings** — active modules plus the parish's own info (description, picture) shown in the app.

Content that's meant to come from parish staff (editing/deleting announcements and livestreams, moderating prayer requests and community posts, toggling modules) requires this admin login. Posting itself — an announcement, a prayer request, a community post — is still open from the congregant app with no login yet, matching the phone-based auth that isn't built.

### 5. Access from a physical phone

The app needs to reach the backend's API. On the same Wi-Fi network, edit `app/.env` and set `EXPO_PUBLIC_API_URL` to your dev machine's LAN IP (e.g. `http://192.168.1.23:3000`) — a phone can't resolve `localhost` as your computer. See the comments in `app/.env.example` for how to find your IP. `EXPO_PUBLIC_*` is inlined when the bundle is built, so restart Expo (`npx expo start --clear`) after changing it.

That covers development. For a demo away from your own network, build an APK instead — see below.

### 6. Demo APK (Android, no laptop needed)

For showing the app to someone off your network, a standalone build beats Expo Go: the JavaScript ships inside the APK, so there's no Metro dev server, no QR code and no Expo Go login involved. The only thing that still has to be reachable is the backend.

1. Expose the backend on a stable public URL. On [ngrok](https://ngrok.com/)'s free plan you get one assigned domain, so pin it:

   ```bash
   ngrok http 3000 --url https://<your-domain>.ngrok-free.dev
   ```

   `start-demo.bat` does this for you along with the database and backend — set `NGROK_DOMAIN` at the top of that file.

2. Put that same URL in the `preview` profile's `env` block in `app/eas.json`, which is what gets baked into the build. It has to match the domain in `start-demo.bat`.
3. Build and install:

   ```bash
   cd app
   npm install --global eas-cli
   eas login
   eas init          # adds your Expo project id to app.json
   eas build --profile preview --platform android
   ```

   EAS returns a download link when the build finishes. Open it on the phone to install the APK.

On the day, run `start-demo.bat` and open the app on the phone. Nothing to scan, nothing to type.

Re-run the build only when the app code changes. Backend changes need nothing rebuilt, as long as the ngrok domain stays the same.

> **iOS:** the same flow needs a paid Apple Developer account to install on a physical device, so this route is Android-only for now.

### Tunnelling the dev server instead (fiddly)

If you really need live reload on a phone off your network, note that `ngrok http 3000` exposes only the **backend**. The QR code comes from the Expo dev server, a separate process on port 8081, which needs its own tunnel. Two things to know:

- `npx expo start --tunnel` routes through a shared ngrok account run by Expo that carries no uptime guarantee and frequently fails. Prefer your own tunnel and point Expo at it with `EXPO_PACKAGER_PROXY_URL=https://<tunnel-host>`, then use **Enter URL manually** in Expo Go.
- Don't put both services behind one ngrok URL with `--pooling-enabled`. Pooled endpoints are load balanced per request, so calls land on whichever of the two servers ngrok picks and the app breaks intermittently. Give each service its own hostname, using a second provider if needed (`cloudflared tunnel --url http://localhost:8081`).

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

- **Donations** — in-app donations through Stripe Checkout (see [Donations & Stripe](#donations--stripe) below); without a Stripe key the screen falls back to a demo confirmation that records the gift without taking a payment
- **Events** — Masses, baptisms, weddings, funerals, communions, etc. (`backend/src/events`); scheduling/editing is admin-only, the app only reads them (a reminder toggle per event is a local, device-only preference — there's no account yet to attach it to)
- **Announcements** — bulletin/newsletter-style posts (`src/announcements`), optionally recorded as a voice message from the app instead of typed; editing/deleting is admin-only, posting is still open from the app (no congregant login yet)
- **Prayer Requests** — community prayer requests with a "praying" counter (`src/prayer-requests`); moderated (removed) from the admin dashboard
- **Livestream** — links out to livestreamed/recorded services on an external platform (`src/livestreams`); scheduling/editing is admin-only
- **Community** — a discussion board: posts with flat (non-nested) comment replies (`src/community`); moderated from the admin dashboard, posting is still open from the app

More modules can be added following the same pattern (an entry in `ModuleType`, its own tables, its own NestJS module).

## Donations & Stripe

The donate screen sends people to **Stripe Checkout** — Stripe's own hosted
payment page, opened in the phone's browser — rather than collecting card
details in the app. Nothing sensitive touches our code, and it works in Expo
Go, in the APK and on the web target alike.

Stripe is optional. With no `STRIPE_SECRET_KEY` in `backend/.env` the donate
screen says "Demo mode · No payment will be taken" and records the gift
anyway, so a fresh clone still demos end to end and the admin dashboard's
graph has data.

To take real (test) payments:

1. Create a Stripe account and copy the **test** secret key (`sk_test_…`) from
   the dashboard — test mode costs nothing and needs no account activation.
2. Put it in `backend/.env` as `STRIPE_SECRET_KEY`, and restart the backend
   (the key is read at startup).
3. Donate from the app and pay with a [Stripe test card](https://docs.stripe.com/testing):
   `4242 4242 4242 4242`, any future expiry, any CVC.

Amounts are charged in `DONATION_CURRENCY` (`eur` by default); the admin
dashboard formats its figures with `VITE_DONATION_CURRENCY`, which has to
match.

How a gift moves through the system:

- `POST /pois/:poiId/donations/checkout` creates the `donations` row as
  `pending` and returns Stripe's checkout URL (or `mode: 'demo'`).
- The payer finishes on Stripe and lands on `/donations/return`, a plain page
  telling them to go back to the app — Stripe only redirects to http(s) URLs,
  so it can't reopen the app itself.
- The app polls `GET /pois/:poiId/donations/:donationId/status`, which
  re-checks the session with Stripe, and shows the thank-you screen once the
  payment lands.
- Only `completed` gifts count towards the admin dashboard's totals, so an
  abandoned checkout never inflates a parish's figures.
- `POST /stripe/webhook` does the same job from Stripe's side. It needs a
  publicly reachable backend and `STRIPE_WEBHOOK_SECRET`, so the local demo
  doesn't use it — polling covers that case.

Going live later means swapping the test key for a live one; Stripe's fee in
Spain is 1.5% + &euro;0.25 per European card.

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

`landing/` is a small static site (plain HTML/CSS/JS, no build step, no framework) advertising SOMOS to churches — open `landing/index.html` directly in a browser, or serve the folder with any static file server (e.g. `npx serve landing`). It's one scrolling page: features, pricing, and the "join" flow are all sections of `index.html` (`#pricing`, `#join`), not separate pages. The `#join` section is what the QR flyer's code links to: today it explains how to get the app (the store links are placeholders — the app isn't published yet) and displays the scanned POI token for manual entry as a fallback (`landing/assets/main.js` reads it from the URL's `?token=` query param). Text is in Spanish by default, switchable to English/French via the header pills (`landing/assets/i18n.js`, persisted in `localStorage`). Getting a real domain and deploying this site (and pointing `VITE_LANDING_URL` in `admin/.env` at it) is a manual step outside this repo.
