/**
 * SnapTrade Types
 *
 * Comprehensive type definitions for SnapTrade integration
 */

// Common Interfaces
export interface Currency {
  id: string;
  code: string;
  name: string;
}

export interface AccountBalance {
  total: {
    amount: number;
    currency: string;
  };
}

export interface AccountSyncStatus {
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

export interface AccountMeta {
  type: string;
  status: "open" | "closed";
  institution_name: string;
  unifiedAccountType: string;
  linked_account_id?: string;
}

// Brokerage related types
export interface BrokerageType {
  id: string;
  name: string;
  display_name: string;
  description: string;
  aws_s3_logo_url: string;
  slug: string;
}

export interface SnapTradeBrokerageAuthorization {
  id: string;
  created_date: string;
  updated_date: string;
  name: string;
  type: string;
  disabled: boolean;
  brokerage: BrokerageType;
}

// Account related types
export interface SnapTradeAccount {
  id: string;
  brokerage_authorization: string;
  portfolio_group: string;
  name: string;
  number: string;
  institution_name: string;
  meta: AccountMeta;
  cash_restrictions: unknown[];
  created_date: string;
  sync_status: AccountSyncStatus;
  balance: AccountBalance;
  raw_data: unknown;
  raw_type: string;
}

// User types
export interface SnapTradeUser {
  id: string;
  displayName: string;
  createdAt: number;
}

// Balance related types
export interface Balance {
  currency: Currency;
  cash: number;
  buying_power: number;
}

// Response types
export interface SnapTradeAccountsResponse {
  accounts: SnapTradeAccount[];
}

export interface SnapTradeLoginResponse {
  loginResponse: {
    redirectURI: string;
  };
}

export interface SnapTradeAccountDetailsResponse {
  accountDetails: SnapTradeAccount;
}

export interface SnapTradeAccountBalancesResponse {
  balances: Balance[];
}

export interface SnapTradeUsersResponse {
  snapTradeUsers: SnapTradeUser[];
}

export interface SnapTradeBrokerageAuthorizationsResponse {
  brokerageAuthorizations: SnapTradeBrokerageAuthorization[];
}

// Holdings related types
export interface TotalValue {
  value: number;
  currency: string;
}

export interface SecurityType {
  id: string;
  code: string;
  description: string;
}

export interface UniversalSymbol {
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

export interface SymbolWrapper {
  symbol: UniversalSymbol;
  id: string;
  description: string;
  local_id?: string;
  is_quotable?: boolean;
  is_tradable?: boolean;
}

export interface Position {
  symbol: SymbolWrapper;
  units: number;
  price: number;
  open_pnl?: number;
  average_purchase_price?: number;
  fractional_units?: number;
}

export interface OptionSymbol {
  id: string;
  ticker: string;
  option_type: string;
  strike_price: number;
  expiration_date: string;
  is_mini_option: boolean;
  underlying_symbol: UniversalSymbol;
}

export interface OptionSymbolWrapper {
  option_symbol: OptionSymbol;
  id: string;
  description: string;
}

export interface OptionPosition {
  symbol: OptionSymbolWrapper;
  price: number;
  units: number;
  average_purchase_price: number;
  currency: Currency;
}

export interface Order {
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

export interface AccountHoldingsResponse {
  account: SnapTradeAccount;
  balances: Balance[];
  positions: Position[];
  option_positions: OptionPosition[];
  orders: Order[];
  total_value: TotalValue;
}
