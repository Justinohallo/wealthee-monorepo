import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { AccountBalancesSkeleton } from "./AccountSkeletons";
import { AccountErrorBoundary } from "./AccountErrorBoundary";
import { Suspense } from "react";
import { formatCurrency } from "@/lib/format-currency";
import { getAccountBalances } from "@/services/snaptrade/accounts";

interface AccountBalancesProps {
  idToken: string;
  portfolioManagerId: string;
  snapTradeUserId: string;
  accountId: string;
}

async function AccountBalancesContent({ idToken, portfolioManagerId, snapTradeUserId, accountId }: AccountBalancesProps) {

  const response = await getAccountBalances({ portfolioManagerId, snapTradeUserId, accountId, idToken });

  if (!response) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <p className="text-gray-600">
          No balance information available for this account.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Currency</TableHead>
            <TableHead className="text-right">Cash</TableHead>
            <TableHead className="text-right">Buying Power</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {response.map((balance) => (
            <TableRow key={balance.id}>
              <TableCell className="font-medium">
                {balance.currency?.name}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(balance.cash || 0, balance.currency?.code || 'CAD')}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(balance.buying_power || 0, balance.currency?.code || 'CAD')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function AccountBalances(props: AccountBalancesProps) {
  return (
    <AccountErrorBoundary title="Balance Data Error">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 h-full">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Cash Balances</h2>
          <Suspense fallback={<AccountBalancesSkeleton />}>
            <AccountBalancesContent {...props} />
          </Suspense>
        </div>
      </div>
    </AccountErrorBoundary>
  );
}
