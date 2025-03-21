# Wealthee Firebase Functions

This directory contains the Firebase Cloud Functions for the Wealthee application. The functions are organized using a domain-driven modular architecture to improve maintainability, testability, and scalability.

## Architecture Overview

The codebase follows a clean architecture pattern with clear separation of concerns:

```
src/
├── config/                   # Configuration settings
│   ├── firebase.ts           # Firebase admin initialization
│   └── secrets.ts            # Environment secrets management
├── middleware/               # Reusable middleware
│   ├── auth.ts               # Authentication middleware
│   ├── validation.ts         # Request validation middleware
│   └── index.ts              # Exports for middleware
├── services/                 # Core business logic
│   ├── snaptrade/            # SnapTrade specific services
│   │   ├── client.ts         # SnapTrade client initialization 
│   │   ├── accounts.ts       # Account-related operations
│   │   ├── auth.ts           # Authentication operations
│   │   └── index.ts          # Service exports
│   ├── users/                # User management services
│   │   ├── portfolio-manager.ts
│   │   ├── clients.ts
│   │   ├── admin.ts
│   │   └── index.ts
│   └── index.ts              # Export all services
├── utils/                    # Utility functions
│   ├── error-handling.ts     # Centralized error handling
│   ├── logger.ts             # Enhanced logging functionality
│   ├── function-wrapper.ts   # Function creation wrapper
│   └── index.ts              # Utility exports
├── types/                    # TypeScript type definitions
│   ├── snaptrade.ts          # SnapTrade-related types
│   ├── requests.ts           # HTTP request/response types
│   ├── database.ts           # Database schema types
│   └── index.ts              # Type exports
└── functions/                # Actual Cloud Function definitions
    ├── portfolio-manager/    # Portfolio manager functions
    │   ├── create.ts
    │   ├── snaptrade.ts
    │   └── index.ts
    ├── clients/              # Client-related functions
    │   ├── create.ts
    │   └── index.ts
    ├── snaptrade/            # SnapTrade endpoint functions
    │   ├── accounts.ts       # Account-related endpoints
    │   └── index.ts
    ├── admin/                # Admin functions
    │   └── index.ts
    └── index.ts              # Main function exports
```

## Key Components

### Cloud Functions

Functions are organized by domain (portfolio managers, clients, SnapTrade, admin) and exported from the main `index.ts` file. Each function is created using the `createHttpFunction` wrapper for consistent error handling and validation.

### Services

Services contain the core business logic of the application, separate from HTTP handling. They are organized by domain and provide reusable operations for the Cloud Functions.

### Middleware

Middleware components handle cross-cutting concerns like authentication and request validation.

### Utils

Utility functions provide common functionality like error handling, logging, and function creation.

### Types

Type definitions ensure type safety across the application, including database schemas, API requests/responses, and DTO interfaces.

## Function Creation Pattern

Functions are created using the `createHttpFunction` wrapper, which provides:

- Consistent error handling
- Authentication and authorization
- Parameter validation
- Secret management

Example:

```typescript
export const getAccountDetail = createHttpFunction(
  async ({req, res, auth}) => {
    // Function implementation
    const {snapTradeUserId, accountId} = req.params;
    
    // Business logic using services
    const accountDetails = await snapTradeAccountService.getAccountDetails(
      snapTradeUser.userId,
      snapTradeUser.userSecret,
      accountId
    );
    
    // Response handling
    res.json({
      success: true,
      data: accountDetails,
      timestamp: new Date().toISOString(),
    });
  },
  {
    requireAuth: true,
    requiredRole: "portfolioManager",
    secrets: snaptradeSecrets,
  }
);
```

## Error Handling

The application uses a centralized error handling approach with custom error classes:

- `AppError`: Base error class with status code and context
- `AuthError`: Authentication errors (401)
- `ForbiddenError`: Authorization errors (403)
- `NotFoundError`: Resource not found errors (404)
- `ValidationError`: Request validation errors (400)

## Logging

Enhanced logging with context support through the `logger` utility:

```typescript
logger.error(
  "Failed to get account details",
  "SnapTradeAccountService",
  error
);
```

## Development

### Prerequisites

- Node.js v22 or later
- Firebase CLI tools
- Access to Firebase project

### Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Set up Firebase CLI:
   ```
   firebase login
   ```

3. Set up environment variables for local development:
   - Create a `.env` file with required secrets
   - For SnapTrade development, set the required API keys

### Local Development

Run the Firebase emulator:

```
npm run serve
```

This will build the functions and start the Firebase emulators, allowing you to test the functions locally.

### Deployment

Deploy all functions:

```
npm run deploy
```

Or deploy specific functions:

```
firebase deploy --only functions:snaptrade
```

## Testing

Run unit tests:

```
npm test
```

## Style Guide and Best Practices

- Follow the established code structure and patterns
- Use the provided utility functions for consistent error handling and logging
- Place business logic in services, not directly in function handlers
- Use proper TypeScript types for all function parameters and return values
- Document all functions, interfaces, and complex logic 
