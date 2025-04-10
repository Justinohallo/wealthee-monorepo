'use client'
import { type Order } from "@/types/snaptrade";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LayoutList } from "lucide-react";
import { ResponsiveTableClient } from "./ResponsiveTableClient";
import { type SimpleColumn } from "@/components/ui/responsive-table";
import { formatDate } from "@/lib/format-date";

// Define columns with simple structure
const MOBILE_COLUMNS: SimpleColumn[] = [
  { key: "symbol", label: "Symbol", className: "font-medium" },
  { key: "action", label: "Action" },
  { key: "status", label: "Status" }
];

const DESKTOP_COLUMNS: SimpleColumn[] = [
  { key: "symbol", label: "Symbol", className: "font-medium" },
  { key: "order_type", label: "Type" },
  { key: "action", label: "Action" },
  { key: "total_quantity", label: "Quantity" },
  { key: "status", label: "Status" },
  { key: "time_placed", label: "Date", className: "text-right" }
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

export function AccountOrdersTable({
  orders,
  isLoading = false
}: AccountOrdersTableProps) {
  // Pre-format our cell data
  const orderData = (orders || []).map((order, index) => {
    return {
      ...order,
      id: `order-${index}`,
      _orderIndex: index,
      action: (
        <span className={cn(
          "font-medium",
          order.action === "BUY" ? "text-green-600" : "text-red-600"
        )}>
          {order.action}
        </span>
      ),
      status: <OrderStatusBadge status={order.status || ""} />,
      time_placed: formatDate(order.time_placed || "")
    };
  });

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
            data={orderData}
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
