import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn, formatCurrency } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { PaginatedUniversalActivity } from "snaptrade-typescript-sdk";

interface AccountActivitiesListProps {
  activities: PaginatedUniversalActivity;
  isLoading?: boolean;
}

export function AccountActivitiesList({ activities, isLoading = false }: AccountActivitiesListProps) {
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Account Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">Loading activities...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!activities || !activities.data || activities.data.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Account Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">No recent activities found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Account Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.data.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell>{formatDate(activity.date || '')}</TableCell>
                  <TableCell>
                    <ActivityTypeBadge type={activity.type || 'Unknown'} />
                  </TableCell>
                  <TableCell className="max-w-md truncate">
                    {activity.description || 'No description'}
                  </TableCell>
                  <TableCell className="font-medium">
                    {typeof activity.symbol === 'string'
                      ? activity.symbol
                      : activity.symbol?.symbol || '—'}
                  </TableCell>
                  <TableCell className={cn(
                    "text-right font-medium",
                    activity.amount && activity.amount > 0 ? "text-green-600" :
                      activity.amount && activity.amount < 0 ? "text-red-600" : ""
                  )}>
                    {formatCurrency(activity.amount || 0,
                      typeof activity.currency === 'string'
                        ? activity.currency
                        : activity.currency?.code || 'USD')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
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
