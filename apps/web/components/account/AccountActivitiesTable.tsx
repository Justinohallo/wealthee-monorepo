'use client'
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/format-currency";
import { Badge } from "@/components/ui/badge";
import { ActivitySquare } from "lucide-react";
import { PaginatedUniversalActivity } from "@/types/snaptrade";
import { ResponsiveTableClient } from "./ResponsiveTableClient";
import { type SimpleColumn, type CellContent } from "@/components/ui/responsive-table";
import { formatDate } from "@/lib/format-date";

interface AccountActivitiesTableProps {
  activities: PaginatedUniversalActivity;
  isLoading?: boolean;
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

function CurrencyBadge({ code }: { code: string }) {
  return (
    <Badge variant="outline" className="px-2 py-1 text-xs bg-gray-50">
      {code}
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

    // Format the amount with the currency symbol but without the currency code
    const formattedAmount = formatCurrency(activity.amount || 0, currency);

    return {
      id: activity.id || `activity-${index}`,
      date: formatDate(activity.date || "").split(",")[0], // Show only day/month for mobile
      dateFull: formatDate(activity.date || ""),
      type: <ActivityTypeBadge type={activity.type || "Unknown"} />,
      description: activity.description,
      symbol: typeof activity.symbol === 'string'
        ? activity.symbol
        : activity.symbol?.symbol || '—',
      currency: <CurrencyBadge code={currency} />,
      // For mobile: include amount with currency
      amount_with_currency: (
        <div className="flex flex-col items-end gap-1">
          <span className={cn(
            "font-medium",
            (activity.amount || 0) > 0 ? "text-green-600" :
              (activity.amount || 0) < 0 ? "text-red-600" : ""
          )}>
            {formattedAmount}
          </span>
          <span className="text-xs text-gray-500">{currency}</span>
        </div>
      ),
      // For desktop: amount only (currency is in separate column)
      amount: (
        <span className={cn(
          "font-medium",
          (activity.amount || 0) > 0 ? "text-green-600" :
            (activity.amount || 0) < 0 ? "text-red-600" : ""
        )}>
          {formattedAmount}
        </span>
      )
    };
  });

  // Mobile shows less detail but includes currency with amount
  const mobileColumns: SimpleColumn[] = [
    { key: "date", label: "Date" },
    { key: "type", label: "Type" },
    { key: "amount_with_currency", label: "Amount", className: "text-right" }
  ];

  // Desktop shows full details with separate currency column
  const desktopColumns: SimpleColumn[] = [
    { key: "dateFull", label: "Date" },
    { key: "type", label: "Type" },
    { key: "description", label: "Description", className: "max-w-md truncate" },
    { key: "symbol", label: "Symbol", className: "font-medium" },
    { key: "currency", label: "Currency", className: "text-center" },
    { key: "amount", label: "Amount", className: "text-right" }
  ];

  const EMPTY_MESSAGE = (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <ActivitySquare className="h-12 w-12 text-muted-foreground mb-2" />
      <p>No recent activities found</p>
    </div>
  );

  return (
    <div className="w-full overflow-hidden">
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
    </div>
  );
}
