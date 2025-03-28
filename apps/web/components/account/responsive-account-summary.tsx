import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { ResponsiveGrid } from "@/components/ui/responsive-grid";
import { StatItem } from "@/components/ui/stats-grid";

interface AccountSummaryProps {
  account: {
    id: string;
    name: string;
    number?: string;
    institution_name?: string;
    status?: string;
    balance?: {
      totalValue?: number;
      cash?: number;
      investments?: number;
      buyingPower?: number;
    };
    meta?: {
      type?: string;
      status?: "open" | "closed";
    };
    openOrders?: number;
    currency?: string;
  };
  className?: string;
  isLoading?: boolean;
}

/**
 * A responsive account summary component that displays key account information
 * Mobile-first design that stacks content on small screens and adopts a row layout on larger screens
 */
export function ResponsiveAccountSummary({
  account,
  className,
  isLoading = false,
}: AccountSummaryProps) {
  if (isLoading) {
    return (
      <Card className={cn("animate-pulse", className)}>
        <CardHeader>
          <div className="h-7 bg-muted rounded-md w-1/3"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded-md w-full"></div>
            <div className="h-4 bg-muted rounded-md w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status?: string) => {
    if (!status) return "bg-gray-100 text-gray-800";

    status = status.toLowerCase();
    if (status === "open") return "bg-green-100 text-green-800";
    if (status === "closed") return "bg-red-100 text-red-800";
    return "bg-blue-100 text-blue-800";
  };

  // Use a default currency if none is provided
  const currency = account.currency || "USD";

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <CardTitle className="text-xl">
            {account.name}
            {account.number && (
              <span className="text-sm font-normal ml-2 text-muted-foreground">
                #{account.number}
              </span>
            )}
          </CardTitle>
          {(account.status || account.meta?.status) && (
            <Badge
              className={cn(
                "w-fit",
                getStatusColor(account.meta?.status || account.status)
              )}
            >
              {account.meta?.status || account.status}
            </Badge>
          )}
        </div>
        {account.institution_name && (
          <p className="text-sm text-muted-foreground mt-1">
            {account.institution_name}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <ResponsiveGrid xs={1} sm={2} lg={4} spacing="sm">
          <StatItem
            label="Total Value"
            value={formatCurrency(account.balance?.totalValue || 0, currency)}
            valueClassName={cn(
              "text-xl md:text-2xl",
              (account.balance?.totalValue || 0) > 0
                ? "text-green-600"
                : (account.balance?.totalValue || 0) < 0
                  ? "text-red-600"
                  : ""
            )}
          />
          <StatItem
            label="Cash"
            value={formatCurrency(account.balance?.cash || 0, currency)}
          />
          <StatItem
            label="Investments"
            value={formatCurrency(account.balance?.investments || 0, currency)}
          />
          <StatItem
            label="Buying Power"
            value={formatCurrency(account.balance?.buyingPower || 0, currency)}
          />
        </ResponsiveGrid>

        {account.meta?.type && (
          <p className="text-xs text-muted-foreground mt-4">
            Account Type: {account.meta.type}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
