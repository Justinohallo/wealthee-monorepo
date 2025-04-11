'use client'
import { Position } from "@/types/snaptrade";
import { formatCurrency } from "@/lib/format-currency";
import { LineChart, TrendingDown, TrendingUp } from "lucide-react";
import { ResponsiveTableClient } from "./ResponsiveTableClient";
import { type SimpleColumn } from "@/components/ui/responsive-table";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

// Define columns with simple structure
const MOBILE_COLUMNS: SimpleColumn[] = [
  { key: "symbol", label: "Symbol", className: "font-medium" },
  { key: "units", label: "Qty", className: "text-right" },
  { key: "market_value", label: "Value", className: "text-right" },
  { key: "percent_change", label: "%", className: "text-right" }
];

const DESKTOP_COLUMNS: SimpleColumn[] = [
  { key: "symbol_with_type", label: "Symbol", className: "font-medium" },
  { key: "units", label: "Quantity", className: "text-right" },
  { key: "price", label: "Price", className: "text-right" },
  { key: "cost_basis", label: "Cost Basis", className: "text-right" },
  { key: "market_value", label: "Market Value", className: "text-right" },
  { key: "percent_change", label: "% Change", className: "text-right" },
  { key: "open_pnl", label: "Total P/L", className: "text-right" }
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

function SecurityTypeBadge({ type }: { type?: string }) {
  if (!type) return null;

  const getVariant = (type: string): "default" | "secondary" | "outline" | "destructive" => {
    const normalizedType = type.toLowerCase();
    if (normalizedType.includes('stock')) return "default";
    if (normalizedType.includes('etf')) return "secondary";
    if (normalizedType.includes('fund') || normalizedType.includes('mutual')) return "outline";
    if (normalizedType.includes('bond')) return "secondary";
    if (normalizedType.includes('crypto')) return "destructive";
    if (normalizedType.includes('option')) return "secondary";
    return "default";
  };

  return (
    <Badge variant={getVariant(type)} className="ml-2 text-xs">
      {type}
    </Badge>
  );
}

function PercentChange({ value }: { value: number }) {
  const formattedValue = value.toFixed(2);
  const Icon = value > 0 ? TrendingUp : value < 0 ? TrendingDown : null;

  return (
    <span className={cn(
      "font-medium inline-flex items-center gap-1",
      value > 0 ? "text-green-600" :
        value < 0 ? "text-red-600" : "text-gray-500"
    )}>
      {Icon && <Icon className="h-3 w-3" />}
      {value > 0 ? '+' : ''}{formattedValue}%
    </span>
  );
}

export function AccountPositionsTable({
  positions,
  isLoading = false
}: AccountPositionsTableProps) {
  // Pre-format the positions data
  const positionData = positions.map((position, index) => {
    // Calculate total units (including fractional)
    const totalUnits = position.units || 0;

    // Calculate values
    const marketValue = (position.price || 0) * totalUnits;
    const costBasis = (position.average_purchase_price || 0) * totalUnits;

    // Calculate percent change if we have both price and average purchase price
    const percentChange = position.average_purchase_price && position.price
      ? ((position.price - position.average_purchase_price) / position.average_purchase_price) * 100
      : 0;

    // Get currency code
    const currencyCode = position.symbol?.symbol?.currency?.code || 'USD';
    // Get security type from the nested structure
    const securityType = position.symbol?.symbol?.type?.description || 'Stock';

    // Get symbol with exchange suffix if available
    const symbolDisplay = position.symbol?.symbol?.symbol || "N/A";
    const symbolDescription = position.symbol?.symbol?.description || "";

    return {
      ...position,
      id: `position-${index}`,
      _positionIndex: index,
      // Format the symbol
      symbol: symbolDisplay,
      symbol_with_type: (
        <div className="flex flex-col">
          <div className="flex items-center">
            <span>{symbolDisplay}</span>
            <SecurityTypeBadge type={securityType} />
          </div>
          {symbolDescription && (
            <span className="text-xs text-gray-500 truncate max-w-[200px]">
              {symbolDescription}
            </span>
          )}
        </div>
      ),
      // Format the units with fractional units
      units: position.units,
      // Format the price
      price: position.price
        ? formatCurrency(Number(position.price), currencyCode)
        : "N/A",
      // Format cost basis
      cost_basis: position.average_purchase_price
        ? formatCurrency(costBasis, currencyCode)
        : "N/A",
      // Format the market value
      market_value: formatCurrency(marketValue, currencyCode),
      // Format percent change
      percent_change: <PercentChange value={percentChange} />,
      // Format the P/L
      open_pnl: typeof position.open_pnl === 'number' ? (
        <span className={cn(
          "font-medium",
          position.open_pnl > 0 ? "text-green-600" :
            position.open_pnl < 0 ? "text-red-600" : ""
        )}>
          {formatCurrency(position.open_pnl, currencyCode)}
          {percentChange !== 0 && (
            <span className="text-xs ml-1">({percentChange > 0 ? '+' : ''}{percentChange.toFixed(2)}%)</span>
          )}
        </span>
      ) : "N/A"
    };
  });

  return (
    <div className="w-full overflow-hidden">
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
    </div>
  );
}
