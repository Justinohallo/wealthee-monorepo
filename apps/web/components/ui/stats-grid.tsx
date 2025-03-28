import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface StatItemProps {
  label: React.ReactNode;
  value: React.ReactNode;
  icon?: React.ReactNode;
  change?: number;
  changeLabel?: string;
  className?: string;
  valueClassName?: string;
  labelClassName?: string;
}

/**
 * A component for displaying an individual stat/metric
 */
export function StatItem({
  label,
  value,
  icon,
  change,
  changeLabel,
  className,
  valueClassName,
  labelClassName,
}: StatItemProps) {
  return (
    <Card className={cn("p-4", className)}>
      <div className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <p className={cn("text-sm text-muted-foreground", labelClassName)}>
            {label}
          </p>
          <h3 className={cn("text-2xl font-bold", valueClassName)}>
            {value}
          </h3>
          {(change !== undefined || changeLabel) && (
            <div
              className={cn(
                "text-xs font-medium flex items-center",
                change !== undefined && change > 0
                  ? "text-green-600"
                  : change !== undefined && change < 0
                    ? "text-red-600"
                    : "text-muted-foreground"
              )}
            >
              {change !== undefined && (
                <span className="mr-1">
                  {change > 0 ? "↑" : change < 0 ? "↓" : "→"}
                </span>
              )}
              {change !== undefined ? `${Math.abs(change)}%` : ""}
              {changeLabel && (change !== undefined ? " " : "")}
              {changeLabel}
            </div>
          )}
        </div>
        {icon && <div className="hidden sm:block">{icon}</div>}
      </div>
    </Card>
  );
}

interface StatsGridProps {
  stats: StatItemProps[];
  className?: string;
  columns?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

/**
 * A responsive grid of stats/metrics
 *
 * @example
 * ```tsx
 * <StatsGrid
 *   stats={[
 *     { label: "Total Value", value: "$10,324.65", change: 2.5 },
 *     { label: "Cash", value: "$2,420.00" },
 *     { label: "Invested", value: "$7,904.65", change: -1.2 },
 *   ]}
 * />
 * ```
 */
export function StatsGrid({
  stats,
  className,
  columns = { xs: 1, sm: 2, lg: 4 }
}: StatsGridProps) {
  // Generate grid-cols classes based on the columns prop
  const gridColsClasses = [
    columns.xs && `grid-cols-${columns.xs}`,
    columns.sm && `sm:grid-cols-${columns.sm}`,
    columns.md && `md:grid-cols-${columns.md}`,
    columns.lg && `lg:grid-cols-${columns.lg}`,
    columns.xl && `xl:grid-cols-${columns.xl}`
  ].filter(Boolean).join(' ');

  return (
    <div className={cn("grid gap-4", gridColsClasses, className)}>
      {stats.map((stat, index) => (
        <StatItem key={index} {...stat} />
      ))}
    </div>
  );
}
