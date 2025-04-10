'use client'
import { Position } from "@/types/snaptrade";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/format-currency";
import { LineChart } from "lucide-react";
import { ResponsiveTableClient } from "./ResponsiveTableClient";
import { type SimpleColumn } from "@/components/ui/responsive-table";

// Define columns with simple structure
const MOBILE_COLUMNS: SimpleColumn[] = [
  { key: "symbol", label: "Symbol", className: "font-medium" },
  { key: "units", label: "Qty", className: "text-right" },
  { key: "market_value", label: "Value", className: "text-right" }
];

const DESKTOP_COLUMNS: SimpleColumn[] = [
  { key: "symbol", label: "Symbol", className: "font-medium" },
  { key: "units", label: "Quantity", className: "text-right" },
  { key: "price", label: "Price", className: "text-right" },
  { key: "market_value", label: "Market Value", className: "text-right" },
  { key: "open_pnl", label: "P/L", className: "text-right" }
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
  // Pre-format the positions data
  const positionData = positions.map((position, index) => {
    const marketValue = (position.price || 0) * (position.units || 0);

    return {
      ...position,
      id: `position-${index}`,
      _positionIndex: index,
      // Format the symbol
      symbol: position.symbol?.symbol?.symbol || "N/A",
      // Format the units
      units: position.units ? Number(position.units).toFixed(2) : "N/A",
      // Format the price
      price: position.price
        ? formatCurrency(Number(position.price), position.currency?.code || 'USD')
        : "N/A",
      // Format the market value
      market_value: formatCurrency(marketValue, position.currency?.code || 'USD'),
      // Format the P/L
      open_pnl: typeof position.open_pnl === 'number' ? (
        <span className={cn(
          "font-medium",
          position.open_pnl > 0 ? "text-green-600" :
            position.open_pnl < 0 ? "text-red-600" : ""
        )}>
          {formatCurrency(position.open_pnl, position.currency?.code || 'USD')}
        </span>
      ) : "N/A"
    };
  });

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
            data={positionData}
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
