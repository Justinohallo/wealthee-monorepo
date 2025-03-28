# Cursor Rules for Mobile-First Development

## Mobile-First Design Principles

### Core Approach

The Wealthee frontend follows a strict mobile-first approach. Always design and implement for smaller screens first, then enhance for larger viewports. This creates a solid foundation that ensures compatibility across all devices.

#### Mobile-First Implementation
- Start by designing the UI for 320px-375px width devices
- Use Tailwind's mobile-first responsive modifiers (`sm:`, `md:`, `lg:`, `xl:`) to progressively enhance layouts
- Never hide critical content on mobile - adapt it instead
- Default to single-column layouts that expand to multi-column on larger screens

### Responsive Layout Guidelines

#### Content Organization
```tsx
// CORRECT: Mobile-first approach with stacked layout by default, row on larger screens
<div className="flex flex-col md:flex-row gap-4">
  <div className="w-full md:w-1/2">Content block 1</div>
  <div className="w-full md:w-1/2">Content block 2</div>
</div>

// INCORRECT: Desktop-first approach that requires overrides for mobile
<div className="flex flex-row gap-4 flex-col-reverse sm:flex-col">
  <div className="w-1/2 w-full sm:w-full">Content block 1</div>
  <div className="w-1/2 w-full sm:w-full">Content block 2</div>
</div>
```

#### Key Breakpoints
- Default (mobile): <640px - Single column layouts, stacked elements
- sm: 640px - Improved spacing, slight layout adjustments
- md: 768px - Potential switch to multi-column layouts where appropriate
- lg: 1024px - Full desktop experience
- xl: 1280px - Enhanced desktop layouts
- 2xl: 1536px - Large screen optimizations

#### Common Patterns
1. **Stacking to Row Conversion**:
   ```tsx
   <div className="flex flex-col md:flex-row items-center gap-4">
     <Avatar />
     <div className="text-center md:text-left">User info</div>
   </div>
   ```

2. **Full Width to Fixed Width**:
   ```tsx
   <div className="w-full max-w-full md:max-w-md mx-auto">
     <Card>Content</Card>
   </div>
   ```

3. **Navigation Transformation**:
   ```tsx
   // Mobile menu icon visible on small screens, hidden on md+
   <button className="md:hidden">Menu</button>
   // Full nav hidden on small screens, visible on md+
   <nav className="hidden md:flex">Navigation items</nav>
   ```

## Complex UI Patterns

### Responsive Tables

Tabular data presents unique challenges on mobile. Use one of these patterns based on your specific use case:

#### 1. Card Transformation
Convert tables to card-based layouts on small screens:

```tsx
// Table Component with Mobile Card Transformation
export function ResponsiveTable({ data, columns }) {
  return (
    <>
      {/* Desktop Table - Hidden on Mobile */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            {columns.map(column => <TableHead key={column.key}>{column.label}</TableHead>)}
          </TableHeader>
          <TableBody>
            {data.map(row => (
              <TableRow key={row.id}>
                {columns.map(column => (
                  <TableCell key={`${row.id}-${column.key}`}>{row[column.key]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Mobile Card View - Hidden on Desktop */}
      <div className="md:hidden space-y-4">
        {data.map(row => (
          <Card key={row.id} className="p-4">
            {columns.map(column => (
              <div key={`${row.id}-${column.key}`} className="flex justify-between py-2 border-b last:border-0">
                <span className="font-medium">{column.label}</span>
                <span>{row[column.key]}</span>
              </div>
            ))}
          </Card>
        ))}
      </div>
    </>
  );
}
```

#### 2. Horizontal Scroll
For complex data that must maintain tabular format:

```tsx
<div className="relative">
  <div className="overflow-x-auto -mx-4 sm:mx-0 pb-2">
    <div className="inline-block min-w-full align-middle">
      <Table className="min-w-full">
        {/* Table content */}
      </Table>
    </div>
  </div>
  {/* Optional scroll indicator */}
  <div className="absolute bottom-0 right-0 left-0 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent md:hidden" />
</div>
```

#### 3. Progressive Disclosure
Reveal less important columns as screen size increases:

```tsx
<Table>
  <TableHeader>
    <TableHead>Name</TableHead>
    <TableHead>Status</TableHead>
    <TableHead className="hidden sm:table-cell">Date</TableHead>
    <TableHead className="hidden md:table-cell">Category</TableHead>
    <TableHead className="hidden lg:table-cell">Details</TableHead>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Name value</TableCell>
      <TableCell>Status value</TableCell>
      <TableCell className="hidden sm:table-cell">Date value</TableCell>
      <TableCell className="hidden md:table-cell">Category value</TableCell>
      <TableCell className="hidden lg:table-cell">Details value</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Data Visualization

Charts and data visualizations must adapt to screen sizes:

#### Responsive Chart Containers
```tsx
<div className="w-full h-[300px] sm:h-[400px] md:h-[500px]">
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={data}>
      {/* Chart components */}
    </AreaChart>
  </ResponsiveContainer>
