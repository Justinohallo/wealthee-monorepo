# Optimizing Authentication Checks with React Server Component Cache

## Problem

We identified redundant authentication checks in our Next.js application:

- Both layout components and their child page components were calling `verifySessionAndGetUser()`
- Each call triggered a separate Firebase Auth verification
- This created unnecessary network requests and potentially slowed down page rendering

```typescript
// Problem: Both these components make separate auth calls
// apps/web/app/manager/layout.tsx
export default async function ManagerLayout({ children }) {
  const session = await verifySessionAndGetUser();
  // Auth checks and redirects...
}

// apps/web/app/manager/dashboard/page.tsx
export default async function Dashboard() {
  const session = await verifySessionAndGetUser();
  // Use session data...
}
```

## Solution: React.cache

React Server Components provide the `cache` function that allows us to memoize expensive operations within a single render request:

```typescript
// apps/web/lib/server-auth-utils.ts
import { cache } from 'react'

export const verifySessionAndGetUser = cache(async () => {
  const cookieStore = await cookies()
  const sessionCookie = await cookieStore.get("__session")?.value
  const token = await cookieStore.get("idToken")?.value
  
  if (!sessionCookie) return null

  try {
    const decodedClaims = await getAuth().verifySessionCookie(sessionCookie, true)
    return { decodedClaims, token }
  } catch (error) {
    console.error("Session verification error:", error)
    return null
  }
})
```

With this change:
- Multiple calls to `verifySessionAndGetUser()` within the same render cycle reuse the cached result
- Only one actual Firebase Auth verification happens
- No code changes needed in layouts or pages that use this function

## Handling Cache Invalidation

The React Server Component cache is automatically reset on each new request, but we need to explicitly handle cache invalidation when users log in or out:

```typescript
// apps/web/app/api/auth/logout/route.ts
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

export async function POST() {
  const cookieStore = cookies()
  
  // Clear auth cookies
  cookieStore.delete("__session")
  cookieStore.delete("idToken")
  cookieStore.delete("userRole")
  cookieStore.delete("userId")
  
  // Invalidate cached routes
  revalidatePath("/")
  revalidatePath("/client")
  revalidatePath("/manager")
  revalidatePath("/admin")
  
  return NextResponse.json({ success: true })
}
```

Client-side logout handlers should be updated to call this API:

```typescript
const handleLogout = async () => {
  // Firebase client-side signout
  await signOut(auth)
  
  // Call server API to clear cookies and invalidate cache
  await fetch("/api/auth/logout", { method: "POST" })
  
  router.push("/")
}
```

## Understanding React.cache vs React.memo

It's important to understand the difference between these optimizations:

| Feature | React.cache | React.memo |
|---------|-------------|------------|
| Environment | Server Components only | Client Components only |
| Purpose | Memoize async function results | Prevent component re-renders |
| Scope | Request-scoped (one render cycle) | Persistent between renders |
| Invalidation | Automatic on new requests | When props change |
| Use case | Network/DB calls optimization | UI rendering optimization |

## Benefits

- **Improved Performance**: Eliminates redundant network requests
- **Better User Experience**: Faster page loads with cached authentication
- **Simplified Code**: Same function can be called multiple times without performance penalty
- **Resource Efficiency**: Reduces Firebase Auth API calls

## Implementation Notes

- Server Component cache is per-request, so it's automatically fresh for each user
- Always pair with proper cache invalidation during auth state changes
- Continue using `memo`, `useMemo`, and `useCallback` for client-side optimizations 
