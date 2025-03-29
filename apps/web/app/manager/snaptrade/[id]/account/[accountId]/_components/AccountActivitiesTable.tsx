'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ActivitySquare } from "lucide-react";
import { PaginatedUniversalActivity } from "@/types/snaptrade";
import { ResponsiveTableClient } from "./ResponsiveTableClient";
import { type SimpleColumn, type CellContent } from "@/components/ui/responsive-table";

interface AccountActivitiesTableProps {
  activities: PaginatedUniversalActivity;
  isLoading?: boolean;
}

// Format date to a readable string
function formatDate(dateString: string): string {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function ActivityTypeBadge({ type }: { type: string }) {
  const getVariant = (type: string) => {
    const normalizedType = type.toUpperCase();

    if (normalizedType.includes('BUY')) return "default";
    if (normalizedType.includes('SELL')) return "destructive";
    if (normalizedType.includes('DIVIDEND')) return "outline";
    if (normalizedType.includes('CONTRIBUTION') || normalizedType.includes('DEPOSIT')) return "default";
    if (normalizedType.includes('WITHDRAWAL')) return "destructive";
    if (normalizedType.includes('INTEREST')) return "outline";
    if (normalizedType.includes('FEE')) return "destructive";

    return "secondary";
  };

  return (
    <Badge variant={getVariant(type)}>
      {type}
    </Badge>
  );
}

export function AccountActivitiesTable({
  activities,
  isLoading = false
}: AccountActivitiesTableProps) {
  // Pre-format cells for activities
  const activityCells: CellContent[] = (activities?.data || []).map((activity, index) => {
    const currency = typeof activity.currency === 'string'
      ? activity.currency
      : activity.currency?.code || 'USD';

    return {
      id: activity.id || `activity-${index}`,
      date: formatDate(activity.date || "").split(",")[0], // Show only day/month for mobile
      dateFull: formatDate(activity.date || ""),
      type: <ActivityTypeBadge type={activity.type || "Unknown"} />,
      description: activity.description,
      symbol: typeof activity.symbol === 'string'
        ? activity.symbol
        : activity.symbol?.symbol || '—',
      amount: (
        <span className={cn(
          "font-medium",
          (activity.amount || 0) > 0 ? "text-green-600" :
            (activity.amount || 0) < 0 ? "text-red-600" : ""
        )}>
          {formatCurrency(activity.amount || 0, currency)}
        </span>
      )
    };
  });

  // Mobile shows less detail
  const mobileColumns: SimpleColumn[] = [
    { key: "date", label: "Date" },
    { key: "type", label: "Type" },
    { key: "amount", label: "Amount", className: "text-right" }
  ];

  // Desktop shows full details
  const desktopColumns: SimpleColumn[] = [
    { key: "dateFull", label: "Date" },
    { key: "type", label: "Type" },
    { key: "description", label: "Description", className: "max-w-md truncate" },
    { key: "symbol", label: "Symbol", className: "font-medium" },
    { key: "amount", label: "Amount", className: "text-right" }
  ];

  const EMPTY_MESSAGE = (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <ActivitySquare className="h-12 w-12 text-muted-foreground mb-2" />
      <p>No recent activities found</p>
    </div>
  );

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="sticky top-0 z-10 bg-background border-b">
        <CardTitle className="text-lg sm:text-xl">Account Activities</CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 md:p-6">
        {isLoading ? (
          // Skeleton loading state
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse flex h-12 items-center">
                <div className="h-4 bg-muted rounded w-1/5"></div>
                <div className="ml-4 h-4 bg-muted rounded w-2/5"></div>
                <div className="ml-auto h-4 bg-muted rounded w-16"></div>
              </div>
            ))}
          </div>
        ) : (
          <ResponsiveTableClient
            data={activityCells}
            mobileColumns={mobileColumns}
            desktopColumns={desktopColumns}
            emptyMessage={EMPTY_MESSAGE}
            keyField="id"
            rowClassName="transition-colors hover:bg-muted/50"
          />
        )}
      </CardContent>
    </Card>
  );
}
