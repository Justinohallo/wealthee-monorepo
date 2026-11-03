# Wealthee

A portfolio-management platform for independent financial advisors and their clients. An advisor (portfolio manager) onboards clients, connects their brokerage accounts, and sees holdings and activity in one dashboard; the client sees their own portfolio.

I co-founded Wealthee with a Toronto-based financial advisor and was the sole engineer from 2020 to 2025. The original product was a React web dashboard, a React Native app and a Firebase backend; this repository is the 2025 rebuild of the web dashboard and backend as one TypeScript monorepo. The partnership ended in 2025 and the product never went to market, so the code is shared as a record of the architecture rather than a live service.

## What it does

- **Three roles, one app.** Admin, portfolio manager and client each get their own route tree (`app/admin`, `app/manager`, `app/client`), gated by a role stored as a Firebase Auth custom claim and checked again server-side by the functions' auth middleware.
- **Broker-connected accounts through SnapTrade.** Brokerage connections (for example Wealthsimple and Questrade) go through the SnapTrade SDK on the server. It replaced an earlier custom trading backend when the original market-data provider stopped being viable.
- **Server-side secrets only.** The browser talks to Cloud Functions with a Firebase ID token; SnapTrade credentials and the Firebase Admin key never reach the client bundle.

## Architecture

```
apps/
  web/          Next.js 15 (App Router), React 19, Tailwind, Radix UI primitives,
                react-hook-form, Recharts
  functions/    Firebase Cloud Functions (Express handlers): auth middleware,
                request validation, admin / client / portfolio-manager / SnapTrade services
packages/
  eslint-config, typescript-config   shared tooling
```

- **Data and auth:** Firebase Auth and the Realtime Database, with security rules in `apps/functions/database.rules.json`.
- **Build:** Turborepo runs lint, type-check and build across the workspaces.
- **CI/CD:** `.github/workflows/production.yaml` runs lint and type-check on every push to `main`, then deploys the functions to Firebase and the web app to Vercel, in that order, so the frontend never ships ahead of the API it calls.

## Running it locally

Requires Node 18+ and the Firebase CLI.

```bash
npm install
npm run dev   # starts the Firebase emulators (auth, database, functions) and the web app
```

The emulators load seeded fake users from `emulator-data/`. Real SnapTrade and Firebase credentials are needed for anything beyond the emulators and are not included.

## Status

Shelved in 2025 when the co-founder partnership ended. Not maintained.
