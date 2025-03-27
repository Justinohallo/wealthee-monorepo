# Fullstack Feature Implementation Guide

This rule provides a high-level workflow for implementing end-to-end features across the Firebase Functions backend and Next.js web application.

## Feature Implementation Workflow

### 1. Planning & Requirements

- [ ] Define clear user stories and acceptance criteria
- [ ] Identify required data models and API contracts
- [ ] Consider security requirements (authentication, authorization)
- [ ] Plan data flow between frontend and backend components

### 2. Firebase Function Implementation

- [ ] Define function name constant in `apps/web/constants/functionNames.ts`
- [ ] Create service implementation in `apps/functions/src/services/[domain]/`
  - [ ] Implement core business logic
  - [ ] Create proper interfaces for input/output
  - [ ] Add comprehensive error handling
  - [ ] Include logging at appropriate levels
- [ ] Create HTTP function wrapper in `apps/functions/src/functions/[domain]/`
  - [ ] Use `createHttpFunction` utility with proper options
  - [ ] Define required auth and parameters
  - [ ] Handle request validation
  - [ ] Call service function and format response
- [ ] Add type definitions if needed in `apps/functions/src/types/`
- [ ] Export function in `apps/functions/src/index.ts`
- [ ] Test function with appropriate test cases
- [ ] Run linting: `npm run lint` from the functions directory
- [ ] Run type checking: `npm run tsc` from the functions directory
- [ ] Verify function builds: `npm run build` from the functions directory

### 3. Web App Service Implementation

- [ ] Create corresponding service function in `apps/web/services/[domain]/`
  - [ ] Follow service pattern with proper error handling
  - [ ] Use object destructuring for 3+ parameters
  - [ ] Include proper TypeScript types for parameters and return values
  - [ ] Reference function name from constants
  - [ ] Throw errors rather than returning null
  - [ ] Return empty arrays for collection results
- [ ] Add or update type definitions in `apps/web/types/` if needed
- [ ] Export service function in domain index file
- [ ] Run type checking: `npm run tsc` from the web directory

### 4. UI Implementation (Next.js)

- [ ] Identify the appropriate page or component structure
- [ ] Create server components for data fetching
  - [ ] Use service functions for data retrieval
  - [ ] Implement error handling and loading states
  - [ ] Use Suspense boundaries appropriately
  - [ ] **IMPORTANT: All data fetching MUST happen in Server Components, not Client Components**
- [ ] Create client components only for:
  - [ ] User interactions (form handling, buttons, etc.)
  - [ ] Client-side state management
  - [ ] Components requiring browser APIs
  - [ ] Components using React hooks
- [ ] Implement form handling with react-hook-form if needed in client components
- [ ] Add client-side validation with zod
- [ ] Style UI using TailwindCSS and the component library
  - [ ] Ensure responsive design (mobile-first approach)
  - [ ] Match existing design patterns
  - [ ] Use appropriate UI components from the library
- [ ] Implement proper error boundaries
- [ ] Ensure accessibility compliance
- [ ] Test across different devices and screen sizes
- [ ] Run type checking and linting

### 5. Testing & Validation

- [ ] Verify end-to-end functionality works as expected
- [ ] Test edge cases and error scenarios
- [ ] Validate against acceptance criteria
- [ ] Check for any performance issues
- [ ] Review code for security vulnerabilities
- [ ] Ensure proper error messages are displayed to users

## Implementation Tips

### Firebase Functions

- Use middleware for cross-cutting concerns
- Follow the pattern of keeping business logic in services
- Use typed interfaces for input/output parameters
- Include proper validation for all inputs
- Return standardized response objects
- Handle errors gracefully with appropriate status codes

### Web App Services

- Use the pattern established in `web-app-services.md`
- Keep service functions focused on data fetching/mutation
- Handle errors properly to allow React Error Boundaries to catch them
- Use TypeScript for all parameter and return types
- Return empty collections rather than null for lists

### React Components

- **Strictly separate concerns between server and client components:**
  - Server Components: 
    - Use for all data fetching operations
    - Retrieve data from APIs
    - Pass data to client components as props
    - Server components should never use hooks or client-side state
    - Mark as async when using await
  - Client Components:
    - Add "use client" directive at the top of the file
    - Use for interactivity, state management, and event handling
    - Never perform data fetching directly (receive data as props from server components)
    - Use hooks like useState, useEffect, etc.
- Implement proper loading and error states in the server components that fetch data
- Follow existing UI patterns for consistency

## Common Pitfalls

- **Client components fetching data directly instead of receiving it from server components**
- Not handling authentication/authorization consistently
- Missing error handling in the UI
- Inconsistent data validation between frontend and backend
- Not using TypeScript properly for type safety
- Implementing duplicate business logic across frontend and backend
- Not testing edge cases and error scenarios
- Using hardcoded strings instead of constants for function names
- Not considering mobile viewports in UI design

## Example Feature Flow - Following Server Component Pattern

1. Create Firebase Function for data operations
2. Create web app service to interact with the function
3. Build Server Component that:
   - Calls the service function to fetch data
   - Passes the data as props to any client components that need it
4. Create any necessary Client Components that:
   - Receive data as props
   - Implement interactivity and UI state
5. Implement proper error handling and loading states
6. Test the complete feature end-to-end
7. Fix any issues and refine the implementation 
