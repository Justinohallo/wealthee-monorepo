# Function Naming Convention

## Domain-Based Hierarchical Names

All Firebase functions use a domain-based hierarchical naming convention with dot notation based on the actual directory structure:

```
domain.subdomain.action
```

Where the `domain` is the directory name, `subdomain` is typically the file name, and `action` is the function name.

## Function Constants to Implementation Mapping

These constants map directly to the function implementations:

### SnapTrade Functions
```typescript
// In functionNames.ts
SNAPTRADE.ACCOUNTS.LIST_USER_ACCOUNTS = 'snaptrade.accounts.list'

// In functions/snaptrade/accounts.ts
export const list = createHttpFunction({ /* ... */ });
```

### Portfolio Manager Functions
```typescript
// In functionNames.ts
PORTFOLIO_MANAGER.SNAPTRADE.REGISTER_PRIMARY_USER = 'portfolio-manager.snapTrade.regPrimary'

// In functions/portfolio-manager/snapTrade.ts
export const regPrimary = createHttpFunction({ /* ... */ });
```

## Standard Naming Patterns

| Domain | Subdomain | Action Pattern |
|--------|-----------|----------------|
| `snaptrade` | `accounts` | `list`, `getDetails`, `getHoldings`, etc. |
| `snaptrade` | `connections` | `getUrl`, `list`, `getBrokerAuth`, `remove` |
| `snaptrade` | `users` | `register`, `get`, `listForPm`, `remove` |
| `portfolio-manager` | `snapTrade` | `checkUser`, `regPrimary`, `getPrimary` |
| `portfolio-manager` | `primaryAccount` | `setPrimary`, `getPrimary` |
| `clients` | `users` | `add`, `get`, `list`, `update` |
| `admin` | `users` | `createSuper`, `list`, `disable` |

## Requirements

1. **Format**: Use `domain.subdomain.action` pattern with dots as separators
2. **Length**: Keep function names as short as practical
3. **Case**: Use camelCase for the action part of the name
4. **Consistency**: Use the actual directory and file names for domain and subdomain
5. **Structure**: Use the actual folder structure in the Firebase Functions app:
   - `portfolio-manager` for Portfolio Manager functions
   - `snaptrade` for SnapTrade functions
   - `clients` for Client functions
   - `admin` for Admin functions

## Directory Structure

Our Firebase Functions follow this directory structure:
```
apps/functions/src/
├── functions/
│   ├── snaptrade/
│   │   ├── accounts.ts       // Exports: list, getDetails, getBalances
│   │   ├── connections.ts    // Exports: list, getUrl, getBrokerAuth
│   │   ├── users.ts          // Exports: get, register, listForPm
│   │   └── index.ts          // Re-exports all modules
│   ├── portfolio-manager/
│   │   ├── primaryAccount.ts // Exports: setPrimary, getPrimary
│   │   └── index.ts
│   ├── clients/
│   │   └── ...
│   └── admin/
│       └── ...
└── index.ts                  // Main exports by domain
```

## Action Naming

Action names should be concise and descriptive:
- `list` instead of `listUserAccounts`
- `getPrimary` instead of `getPrimaryAccount`
- `regPrimary` instead of `registerPrimarySnaptradeUser`

## How to Add New Functions

1. Define the function name constant in `apps/web/constants/functionNames.ts`:
   ```typescript
   export const DOMAIN = {
     SUBDOMAIN: {
       ACTION: 'domain.subdomain.action'
     }
   };
   ```

2. Implement the function using the same name in Firebase Functions (without dots):
   ```typescript
   // In apps/functions/src/functions/domain/subdomain.ts
   export const action = createHttpFunction({ /* ... */ });
   ```

3. Reference the constant when creating service functions:
   ```typescript
   // In apps/web/services/domain.ts
   import { DOMAIN } from '@/constants/functionNames';
   
   export async function callAction() {
     return callFirebaseFunction({
       functionName: DOMAIN.SUBDOMAIN.ACTION,
       // ...
     });
   }
   ```

## URL Construction

When deployed to Cloud Run, the function name determines the URL:
```
https://[FUNCTION_NAME]-[PROJECT_NUMBER].[REGION].run.app
```

Function names should follow the directory structure to ensure proper routing and DNS resolution. 
