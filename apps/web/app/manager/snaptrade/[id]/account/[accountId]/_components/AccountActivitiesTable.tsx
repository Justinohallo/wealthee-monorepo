'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ActivitySquare } from "lucide-react";
import { PaginatedUniversalActivity } from "@/types/snaptrade";
import { ResponsiveTableClient } from "./ResponsiveTableClient";
import { type Column } from "@/components/ui/responsive-table";

// Define column sets outside the component to avoid recreating them on each render
const MOBILE_COLUMNS: Column[] = [
  {
    key: "date",
    label: "Date",
    render: (value) => formatDate(value || "").split(",")[0] // Show only day/month
  },
  {
    key: "type",
    label: "Type",
    render: (value) => <ActivityTypeBadge type={value || "Unknown"} />
  },
  {
    key: "amount",
    label: "Amount",
    className: "text-right",
    render: (value, row) => {
      const currency = typeof row.currency === 'string'
        ? row.currency
        : row.currency?.code || 'USD';

      return (
        <span className={cn(
          "font-medium",
          value > 0 ? "text-green-600" :
            value < 0 ? "text-red-600" : ""
        )}>
          {formatCurrency(value || 0, currency)}
        </span>
      );
    }
  }
];

const DESKTOP_COLUMNS: Column[] = [
  {
    key: "date",
    label: "Date",
    render: (value) => formatDate(value || "")
  },
  {
    key: "type",
    label: "Type",
    render: (value) => <ActivityTypeBadge type={value || "Unknown"} />
  },
  {
    key: "description",
    label: "Description",
    className: "max-w-md truncate"
  },
  {
    key: "symbol",
    label: "Symbol",
    className: "font-medium",
    render: (value, row) => {
      if (typeof value === 'string') {
        return value;
      }
      return value?.symbol || '—';
    }
  },
  {
    key: "amount",
    label: "Amount",
    className: "text-right",
    render: (value, row) => {
      const currency = typeof row.currency === 'string'
        ? row.currency
        : row.currency?.code || 'USD';

      return (
        <span className={cn(
          "font-medium",
          value > 0 ? "text-green-600" :
            value < 0 ? "text-red-600" : ""
        )}>
          {formatCurrency(value || 0, currency)}
        </span>
      );
    }
  }
];

const EMPTY_MESSAGE = (
  <div className="flex flex-col items-center justify-center py-8 text-center">
    <ActivitySquare className="h-12 w-12 text-muted-foreground mb-2" />
    <p>No recent activities found</p>
  </div>
);

interface AccountActivitiesTableProps {
  activities: PaginatedUniversalActivity;
  isLoading?: boolean;
}

export function AccountActivitiesTable({
  activities,
  isLoading = false
}: AccountActivitiesTableProps) {
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
          // Use our client component for responsive tables
          <ResponsiveTableClient
            data={(activities?.data || []).map((activity, index) => ({
              ...activity,
              // Add a unique id field if one doesn't exist
              _activityIndex: index
            }))}
            mobileColumns={MOBILE_COLUMNS}
            desktopColumns={DESKTOP_COLUMNS}
            emptyMessage={EMPTY_MESSAGE}
            keyField="_activityIndex"
            rowClassName="transition-colors hover:bg-muted/50"
          />
        )}
      </CardContent>
    </Card>
  );
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
