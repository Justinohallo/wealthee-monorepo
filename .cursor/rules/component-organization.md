# Component Organization Guidelines

This rule provides guidelines for organizing components in the codebase to ensure maintainable, logical component structure.

## Component Location Principles

### 1. Global Components

Global components should be placed in the `apps/web/components` directory. These components should be:

- **Truly reusable** across the entire application
- **UI primitives** or building blocks used in multiple features
- **Stateless** whenever possible, accepting props for customization
- **Well-documented** with clear, consistent interfaces

#### Examples of Global Components

- UI elements (buttons, cards, inputs)
- Layout components (containers, grids)
- Data visualizations used across features
- Form elements and controls
- Common utility components (loaders, error messages)

```
apps/web/components/
├── ui/                    # UI primitives (using shadcn/ui)
│   ├── button.tsx
│   ├── card.tsx
│   └── ...
├── layout/                # Layout components
│   ├── container.tsx
│   └── ...
├── forms/                 # Reusable form components
│   ├── input-field.tsx
│   └── ...
└── common/                # Other common components
    ├── data-table.tsx
    └── ...
```

### 2. Feature-Specific Components

Feature-specific components should be co-located with the features they support:

- Place in `_components` folders near the pages/routes where they're used
- Group by feature or domain area
- Keep components specific to a single page/route close to that page/route

#### ❌ INCORRECT: Placing domain-specific components in global directory

```
// INCORRECT: Don't put feature-specific components in global directory
apps/web/components/account/AccountActivitiesList.tsx
```

#### ✅ CORRECT: Co-locate components with their features

```
// CORRECT: Component used only in the account page is located with that page
apps/web/app/manager/snaptrade/[id]/account/[accountId]/_components/AccountActivitiesList.tsx
```

### 3. Next.js App Router Structure

With Next.js App Router:

- Use `_components` folders for route-specific components
- Use `page.tsx` only for the main page component
- Use `layout.tsx` for layouts that wrap multiple pages
- Consider using separate component files for complex UI sections

```
apps/web/app/
├── dashboard/
│   ├── _components/           # Dashboard-specific components
│   │   ├── stats-card.tsx
│   │   └── activity-feed.tsx
│   ├── layout.tsx
│   └── page.tsx
└── settings/
    ├── _components/           # Settings-specific components
    │   ├── profile-form.tsx
    │   └── security-settings.tsx
    ├── layout.tsx
    └── page.tsx
```

## Component Design Guidelines

### Component Composition

- Prefer small, focused components that do one thing well
- Compose larger interfaces from smaller components
- Use props for customization rather than creating many similar components
- Consider using component variants (with `cva`) for UI components with multiple styles

### Component Organization Within Files

- Co-locate related components in the same file if they're only used together
- Extract components to separate files when they grow complex or could be reused
- Export a single primary component from each file (with related subcomponents as needed)

## Component Migration

When a component initially created for a specific feature becomes widely used:

1. Identify components that are being reused across multiple features
2. Refactor to ensure the component is properly generalized and well-tested
3. Move to the appropriate global components directory
4. Update imports throughout the codebase
5. Add proper documentation

## Making The Decision

When deciding where to place a component, ask yourself:

1. **Will this component be used in multiple unrelated features?**
   - Yes → Global component
   - No → Feature-specific component

2. **Is this component a UI primitive or a domain-specific component?**
   - UI primitive → Global component
   - Domain-specific → Feature-specific component

3. **How closely is this component tied to a specific feature or data model?**
   - Tightly coupled → Feature-specific component
   - Loosely coupled → Consider making it a global component

4. **If the feature were removed, would this component still be useful?**
   - Yes → Global component
   - No → Feature-specific component 
