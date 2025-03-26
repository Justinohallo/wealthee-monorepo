import { AccountHolding, getAccountHoldings } from "@/services/snaptrade/accounts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { formatCurrency } from "@/lib/utils";

// Function to fetch account holdings
async function fetchAccountHoldings({
  idToken,
  userId,
  snapTradeUserId,
  accountId
}: {
  idToken: string;
  userId: string;
  snapTradeUserId: string;
  accountId: string;
}): Promise<{ holdings: AccountHolding[], totalMarketValue: number } | null> {
  try {
    const response = await getAccountHoldings(userId, snapTradeUserId, accountId, idToken);
    return response;
  } catch (error) {
    console.error("Error fetching account holdings:", error);
    return null;
  }
}

export const AccountHoldings = async ({
  idToken,
  userId,
  snapTradeUserId,
  accountId,
}: {
  idToken: string;
  userId: string;
  snapTradeUserId: string;
  accountId: string;
}) => {
  const holdingsData = await fetchAccountHoldings({
    idToken,
    userId,
    snapTradeUserId,
    accountId,
  });

  if (!holdingsData || holdingsData.holdings.length === 0) {
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
          {holdingsData.holdings.length === 0 ? (
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
                  <TableHead className="text-right">Currency</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {holdingsData.holdings.map((holding) => {
                  return (
                    <TableRow key={`${holding.id}-${holding.quantity}`}>
                      <TableCell className="font-medium">{holding.symbol}</TableCell>
                      <TableCell className="text-right">{holding.quantity.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(holding.marketValue, holding.currency)}</TableCell>
                      <TableCell className="text-right">
                        {holding.averagePrice
                          ? formatCurrency(holding.averagePrice, holding.currency)
                          : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">{holding.currency}</TableCell>
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
              {formatCurrency(holdingsData.totalMarketValue, "USD")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountHoldings;
