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
- `src/active-modules` — product modules subscribed to by a POI (donations, events, ...) and their subscription status

## Useful scripts

- `npm run start:dev` — dev server with hot reload
- `npm run build` — production build (`dist/`)
- `npm run test` / `npm run test:e2e` — tests (vitest)
- `npm run lint` — lint (oxlint)
