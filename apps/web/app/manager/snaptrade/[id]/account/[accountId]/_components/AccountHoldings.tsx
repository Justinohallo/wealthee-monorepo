import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { formatCurrency } from "@/lib/format-currency";
import { getAccountHoldings } from "@/services/snaptrade/accounts";

export const AccountHoldings = async ({
  idToken,
  portfolioManagerId,
  snapTradeUserId,
  accountId,
}: {
  idToken: string;
  portfolioManagerId: string;
  snapTradeUserId: string;
  accountId: string;
}) => {
  const response = await getAccountHoldings({ portfolioManagerId, snapTradeUserId, accountId, idToken });

  if (!response) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden p-6">
        <h2 className="text-xl font-semibold mb-4">Holdings</h2>
        <div className="p-4 bg-yellow-50 rounded-md text-center">
          <p className="text-yellow-700">
            No holdings found for this account. The account may be new or not yet synced.
          </p>
        </div>
      </div>
    );

  }
  return (
    <div className="space-y-6">
      {/* Stock Positions */}
      <div className="bg-white rounded-lg shadow overflow-hidden p-6">
        <h2 className="text-xl font-semibold mb-4">Stock Positions</h2>
        <div className="overflow-x-auto">
          {response.positions?.length === 0 ? (
            <div className="p-4 bg-gray-50 rounded-md text-center">
              <p className="text-gray-700">No stock positions in this account.</p>
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

      {/* Account Summary */}
      <div className="bg-white rounded-lg shadow overflow-hidden p-6">
        <h2 className="text-xl font-semibold mb-4">Account Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-50 rounded-md">
            <h3 className="text-lg font-medium mb-2">Total Market Value</h3>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(response.total_value?.value ?? 0, "USD")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountHoldings;
