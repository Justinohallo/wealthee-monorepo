import { cn } from "@/lib/utils";

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  xs?: number; // Columns at extra small screens (default: 1)
  sm?: number; // Columns at small screens (>= 640px)
  md?: number; // Columns at medium screens (>= 768px)
  lg?: number; // Columns at large screens (>= 1024px)
  xl?: number; // Columns at extra large screens (>= 1280px)
  spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg'; // Gap between items
}

/**
 * A responsive grid component that adjusts columns based on screen size
 *
 * @example
 * ```tsx
 * <ResponsiveGrid xs={1} sm={2} md={3} lg={4} spacing="md">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </ResponsiveGrid>
 * ```
 */
export function ResponsiveGrid({
  children,
  className,
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
    <div className={cn(
      'grid',
      getGridColsClass(),
      getGapClass(),
      className
    )}>
      {children}
    </div>
  );
}
