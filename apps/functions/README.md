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
│   ├── snaptradeUser.ts      # SnapTrade user middleware
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
    │   ├── connections.ts    # Connection-related endpoints
    │   ├── users.ts          # User management endpoints
    │   └── index.ts
    ├── admin/                # Admin functions
    │   └── index.ts
    └── index.ts              # Main function exports
```

## Key Components

### Cloud Functions

Functions are organized by domain (portfolio managers, clients, SnapTrade, admin) and exported from the main `index.ts` file. Each function is created using the `createHttpFunction` wrapper for consistent error handling and validation.

### Services

Services contain the core business logic and data access operations, separate from HTTP handling. They:

- Provide reusable business logic
- Access and manipulate data
- Handle domain-specific operations
- Can be called from multiple functions or middleware

For example, the SnapTrade user service provides data access functions for working with SnapTrade users:

```typescript
// In a service file
export const getSnapTradeUser = async (snapTradeUserId: string): Promise<User | null> => {
  // Database access logic...
};

// Usage in a function handler or middleware
const user = await getSnapTradeUser(id);
```

### Services Pattern

All services in the codebase follow a consistent function export pattern rather than exporting service objects. This approach:

- Simplifies imports with direct function names
- Improves tree-shaking capabilities
- Makes code more functional and less object-oriented
- Creates a consistent pattern throughout the codebase

**Do this**:
```typescript
// In a service file (connections.ts)
export const listBrokerageConnections = async (userId: string, userSecret: string) => {
  // Implementation...
};

export const deleteBrokerageConnection = async (userId: string, userSecret: string, connectionId: string) => {
  // Implementation...
};

// Usage
import { listBrokerageConnections } from "../../services/snaptrade/connections";
const connections = await listBrokerageConnections(userId, userSecret);
```

**Don't do this**:
```typescript
// Avoid exporting objects with methods
export const snapTradeConnectionService = {
  listBrokerageConnections: async (userId: string, userSecret: string) => {
    // Implementation...
  },
  
  deleteBrokerageConnection: async (userId: string, userSecret: string, connectionId: string) => {
    // Implementation...
  }
};

// This requires more verbose imports and usage
import { snapTradeConnectionService } from "../../services/snaptrade/connections";
const connections = await snapTradeConnectionService.listBrokerageConnections(userId, userSecret);
```

### Middleware

Middleware components handle cross-cutting concerns like authentication, request validation, and request processing. They typically:

- Process and validate incoming requests
- Attach data to the request for downstream handlers
- Perform authorization checks
- Forward to the next handler or return an error response

For example, the `snaptradeUser` middleware provides functions for attaching SnapTrade user data to requests and validating access permissions:

```typescript
// Middleware to fetch and attach a SnapTrade user to the request
app.use('/api/snaptrade/:snapTradeUserId', attachSnapTradeUser);

// In a route handler:
router.get('/details', async (req, res) => {
  // The middleware has attached the user data to the request
  const { snapTradeUser } = req;
  // Use the user data...
});
```

### Utils

Utility functions provide common functionality like error handling, logging, and function creation.

### Types

Type definitions ensure type safety across the application, including database schemas, API requests/responses, and DTO interfaces.

## Database Structure

### SnapTrade Users (Normalized Approach)

The application uses a normalized database structure for SnapTrade users following domain-driven design principles. This approach treats SnapTrade users as independent entities with explicit relationships to portfolio managers:

```
/snapTradeUsers/<snapTradeUserId>
  - displayName: string
  - userSecret: string
  - createdAt: timestamp

/portfolioManager_snapTradeUser_mappings/<mappingId>
  - portfolioManagerId: string
  - snapTradeUserId: string
  - createdAt: timestamp
  
/portfolioManagers/<portfolioManagerId>/snapTradeUserIds
  - <snapTradeUserId>: true
```

This structure offers several benefits:
- **Data independence**: SnapTrade users exist as first-class entities, separate from portfolio managers
- **Flexible relationships**: A SnapTrade user could potentially be associated with multiple portfolio managers
- **Efficient queries**: Direct access to SnapTrade users by ID, plus fast lookup of all users for a portfolio manager
- **Scalability**: Prevent large document sizes as the number of SnapTrade users grows
- **Domain alignment**: Better represents the real-world domain boundaries

### SnapTrade User Data Model

The SnapTrade integration uses a normalized database structure with the following paths:

1. `/snapTradeUsers/<snapTradeUserId>` - Individual SnapTrade user data
2. `/portfolioManager_snapTradeUser_mappings/<mappingId>` - Mapping between portfolio managers and SnapTrade users
3. `/portfolioManagers/<portfolioManagerId>/snapTradeUserIds` - List of SnapTrade user IDs associated with a portfolio manager

#### Dual Storage Pattern Rationale

Our implementation maintains two ways to associate SnapTrade users with portfolio managers:

1. **The mapping table** (`portfolioManager_snapTradeUser_mappings`):
   - Provides a proper many-to-many relationship table
   - Stores complete relationship data including timestamps
   - Offers flexibility for complex queries and relationship management

2. **Direct list on portfolioManager** (`portfolioManagers/${portfolioManagerId}/snapTradeUserIds`):
   - Serves as a performance optimization
   - Enables quick lookups without joins
   - Optimized for the common query pattern: "show me all users for this portfolio manager"

This dual approach represents a classic tradeoff between storage duplication and query performance. For frequently accessed relationships like portfolio manager to SnapTrade user mappings, the performance benefit of direct lookups outweighs the slight storage overhead and complexity of maintaining both structures.

Without the direct list, retrieving all SnapTrade users for a portfolio manager would require querying the entire mapping collection and filtering by portfolio manager ID, which is less efficient than directly accessing the list of IDs stored on the portfolio manager document.


#### Accessing SnapTrade Users

The application provides service functions in `services/snaptrade/users.ts` for working with this normalized structure:

```typescript
// Get a single SnapTrade user by ID
const user = await getSnapTradeUser(snapTradeUserId);

