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

interface Currency {
  id: string;
  code: string;
  name: string;
}

interface Balance {
  currency: Currency;
  cash: number;
  buying_power: number;
}

interface AccountBalancesResponse {
  balances: Balance[];
}

async function fetchAccountBalances({
  idToken,
  userId,
  snapTradeUserId,
  accountId,
}: {
  idToken: string;
  userId: string;
  snapTradeUserId: string;
  accountId: string;
}): Promise<AccountBalancesResponse | null> {
  try {
    const response = await fetch(
      `https://portfoliomanager-getsnaptradeuseraccountbalances-zncz3ts4ka-uc.a.run.app?userId=${userId}&snapTradeUserId=${snapTradeUserId}&accountId=${accountId}`,
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    );

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching account balances:", error);
    return null;
  }
}

interface AccountBalancesProps {
  idToken: string;
  userId: string;
  snapTradeUserId: string;
  accountId: string;
}

async function AccountBalancesContent({ idToken, userId, snapTradeUserId, accountId }: AccountBalancesProps) {
  const balancesData = await fetchAccountBalances({
    idToken,
    userId,
    snapTradeUserId,
    accountId,
  });

  if (!balancesData || !balancesData.balances.length) {
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
          {balancesData.balances.map((balance) => (
            <TableRow key={balance.currency.id}>
              <TableCell className="font-medium">
                {balance.currency.code}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(balance.cash, balance.currency.code)}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(balance.buying_power, balance.currency.code)}
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
