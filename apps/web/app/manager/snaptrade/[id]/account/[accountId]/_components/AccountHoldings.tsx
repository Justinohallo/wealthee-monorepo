import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { formatCurrency } from "@/lib/utils";

// Define interfaces for the holdings data based on SnapTrade API
interface SecurityType {
  id: string;
  code: string;
  description: string;
}

interface Currency {
  id: string;
  code: string;
  name: string;
}

interface UniversalSymbol {
  id: string;
  symbol: string;
  raw_symbol: string;
  description: string;
  currency: Currency;
  exchange?: {
    id: string;
    code: string;
    name: string;
  };
  type: SecurityType;
  figi_code?: string;
}

interface SymbolWrapper {
  symbol: UniversalSymbol;
  id: string;
  description: string;
  local_id?: string;
  is_quotable?: boolean;
  is_tradable?: boolean;
}

interface OptionSymbol {
  id: string;
  ticker: string;
  option_type: string;
  strike_price: number;
  expiration_date: string;
  is_mini_option: boolean;
  underlying_symbol: UniversalSymbol;
}

interface OptionSymbolWrapper {
  option_symbol: OptionSymbol;
  id: string;
  description: string;
}

interface Position {
  symbol: SymbolWrapper;
  units: number;
  price: number;
  open_pnl?: number;
  average_purchase_price?: number;
  fractional_units?: number;
}

interface OptionPosition {
  symbol: OptionSymbolWrapper;
  price: number;
  units: number;
  average_purchase_price: number;
  currency: Currency;
}

interface Order {
  brokerage_order_id: string;
  status: string;
  universal_symbol: UniversalSymbol;
  option_symbol?: OptionSymbol;
  action: string;
  total_quantity: number;
  open_quantity: number;
  canceled_quantity: number;
  filled_quantity: number;
  execution_price?: number;
  limit_price?: number;
  stop_price?: number;
  order_type: string;
  time_in_force: string;
  time_placed: string;
  time_updated?: string;
  time_executed?: string;
  expiry_date?: string;
  symbol: string;
}

interface AccountBalance {
  total: {
    amount: number;
    currency: string;
  };
}

interface AccountSyncStatus {
  holdings: {
    last_successful_sync: string;
    initial_sync_completed: boolean;
  };
  transactions: {
    last_successful_sync: string;
    first_transaction_date: string | null;
    initial_sync_completed: boolean;
  };
}

interface AccountMeta {
  type: string;
  status: string;
  institution_name: string;
}

interface Account {
  id: string;
  brokerage_authorization: string;
  name: string;
  number: string;
  institution_name: string;
  created_date: string;
  sync_status: AccountSyncStatus;
  balance: AccountBalance;
  meta: AccountMeta;
  portfolio_group: string;
  cash_restrictions: any[];
  raw_type: string;
}

interface Balance {
  currency: Currency;
  cash: number;
  buying_power: number;
}

interface TotalValue {
  value: number;
  currency: string;
}

interface AccountHoldingsResponse {
  account: Account;
  balances: Balance[];
  positions: Position[];
  option_positions: OptionPosition[];
  orders: Order[];
  total_value: TotalValue;
}

