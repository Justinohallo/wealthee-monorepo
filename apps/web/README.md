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


