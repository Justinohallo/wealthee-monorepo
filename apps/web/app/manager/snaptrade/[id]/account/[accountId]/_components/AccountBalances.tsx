import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Suspense } from "react";
import { formatCurrency } from "@/lib/utils";
import { getAccountBalances } from "@/services/snaptrade/accounts";

interface AccountBalancesProps {
  idToken: string;
  userId: string;
  snapTradeUserId: string;
  accountId: string;
}

async function AccountBalancesContent({ idToken, userId, snapTradeUserId, accountId }: AccountBalancesProps) {

  const response = await getAccountBalances({ userId, snapTradeUserId, accountId, idToken });



  if (!response) {
    return (
      <div className="p-4 bg-gray-50 rounded-md text-center">
        <p className="text-gray-700">
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
                {balance.currency}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(balance.value, balance.currency)}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(balance.value, balance.currency)}
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
    <div className="bg-white rounded-lg shadow overflow-hidden p-6">
      <h2 className="text-xl font-semibold mb-4">Cash Balances</h2>
      <Suspense fallback={<div>Loading balances...</div>}>
        <AccountBalancesContent {...props} />
      </Suspense>
    </div>
  );
}
