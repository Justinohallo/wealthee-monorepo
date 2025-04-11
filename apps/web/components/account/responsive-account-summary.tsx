import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Account } from "@/types/snaptrade";
import { Badge } from "@/components/ui/badge";
import { ResponsiveGrid } from "@/components/ui/responsive-grid";
import { StatItem } from "@/components/ui/stats-grid";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/format-currency";

interface AccountSummaryProps {
  account: Account;
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
    if (status === "active") return "bg-green-100 text-green-800";
    if (status === "closed" || status === "inactive") return "bg-red-100 text-red-800";
    return "bg-blue-100 text-blue-800";
  };

  // Use a default currency if none is provided
  const currency = account.balance?.total?.currency || "USD";

  // Get the total balance amount
  const totalValue = account.balance?.total?.amount || 0;

  // Since we don't have separate cash and investments values in this data structure,
  // we'll just display the total value for now
  const lastSyncDate = account.sync_status?.holdings?.last_successful_sync ??
    account.sync_status?.transactions?.last_successful_sync ??
    "Unknown";

  // Format the last sync date to be more user-friendly
  let formattedSyncDate = "Unknown";

  if (typeof lastSyncDate === 'string') {
    // Default to the original string
    formattedSyncDate = lastSyncDate;

    try {
      if (lastSyncDate.includes("T")) {
        // If it's an ISO date format
        formattedSyncDate = new Date(lastSyncDate).toLocaleDateString();
      } else if (lastSyncDate.includes("+")) {
        // If it's a timestamp with timezone, extract the date part
        const dateStr = lastSyncDate.split("+")[0];
        if (dateStr) {
          formattedSyncDate = new Date(dateStr).toLocaleDateString();
        }
      }
    } catch {
      // If there's an error parsing the date, use the raw string
      formattedSyncDate = lastSyncDate;
    }
  }

  // Safely format the created date
  const createdDate = account.created_date
    ? new Date(account.created_date).toLocaleDateString()
    : "N/A";

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <CardTitle className="text-xl">
            {account.name || "Account"}
            {account.number && (
              <span className="text-sm font-normal ml-2 text-muted-foreground">
                #{account.number}
              </span>
            )}
          </CardTitle>
          {account.meta?.status && (
            <Badge
              className={cn(
                "w-fit",
                getStatusColor(account.meta.status)
              )}
            >
              {account.meta.status}
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
        <ResponsiveGrid xs={1} sm={2} lg={3} spacing="sm">
          <StatItem
            label="Total Value"
            value={formatCurrency(totalValue, currency)}
            valueClassName={cn(
              "text-xl md:text-2xl",
              totalValue > 0
                ? "text-green-600"
                : totalValue < 0
                  ? "text-red-600"
                  : ""
            )}
          />
          <StatItem
            label="Account Type"
            value={account.meta?.type || account.raw_type || "Unknown"}
          />
          <StatItem
            label="Last Synced"
            value={formattedSyncDate}
          />
          <StatItem
            label="Creation Date"
            value={createdDate}
          />
        </ResponsiveGrid>
      </CardContent>
    </Card>
  );
}
