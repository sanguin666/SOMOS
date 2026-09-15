# myChurch — backend

API NestJS pour l'application myChurch. Voir le [README à la racine](../README.md) pour la mise en route complète (démo locale).

## Démarrage rapide

```bash
cp .env.example .env
npm install
npm run start:dev
```

Nécessite une base PostgreSQL accessible avec les identifiants du `.env` (voir le `docker-compose.yml` à la racine).

## Structure

- `src/users` — comptes utilisateurs (identifiés par numéro de téléphone)
- `src/lieux-de-culte` — lieux de culte (églises, etc.)
- `src/user-lieu-de-culte` — rattachement many-to-many utilisateur ↔ lieu de culte (via QR code)
- `src/modules-actifs` — modules souscrits par un lieu de culte (dons, événements, ...) et leur statut d'abonnement

## Scripts utiles

- `npm run start:dev` — serveur avec rechargement à chaud
- `npm run build` — build de production (`dist/`)
- `npm run test` / `npm run test:e2e` — tests (vitest)
- `npm run lint` — lint (oxlint)
