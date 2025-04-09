This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load Inter, a custom Google Font.

## Environment Variables and Deployment

### Build-time vs. Runtime Environment Variables

This project uses both build-time and runtime environment variables, which behave differently in Next.js and Vercel deployments:

#### Build-time Variables (`NEXT_PUBLIC_` prefix)

- Used for client-side code (browser environment)
- Must be prefixed with `NEXT_PUBLIC_`
- Embedded directly into JavaScript bundles during build
- Cannot be changed after deployment without rebuilding
- Examples: `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`

#### Runtime Variables (no `NEXT_PUBLIC_` prefix)

- Only available in server environments (API routes, Server Components, Server Actions)
- Never exposed to the client
- Can be updated without rebuilding the application
- Examples: `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`

### CI/CD Configuration

Our GitHub Actions workflow handles environment variables correctly:

1. **Build-time Variables**: Set in the `env:` section of the workflow
   ```yaml
   env:
     NEXT_PUBLIC_FIREBASE_API_KEY: ${{ secrets.NEXT_PUBLIC_FIREBASE_API_KEY }}
     # Other NEXT_PUBLIC variables...
   ```

2. **Runtime Variables**: Passed to Vercel during deployment
   ```yaml
   vercel deploy --prebuilt --prod \
   --env FIREBASE_PROJECT_ID="${{ secrets.FIREBASE_PROJECT_ID }}" \
   --env FIREBASE_CLIENT_EMAIL="${{ secrets.FIREBASE_CLIENT_EMAIL }}"
   # Other server-only variables...
   ```

### Firebase Admin SDK

For server-side Firebase operations, we use a singleton pattern to initialize Firebase Admin:

1. Import the initialization file (once) in server-side code:
   ```typescript
   import '@/lib/firebase-admin' 
   import { getFirestore } from 'firebase-admin/firestore'
   
   // Now you can use Firebase Admin services
   const db = getFirestore()
   ```

2. For API routes that depend on server environment variables, use:
   ```typescript
   export const dynamic = 'force-dynamic' // Ensures runtime access to variables
   ```

This approach prevents multiple initializations and ensures environment variables are properly accessed at runtime.

## App Structure and User Roles

### User Types and Relationships

The application has three user types with specific relationships:

1. **Admin**
   - Can create and manage Portfolio Managers
   - Has access to all system data

2. **Portfolio Manager**
   - Created by Admins
   - Can create and manage Clients (1:many relationship)
   - Can create multiple SnapTrade connections

3. **Client**
   - Created by a Portfolio Manager
   - Has a 1:1 relationship with their Portfolio Manager
   - Can create a single SnapTrade connection (1:1)

### Directory Structure

```
app/
├── admin/                       # Admin dashboard (admin only)
│   ├── page.tsx                 # Admin overview
│   ├── portfolio-managers/      # Manage all portfolio managers
│   │   ├── page.tsx             # List all portfolio managers
│   │   ├── create/              # Create new portfolio manager
│   │   └── [id]/                # Single portfolio manager view
│   └── settings/                # Admin settings
│
├── manager/                     # Portfolio manager area
│   ├── page.tsx                 # Manager dashboard
│   ├── clients/                 # Client management
│   │   ├── page.tsx             # List all clients
│   │   ├── create/              # Create new client
│   │   └── [id]/                # Single client view
│   ├── snaptrade/               # Manager's SnapTrade connections
│   │   ├── page.tsx             # List all connections
│   │   ├── create/              # Create new connection
│   │   └── [id]/                # Single connection details
│   └── settings/                # Manager settings
│
├── client/                      # Client area
│   ├── page.tsx                 # Client dashboard
│   ├── snaptrade/               # Client's SnapTrade connection
│   │   ├── page.tsx             # Connection details
│   │   └── connect/             # Create connection
│   └── settings/                # Client settings
│
├── api/                         # API routes
│   ├── admin/                   # Admin-only endpoints
│   ├── manager/                 # Manager endpoints
│   ├── client/                  # Client endpoints
│   └── snaptrade/               # SnapTrade API integration
│
└── auth/                        # Authentication pages
    ├── login/
    └── signup/
```

### Access Control Strategy

- Top-level role separation with `/admin`, `/manager`, and `/client` routes
- Flat structure where possible for better navigation
- Nested routes for clear parent-child relationships
- ID-based routes for specific resources
- Middleware for role-based access control

# Wealthee Web App

## Firebase Function Naming Convention

We use a domain-based hierarchical naming structure for Firebase Functions with an emphasis on brevity to ensure consistency, clarity, and avoid Cloud Run URL limitations.

### Pattern

Functions follow this pattern:
```
domain.subdomain.action
```

We use abbreviated domains and concise action names:

For example:
- `snap.accounts.getDetails` (for SnapTrade)
- `pm.users.create` (for Portfolio Manager)
- `admin.settings.update`

### Abbreviations

Common abbreviations:
- `pm` instead of `portfolioManager`
- `snap` instead of `snaptrade`
- `connect` instead of `connections`
- `dash` instead of `dashboard`

### Exports

Functions are exported following our barrel pattern:
1. Individual function files contain the implementations
2. Domain-level index files re-export all functions from that domain
3. The main index.ts exports all domain-level functions

### Client/Server Integration

1. Function names are defined as constants in `apps/web/constants/functionNames.ts`
2. Service functions in `apps/web/services/` use these constants to call the functions
3. The `callFirebaseFunction` utility handles API calls with proper formatting

### Cloud Run URL Format

Our Cloud Run URLs follow this pattern:
```
https://[FUNCTION_NAME]-[PROJECT_NUMBER].[REGION].run.app
```

Shorter function names ensure proper DNS resolution and minimize URL length.

### Validation

The `callFirebaseFunction` utility validates function names against the required pattern.

### Migration Notes

All function names have been updated to follow this convention. The legacy hyphenated format is no longer supported.


