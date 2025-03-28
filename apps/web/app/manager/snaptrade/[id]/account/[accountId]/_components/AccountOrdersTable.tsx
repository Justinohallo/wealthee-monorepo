'use client'
import { type Order } from "@/types/snaptrade";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LayoutList } from "lucide-react";
import { ResponsiveTableClient } from "./ResponsiveTableClient";
import { type Column } from "@/components/ui/responsive-table";

// Define column sets outside the component to avoid recreating them on each render
const MOBILE_COLUMNS: Column<Order>[] = [
  {
    key: "symbol",
    label: "Symbol",
    className: "font-medium"
  },
  {
    key: "action",
    label: "Action",
    render: (value) => (
      <span className={cn(
        "font-medium",
        value === "BUY" ? "text-green-600" : "text-red-600"
      )}>
        {value}
      </span>
    )
  },
  {
    key: "status",
    label: "Status",
    render: (value) => <OrderStatusBadge status={value} />
  }
];

const DESKTOP_COLUMNS: Column<Order>[] = [
  {
    key: "symbol",
    label: "Symbol",
    className: "font-medium"
  },
  {
    key: "order_type",
    label: "Type"
  },
  {
    key: "action",
    label: "Action",
    render: (value) => (
      <span className={cn(
        "font-medium",
        value === "BUY" ? "text-green-600" : "text-red-600"
      )}>
        {value}
      </span>
    )
  },
  {
    key: "total_quantity",
    label: "Quantity"
  },
  {
    key: "status",
    label: "Status",
    render: (value) => <OrderStatusBadge status={value} />
  },
  {
    key: "time_placed",
    label: "Date",
    className: "text-right",
    render: (value) => formatDate(value)
  }
];

const EMPTY_MESSAGE = (
  <div className="flex flex-col items-center justify-center py-8 text-center">
    <LayoutList className="h-12 w-12 text-muted-foreground mb-2" />
    <p>No recent orders found</p>
  </div>
);

interface AccountOrdersTableProps {
  orders: Order[];
  isLoading?: boolean;
}

export function AccountOrdersTable({
  orders,
  isLoading = false
}: AccountOrdersTableProps) {
  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="sticky top-0 z-10 bg-background border-b">
        <CardTitle className="text-lg sm:text-xl">Recent Orders</CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 md:p-6">
        {isLoading ? (
          // Skeleton loading state
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex h-12 items-center">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="ml-auto h-4 bg-muted rounded w-16"></div>
              </div>
            ))}
          </div>
        ) : (
          // Use our client component for responsive tables
          <ResponsiveTableClient
            data={(orders || []).map((order, index) => ({
              ...order,
              // Add a unique id field if one doesn't exist
              _orderIndex: index
            }))}
            mobileColumns={MOBILE_COLUMNS}
            desktopColumns={DESKTOP_COLUMNS}
            emptyMessage={EMPTY_MESSAGE}
            keyField="_orderIndex"
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

function OrderStatusBadge({ status }: { status: string }) {
  const getVariant = (status: string) => {
    switch (status.toUpperCase()) {
      case "EXECUTED":
      case "FILLED":
        return "default";
      case "PENDING":
      case "OPEN":
        return "secondary";
      case "CANCELED":
      case "REJECTED":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <Badge variant={getVariant(status)}>
      {status}
    </Badge>
  );
}