// Function to fetch account holdings
async function fetchAccountHoldings({
  idToken,
  userId,
  snapTradeUserId,
  accountId,
}: {
  idToken: string;
  userId: string;
  snapTradeUserId: string;
  accountId: string;
}): Promise<AccountHoldingsResponse | null> {
  try {
    const response = await fetch(
      `https://portfoliomanager-getsnaptradeuserholdings-zncz3ts4ka-uc.a.run.app
?userId=${userId}&snapTradeUserId=${snapTradeUserId}&accountId=${accountId}`,
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
    console.log(data)
    return data.holdings
  } catch (error) {
    console.error("Error fetching account holdings:", error);
    return null;
  }
}

// Format percentage for display
function formatPercentage(value: number | undefined): string {
  if (value === undefined) return 'N/A';
  return `${(value * 100).toFixed(2)}%`;
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

  if (!holdingsData || holdingsData.positions.length === 0) {
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
      {/* Cash Balances */}
      <div className="bg-white rounded-lg shadow overflow-hidden p-6">
        <h2 className="text-xl font-semibold mb-4">Cash Balances</h2>
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
              {holdingsData.balances.map((balance) => (
                <TableRow key={balance.currency.id}>
                  <TableCell className="font-medium">{balance.currency.code}</TableCell>
                  <TableCell className="text-right">{formatCurrency(balance.cash, balance.currency.code)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(balance.buying_power, balance.currency.code)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Stock Positions */}
      <div className="bg-white rounded-lg shadow overflow-hidden p-6">
        <h2 className="text-xl font-semibold mb-4">Stock Positions</h2>
        <div className="overflow-x-auto">
          {holdingsData.positions.length === 0 ? (
            <div className="p-4 bg-gray-50 rounded-md text-center">
              <p className="text-gray-700">No stock positions in this account.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Units</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Market Value</TableHead>
                  <TableHead className="text-right">Avg Purchase</TableHead>
                  <TableHead className="text-right">P/L</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {holdingsData.positions.map((position) => {
                  const currency = position.symbol.symbol.currency.code;
                  const marketValue = position.price * position.units;
                  const pnl = position.open_pnl;

                  return (
                    <TableRow key={`${position.symbol.id}-${position.units}`}>
                      <TableCell className="font-medium">{position.symbol.symbol.symbol}</TableCell>
                      <TableCell>{position.symbol.description}</TableCell>
                      <TableCell className="text-right">{position.units.toFixed(position.fractional_units ? 4 : 0)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(position.price, currency)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(marketValue, currency)}</TableCell>
                      <TableCell className="text-right">
                        {position.average_purchase_price
                          ? formatCurrency(position.average_purchase_price, currency)
                          : 'N/A'}
                      </TableCell>
                      <TableCell className={`text-right ${pnl && pnl > 0 ? 'text-green-600' : pnl && pnl < 0 ? 'text-red-600' : ''}`}>
                        {pnl !== undefined ? formatCurrency(pnl, currency) : 'N/A'}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Option Positions */}
      {holdingsData.option_positions.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden p-6">
          <h2 className="text-xl font-semibold mb-4">Option Positions</h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Option</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>Strike</TableHead>
                  <TableHead className="text-right">Units</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Avg Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {holdingsData.option_positions.map((position) => (
                  <TableRow key={`${position.symbol.id}-${position.units}`}>
                    <TableCell className="font-medium">{position.symbol.option_symbol.underlying_symbol.symbol}</TableCell>
                    <TableCell>{position.symbol.option_symbol.option_type}</TableCell>
                    <TableCell>{new Date(position.symbol.option_symbol.expiration_date).toLocaleDateString()}</TableCell>
                    <TableCell>{formatCurrency(position.symbol.option_symbol.strike_price, position.currency.code)}</TableCell>
                    <TableCell className="text-right">{position.units}</TableCell>
                    <TableCell className="text-right">{formatCurrency(position.price, position.currency.code)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(position.average_purchase_price, position.currency.code)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Recent Orders */}
      {holdingsData.orders.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Filled</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {holdingsData.orders.map((order) => (
                  <TableRow key={order.brokerage_order_id}>
                    <TableCell className="font-medium">{order.universal_symbol.symbol}</TableCell>
                    <TableCell>{order.order_type}</TableCell>
                    <TableCell>{order.action}</TableCell>
                    <TableCell className="text-right">{order.total_quantity}</TableCell>
                    <TableCell className="text-right">{order.filled_quantity}</TableCell>
                    <TableCell className="text-right">
                      {order.execution_price
                        ? formatCurrency(order.execution_price, order.universal_symbol.currency.code)
                        : 'N/A'}
                    </TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>{new Date(order.time_placed).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Account Summary */}
      <div className="bg-white rounded-lg shadow overflow-hidden p-6">
        <h2 className="text-xl font-semibold mb-4">Account Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-50 rounded-md">
            <h3 className="text-lg font-medium mb-2">Total Value</h3>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(holdingsData.total_value.value, holdingsData.total_value.currency)}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-md">
            <h3 className="text-lg font-medium mb-2">Holdings Breakdown</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Stocks:</span>
                <span>{holdingsData.positions.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Options:</span>
                <span>{holdingsData.option_positions.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Recent Orders:</span>
                <span>{holdingsData.orders.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountHoldings;
