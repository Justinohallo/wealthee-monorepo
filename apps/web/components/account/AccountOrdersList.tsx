import { type Order } from "@/types/snaptrade";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface AccountOrdersListProps {
    orders: Order[];
    isLoading?: boolean;
}

export function AccountOrdersList({ orders, isLoading = false }: AccountOrdersListProps) {
    if (isLoading) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-40">
                        <p className="text-muted-foreground">Loading orders...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!orders || orders.length === 0) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-40">
                        <p className="text-muted-foreground">No recent orders found</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Symbol</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Action</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.brokerage_order_id}>
                                <TableCell className="font-medium">{order.symbol}</TableCell>
                                <TableCell>{order.order_type}</TableCell>
                                <TableCell>
                                    <span className={cn(
                                        "font-medium",
                                        order.action === "BUY" ? "text-green-600" : "text-red-600"
                                    )}>
                                        {order.action}
                                    </span>
                                </TableCell>
                                <TableCell>{order.total_quantity}</TableCell>
                                <TableCell>
                                    <OrderStatusBadge status={order.status} />
                                </TableCell>
                                <TableCell className="text-right">
                                    {formatDate(order.time_placed)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
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
