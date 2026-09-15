# myChurch

Application (mobile + web) pour les lieux de culte : dons, événements, et modules à venir, avec une priorité forte sur l'accessibilité pour un public majoritairement âgé.

## Structure du dépôt

```
backend/   API NestJS (Node.js + TypeORM + PostgreSQL)
app/       Application Expo / React Native (+ React Native Web)
docker-compose.yml   PostgreSQL local pour le développement
```

## Modèle de données de base

- `users` — un utilisateur, identifié par son numéro de téléphone
- `lieux_de_culte` — un lieu de culte (nom, adresse, jeton QR code d'onboarding)
- `user_lieu_de_culte` — table de liaison many-to-many : un utilisateur peut être rattaché à plusieurs lieux de culte
- `modules_actifs` — les modules souscrits par un lieu de culte (ex: `dons`, `evenements`), avec statut et date d'expiration d'abonnement

## Démo locale (sans coût)

### 1. Base de données PostgreSQL

Avec Docker (recommandé) :

```bash
docker compose up -d
```

Cela démarre un Postgres local sur `localhost:5432` (base `mychurch`, utilisateur `mychurch` / mot de passe `mychurch`).

> Pas de Docker sous la main ? Une instance PostgreSQL locale (`apt install postgresql`) fonctionne aussi : créez un utilisateur et une base `mychurch` correspondant à `backend/.env.example`.

### 2. Back-end (NestJS)

```bash
cd backend
cp .env.example .env
npm install
npm run start:dev
```

L'API démarre sur `http://localhost:3000`. En développement, les tables sont créées/synchronisées automatiquement à partir des entités (`synchronize: true`) — pas de migration à lancer pour la démo.

### 3. Application mobile (Expo Go)

```bash
cd app
npm install
npm run start
```

Scannez le QR code affiché dans le terminal avec l'app **Expo Go** (Android/iOS) pour lancer l'app sur votre téléphone, sans passer par les stores.

Pour tester dans un navigateur : `npm run web`.

### 4. Accès depuis un téléphone physique à distance

Si le téléphone de test n'est pas sur le même réseau que la machine de développement, exposez temporairement le back-end avec un tunnel (ex. [ngrok](https://ngrok.com/)) :

```bash
ngrok http 3000
```

Puis pointez l'app vers l'URL fournie par ngrok (à configurer dans la config de l'app une fois l'appel API mis en place).

## Accessibilité (app)

Les fondations d'accessibilité vivent dans `app/src/theme` et `app/src/components` :

- `theme.ts` — palette à fort contraste et échelle de tailles de texte volontairement large
- `AccessibleText` — ne désactive jamais la mise à l'échelle système du texte (`allowFontScaling`)
- `AccessibleButton` — zone tactile large (≥64px), texte large, pas de gestes complexes
- `Screen` — mise en page avec marges généreuses et zone sûre (encoche/barre système)

Tout nouvel écran doit réutiliser ces composants plutôt que des `Text`/`Pressable` bruts.

## Modules produit

Chaque lieu de culte active des modules à la carte (`modules_actifs`). Prévus au départ :

- **Dons** — dons in-app (Stripe), avec reçus
- **Événements** — notifications d'événements (baptêmes, mariages, enterrements, communions, etc.)

D'autres modules pourront être ajoutés en suivant le même schéma (une entrée dans `TypeModule`, ses propres tables, son propre module NestJS).
