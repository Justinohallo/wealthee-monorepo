import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ArrowDownIcon, ArrowUpIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format-currency";
import { getManagerPrimaryAccount } from "@/services/client/dashboard";

interface AccountDisplayProps {
  clientId: string;
  token: string;
}

export default async function AccountDisplay({ clientId, token }: AccountDisplayProps) {
  const account = await getManagerPrimaryAccount(clientId, token);

  if (!account) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Account Not Found</AlertTitle>
        <AlertDescription>
          We could not retrieve your portfolio manager's account information. Please contact your portfolio manager.
        </AlertDescription>
      </Alert>
    );
  }

  // Extract account balance information
  const totalValue = account.totalEquityValue || 0;
  const cashValue = account.cash || 0;
  const investmentsValue = totalValue - cashValue;

  // Determine if account is up or down (placeholder logic)
  const isPositive = totalValue > 0;
  const changePercent = 0.5; // Placeholder - this would come from actual data

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">{account.name}</h3>
        <div className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? (
            <ArrowUpIcon className="h-4 w-4 mr-1" />
          ) : (
            <ArrowDownIcon className="h-4 w-4 mr-1" />
          )}
          <span>{changePercent.toFixed(2)}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 bg-muted/50">
          <p className="text-sm text-muted-foreground mb-1">Total Value</p>
          <p className="text-lg font-semibold">{formatCurrency(totalValue)}</p>
        </Card>

        <Card className="p-4 bg-muted/50">
          <p className="text-sm text-muted-foreground mb-1">Cash</p>
          <p className="text-lg font-semibold">{formatCurrency(cashValue)}</p>
        </Card>

        <Card className="p-4 bg-muted/50">
          <p className="text-sm text-muted-foreground mb-1">Investments</p>
          <p className="text-lg font-semibold">{formatCurrency(investmentsValue)}</p>
        </Card>
      </div>

      <div className="mt-8">
        <p className="text-sm text-muted-foreground mb-4">
          This information is from your portfolio manager's primary SnapTrade account.
          For more detailed information, please contact your portfolio manager.
        </p>
      </div>
    </div>
  );
}
