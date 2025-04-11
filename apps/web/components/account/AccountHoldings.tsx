import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { AccountErrorBoundary } from "./AccountErrorBoundary";
import { AccountHoldingsSkeleton } from "./AccountSkeletons";
import { Suspense } from "react";
import { formatCurrency } from "@/lib/format-currency";
import { getAccountHoldings } from "@/services/snaptrade/accounts";

interface AccountHoldingsProps {
  idToken: string;
  portfolioManagerId: string;
  snapTradeUserId: string;
  accountId: string;
}

async function AccountHoldingsContent({
  idToken,
  portfolioManagerId,
  snapTradeUserId,
  accountId,
}: AccountHoldingsProps) {
  const response = await getAccountHoldings({ portfolioManagerId, snapTradeUserId, accountId, idToken });

  if (!response) {
    return (
      <div className="bg-yellow-50 rounded-lg p-6 text-center">
        <p className="text-yellow-700">
          No holdings found for this account. The account may be new or not yet synced.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stock Positions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Stock Positions</h3>
        <div className="overflow-x-auto">
          {response.positions?.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-gray-600">No stock positions in this account.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Market Value</TableHead>
                  <TableHead className="text-right">Avg Purchase</TableHead>
                  <TableHead className="text-right">Book Value</TableHead>
                  <TableHead className="text-right">Currency</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {response.positions?.map((holding) => {
                  return (
                    <TableRow key={`${holding.symbol?.symbol?.symbol}-${holding.units}`}>
                      <TableCell className="font-medium">{holding?.symbol?.symbol?.symbol}</TableCell>
                      <TableCell className="text-right">{holding.units?.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        {holding.price
                          ? formatCurrency(holding?.price || 0, holding.currency.code)
                          : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(holding?.average_purchase_price ?? 0, holding.currency.code)}</TableCell>
                      <TableCell className="text-right">{formatCurrency((holding?.average_purchase_price ?? 0) * (holding?.units ?? 0), holding.currency.code)}</TableCell>
                      <TableCell className="text-right">{holding.currency.code}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

    </div>
  );
}

export function AccountHoldings(props: AccountHoldingsProps) {
  return (
    <AccountErrorBoundary title="Holdings Data Error">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 h-full">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Holdings</h2>
          <Suspense fallback={<AccountHoldingsSkeleton />}>
            <AccountHoldingsContent {...props} />
          </Suspense>
        </div>
      </div>
    </AccountErrorBoundary>
  );
}

export default AccountHoldings;