</div>
```

#### Mobile-Specific Chart Configurations
```tsx
// Adapt chart configurations based on screen size
const useMobileChartConfig = () => {
  const isMobile = useMediaQuery('(max-width: 640px)');
  
  return {
    xAxisTickCount: isMobile ? 3 : 7,
    hideTooltip: isMobile,
    labelSize: isMobile ? 12 : 14,
    marginRight: isMobile ? 10 : 30
  };
};
```

## Utility Components

### Responsive Container

Standard container with appropriate padding across breakpoints:

```tsx
export function ResponsiveContainer({ 
  children, 
  className 
}: { 
  children: React.ReactNode, 
  className?: string 
}) {
  return (
    <div className={cn(
      "w-full px-4 sm:px-6 md:px-8 max-w-7xl mx-auto",
      className
    )}>
      {children}
    </div>
  );
}
```

### Responsive Grid

Flexible grid system that adapts columns to screen size:

```tsx
interface ResponsiveGridProps {
  children: React.ReactNode;
  xs?: number; // Columns at extra small screens (default: 1)
  sm?: number; // Columns at small screens (>= 640px)
  md?: number; // Columns at medium screens (>= 768px)
  lg?: number; // Columns at large screens (>= 1024px)
  xl?: number; // Columns at extra large screens (>= 1280px)
  spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg'; // Gap between items
}

export function ResponsiveGrid({ 
  children, 
  xs = 1, 
  sm, 
  md, 
  lg, 
  xl, 
  spacing = 'md' 
}: ResponsiveGridProps) {
  // Generate grid template columns based on breakpoint props
  const getGridColsClass = () => {
    const cols = [
      `grid-cols-${xs}`,
      sm ? `sm:grid-cols-${sm}` : '',
      md ? `md:grid-cols-${md}` : '',
      lg ? `lg:grid-cols-${lg}` : '',
      xl ? `xl:grid-cols-${xl}` : ''
    ];
    return cols.filter(Boolean).join(' ');
  };
  
  // Generate gap class based on spacing prop
  const getGapClass = () => {
    const gaps = {
      none: 'gap-0',
      xs: 'gap-1 sm:gap-2',
      sm: 'gap-2 sm:gap-4',
      md: 'gap-4 sm:gap-6',
      lg: 'gap-6 sm:gap-8'
    };
    return gaps[spacing];
  };
  
  return (
    <div className={`grid ${getGridColsClass()} ${getGapClass()}`}>
      {children}
    </div>
  );
}
```

### Media Query Hook

Custom hook for responsive logic in components:

```tsx
import { useEffect, useState } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const media = window.matchMedia(query);
    const updateMatch = () => setMatches(media.matches);
    
    // Initial check
    updateMatch();
    
    // Listen for changes
    media.addEventListener('change', updateMatch);
    
    // Cleanup
    return () => media.removeEventListener('change', updateMatch);
  }, [query]);
  
  return matches;
}

// Usage example
function MyComponent() {
  const isMobile = useMediaQuery('(max-width: 640px)');
  const isTablet = useMediaQuery('(min-width: 641px) and (max-width: 1024px)');
  
  return (
    <div>
      {isMobile && <MobileLayout />}
      {isTablet && <TabletLayout />}
      {!isMobile && !isTablet && <DesktopLayout />}
    </div>
  );
}
```

## Wealthee-Specific UI Patterns

### Account and Holdings Components

For financial data displays like account holdings, activities, and orders:

```tsx
// Account Summary Card with Responsive Layout
export function AccountSummaryCard({ account }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-lg">{account.name}</CardTitle>
          <Badge className="w-fit mt-2 md:mt-0">{account.status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat label="Total Value" value={formatCurrency(account.totalValue)} />
          <Stat label="Cash" value={formatCurrency(account.cash)} />
          <Stat label="Investments" value={formatCurrency(account.investments)} />
          <Stat label="Open Orders" value={account.openOrders} />
        </div>
      </CardContent>
    </Card>
  );
}
```

### Dashboard Statistics

For key metric displays:

```tsx
// Responsive Stats Grid
export function StatsOverview({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(stat => (
        <Card key={stat.id} className="p-4">
          <div className="flex flex-row items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
              {stat.change && (
                <div className={cn(
                  "text-xs font-medium flex items-center",
                  stat.change > 0 ? "text-green-600" : "text-red-600"
                )}>
                  {stat.change > 0 ? "↑" : "↓"} {Math.abs(stat.change)}%
                </div>
              )}
            </div>
            <div className="hidden sm:block">
              <stat.icon className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
```

### Accessibility Requirements

#### Core Principles
1. **Tap Targets**: All interactive elements must be at least 44×44px on mobile
   ```tsx
   <button className="min-h-[44px] min-w-[44px] p-2">Action</button>
   ```

2. **Font Sizes**: Base font size minimum 16px, with proper scaling
   ```tsx
   // Minimum text size for body content
   <p className="text-base">Content</p>
   ```

3. **Contrast**: Maintain 4.5:1 contrast ratio for normal text, 3:1 for large text
   ```tsx
   // High contrast text on backgrounds
   <p className="text-gray-900 dark:text-gray-100">Content</p>
   ```

4. **Touch Gestures**: Never rely solely on touch gestures without alternatives
   ```tsx
   <div
     role="button"
     onClick={handleAction}
     onKeyDown={(e) => e.key === 'Enter' && handleAction()}
     tabIndex={0}
   >
     Interactive Element
   </div>
   ```

5. **Viewport Configuration**: Always include proper viewport meta tag
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
   ```

### Testing Requirements

1. Test all components across multiple viewport sizes (320px, 375px, 768px, 1024px)
2. Verify touch target sizes on actual mobile devices
3. Test with keyboard navigation to ensure focus states work properly
4. Validate color contrast with WebAIM or similar tools
5. Test with screen readers to verify accessibility

Remember: Build mobile-first, expand to desktop, and ensure accessibility for all users at every viewport size. 
