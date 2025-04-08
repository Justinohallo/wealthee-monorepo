import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Account } from "@/types/snaptrade";
import { formatCurrency } from "@/lib/format-currency";

interface PortfolioCardProps {
  account: Account;
}

export function PortfolioCard({ account }: PortfolioCardProps) {
  if (!account) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Portfolio Available</CardTitle>
          <CardDescription>
            Your portfolio manager has not set up your investment account yet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            Please contact your portfolio manager for more information on your investment account.
          </p>
        </CardContent>
      </Card>
    );
  }

  const currency = account?.balance?.total?.currency || 'USD';
  const totalValue = account?.balance?.total?.amount || 0;
  const cashValue = account?.balance?.total?.amount || 0;
  const investedValue = (account.totalEquityValue || 0) - (account.cash || 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{account.name}</CardTitle>
        <CardDescription>
          {account.institution_name}
          {account.number && ` • Account #${account.number}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Value</p>
            <p className="text-2xl font-bold">
              {formatCurrency(totalValue, currency)} {currency}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Cash Balance</p>
              <p className="text-lg font-semibold">
                {formatCurrency(cashValue, currency)} {currency}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Invested</p>
              <p className="text-lg font-semibold">
                {formatCurrency(investedValue, account.currency || currency)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
