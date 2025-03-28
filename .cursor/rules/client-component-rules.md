# Client Component Usage Rules

## Core Principles

1. **Client components are for UI interaction only**
   - Client components should strictly handle UI rendering and interactivity
   - They should NOT fetch data directly (use server components for data fetching)
   - They should receive data as props from parent server components

2. **Never use function-as-children pattern in client components**
   - ❌ INVALID: `<ClientComponent>{(prop) => <div>{prop}</div>}</ClientComponent>`
   - ✅ VALID: `<ClientComponent prop={value}><ChildComponent /></ClientComponent>`

3. **Proper component composition**
   - Use proper props passing instead of render props or higher-order components
   - Keep client components focused on a single responsibility
   - Minimize the number of client components to reduce JavaScript bundle size

## File Structure

1. **Name client components appropriately**
   - Client components should be named with a clear suffix: `ComponentNameClient.tsx`
   - Example: `ResponsiveTableClient.tsx`

2. **Place client components strategically**
   - Keep client components close to where they're used
   - If used in multiple places, consider moving to a shared UI folder

## Code Organization

1. **Keep client components lightweight**
   - Only include what's necessary for interactivity
   - Extract complex logic into hooks when possible

2. **Media queries and responsive design**
   - Use the `useMediaQuery` hook directly within client components
   - Export separate mobile/desktop components when appropriate
   - Example:
   ```tsx
   'use client'
   
   import { useMediaQuery } from "@/hooks/use-media-query";
   
   export function ResponsiveElementClient({ mobileContent, desktopContent }) {
     const isMobile = useMediaQuery("(max-width: 767px)");
     return isMobile ? mobileContent : desktopContent;
   }
   ```

3. **For responsive tables**
   - Create separate client components for responsive tables
   - Keep table structure and data presentation in server components
   - Only use client components for interactive features and responsive switching

Remember: The goal is to minimize client-side JavaScript while maintaining responsive design. Server components should handle data fetching and pass data to client components. 
