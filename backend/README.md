# myPeople — backend

NestJS API for the myPeople app. See the [root README](../README.md) for full setup instructions (local demo).

## Quick start

```bash
cp .env.example .env
npm install
npm run start:dev
```

Requires a PostgreSQL database reachable with the credentials in `.env` (see the `docker-compose.yml` at the repo root).

## Structure

- `src/users` — user accounts (identified by phone number)
- `src/pois` — points of interest a user can join (churches today, other kinds of venues/organizations later)
- `src/user-pois` — many-to-many membership between a user and a POI (via QR code)
- `src/active-modules` — product modules subscribed to by a POI and their subscription status
- `src/announcements` — bulletin/newsletter-style posts for a POI, optionally with a recorded voice message (see `src/common/upload`)
- `src/prayer-requests` — community prayer requests, with a "praying" counter
- `src/livestreams` — links out to livestreamed/recorded services (no video hosting — just title, URL, schedule)

## Voice messages

Announcements can carry an optional recorded voice message instead of (or alongside) typed text. Files are stored on local disk under `backend/uploads/` (gitignored) and served statically at `/uploads/...` — see `src/common/upload/multer-storage.ts`. Swap for a real object store (S3, Cloudinary, ...) before any production use, same as `synchronize: true` stands in for real migrations.

## Useful scripts

- `npm run start:dev` — dev server with hot reload
- `npm run build` — production build (`dist/`)
- `npm run seed` — creates a demo POI ("St. Mary's Parish", QR token `DEMO-STMARYS`) with all modules active and sample content (announcements, prayer requests, livestreams), for the app's demo flow. Safe to re-run.
- `npm run test` / `npm run test:e2e` — tests (vitest)
- `npm run lint` — lint (oxlint)