// Get all SnapTrade users for a portfolio manager 
const users = await getSnapTradeUsersForPortfolioManager(portfolioManagerId);

// Verify if a portfolio manager has access to a SnapTrade user
const hasAccess = await verifyPortfolioManagerAccess(portfolioManagerId, snapTradeUserId);
```

Additionally, middleware components in `middleware/snaptradeUser.ts` provide HTTP request processing:

```typescript
// Attach a SnapTrade user to the request
app.use(attachSnapTradeUser);

// Validate that a portfolio manager has access to a SnapTrade user
app.use(validatePortfolioManagerAccess);
```

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

## SnapTrade Integration

### Users Module

The `functions/snaptrade/users.ts` module provides endpoints for managing SnapTrade users:

- `registerUser`: Create a new SnapTrade user and associate it with a portfolio manager
- `getUser`: Get details of a specific SnapTrade user 
- `listUsersForPortfolioManager`: List all SnapTrade users for a portfolio manager
- `loginUser`: Generate a login URL for a SnapTrade user

These functions utilize the service layer in `services/snaptrade/users.ts` for data access operations.

### Service Modules

SnapTrade integration is organized into focused service modules:

1. **Auth Services** (`services/snaptrade/auth.ts`):
   - `registerSnapTradeUser`: Register a new user with the SnapTrade API
   - `deleteSnapTradeUser`: Delete a user from SnapTrade
   - `generateSnapTradeRedirectUri`: Generate a redirect URI for brokerage connections

2. **User Services** (`services/snaptrade/users.ts`):
   - `registerSnapTradeUser`: Create a new user and store in our database
   - `generateSnapTradeConnectionUrl`: Generate a connection URL for a user
   - `getSnapTradeUser`: Retrieve a user by ID
   - `getSnapTradeUsersForPortfolioManager`: List users for a portfolio manager
   - `verifyPortfolioManagerAccess`: Check if a manager has access to a user

3. **Connection Services** (`services/snaptrade/connections.ts`):
   - `listBrokerageConnections`: List all brokerage connections for a user
   - `deleteBrokerageConnection`: Delete a brokerage connection
   - `getSupportedBrokerages`: Get all supported brokerages

4. **Account Services** (`services/snaptrade/accounts.ts`):
   - `getAccountDetails`: Get details for a specific account
   - `getAccountBalances`: Get account balances
   - `getAccountHoldings`: Get account holdings

### Client Usage

Client-side code can access these endpoints using the constants defined in `apps/web/constants/functionNames.ts`:

```typescript
// Register a new SnapTrade user
const result = await callFirebaseFunction({
  idToken,
  functionName: SNAPTRADE.USERS.REGISTER,
  options: {
    method: "POST",
    body: JSON.stringify({
      displayName,
      portfolioManagerId
    })
  }
});

// List SnapTrade users for a portfolio manager
const data = await callFirebaseFunction({
  idToken,
  functionName: SNAPTRADE.USERS.LIST_FOR_PORTFOLIO_MANAGER,
  queryParams: { portfolioManagerId }
});

// Get a specific SnapTrade user
const user = await callFirebaseFunction({
  idToken,
  functionName: SNAPTRADE.USERS.GET,
  queryParams: { snapTradeUserId }
});

// Login a SnapTrade user
const loginData = await callFirebaseFunction({
  idToken,
  functionName: SNAPTRADE.USERS.LOGIN,
  queryParams: { snapTradeUserId, redirectUri }
});

// List brokerage connections
const connections = await callFirebaseFunction({
  idToken,
  functionName: SNAPTRADE.CONNECTIONS.LIST_BROKERAGE_CONNECTIONS,
  queryParams: { snapTradeUserId }
});

// Get account details
const accountDetails = await callFirebaseFunction({
  idToken,
  functionName: SNAPTRADE.ACCOUNTS.GET_DETAILS,
  queryParams: { snapTradeUserId, accountId }
});
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
