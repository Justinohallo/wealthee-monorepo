'use client'
import { Position } from "@/types/snaptrade";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";
import { LineChart } from "lucide-react";
import { ResponsiveTableClient } from "./ResponsiveTableClient";
import { type Column } from "@/components/ui/responsive-table";

// Define column sets outside the component to avoid recreating them on each render
const MOBILE_COLUMNS: Column<Position>[] = [
  {
    key: "symbol",
    label: "Symbol",
    className: "font-medium",
    render: (_, position) => position.symbol?.symbol?.symbol || "N/A"
  },
  {
    key: "units",
    label: "Qty",
    className: "text-right",
    render: (value) => value ? Number(value).toFixed(2) : "N/A"
  },
  {
    key: "market_value",
    label: "Value",
    className: "text-right",
    render: (_, position) => {
      const marketValue = (position.price || 0) * (position.units || 0);
      return formatCurrency(marketValue, position.currency?.code || 'USD');
    }
  }
];

const DESKTOP_COLUMNS: Column<Position>[] = [
  {
    key: "symbol",
    label: "Symbol",
    className: "font-medium",
    render: (_, position) => position.symbol?.symbol?.symbol || "N/A"
  },
  {
    key: "units",
    label: "Quantity",
    className: "text-right",
    render: (value) => value ? Number(value).toFixed(2) : "N/A"
  },
  {
    key: "price",
    label: "Price",
    className: "text-right",
    render: (value, position) => value
      ? formatCurrency(value, position.currency?.code || 'USD')
      : "N/A"
  },
  {
    key: "market_value",
    label: "Market Value",
    className: "text-right",
    render: (_, position) => {
      const marketValue = (position.price || 0) * (position.units || 0);
      return formatCurrency(marketValue, position.currency?.code || 'USD');
    }
  },
  {
    key: "open_pnl",
    label: "P/L",
    className: "text-right",
    render: (value, position) => {
      if (typeof value !== 'number') return "N/A";

      return (
        <span className={cn(
          "font-medium",
          value > 0 ? "text-green-600" :
            value < 0 ? "text-red-600" : ""
        )}>
          {formatCurrency(value, position.currency?.code || 'USD')}
        </span>
      );
    }
  }
];

const EMPTY_MESSAGE = (
  <div className="flex flex-col items-center justify-center py-8 text-center">
    <LineChart className="h-12 w-12 text-muted-foreground mb-2" />
    <p>No positions found</p>
  </div>
);

interface AccountPositionsTableProps {
  positions: Position[];
  isLoading?: boolean;
}

export function AccountPositionsTable({
  positions,
  isLoading = false
}: AccountPositionsTableProps) {
  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="sticky top-0 z-10 bg-background border-b">
        <CardTitle className="text-lg sm:text-xl">Positions</CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 md:p-6">
        {isLoading ? (
          // Skeleton loading state
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex h-12 items-center">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="ml-auto h-4 bg-muted rounded w-16"></div>
              </div>
            ))}
          </div>
        ) : (
          // Use our client component for responsive tables
          <ResponsiveTableClient
            data={positions.map((position, index) => ({
              ...position,
              // Add a unique id field if one doesn't exist
              _positionIndex: index
            }))}
            mobileColumns={MOBILE_COLUMNS}
            desktopColumns={DESKTOP_COLUMNS}
            emptyMessage={EMPTY_MESSAGE}
            keyField="_positionIndex"
            rowClassName="transition-colors hover:bg-muted/50"
          />
        )}
      </CardContent>
    </Card>
  );
}
