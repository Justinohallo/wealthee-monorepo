/**
 * SnapTrade Types
 *
 * Centralized type definitions for SnapTrade integration
 * Acts as a buffer between our app and the SDK to allow for easier updates
 */

// Import types from models
import {
  Account,
  AccountHoldingsAccount,
} from "snaptrade-typescript-sdk/dist/models";
// Import SDK types
import {
  AccountHoldings,
  AccountInformationApi,
  AccountSimple,
  AccountSyncStatus,
  AccountUniversalActivity,
  Balance,
  BrokerageAuthorization,
  BrokerageType,
  Currency,
  Exchange,
  OptionsPosition,
  OptionsSymbol,
  PaginatedUniversalActivity,
  Position,
  SecurityType,
  UniversalActivity,
  UniversalSymbol,
} from "snaptrade-typescript-sdk";

// Re-export types using 'export type' for proper module compatibility
export type {
  Account,
  AccountHoldingsAccount,
  AccountSimple,
  AccountHoldings,
  AccountSyncStatus,
  AccountUniversalActivity,
  Balance,
  BrokerageAuthorization,
  BrokerageType,
  Currency,
  Exchange,
  OptionsPosition,
  OptionsSymbol,
  PaginatedUniversalActivity,
  Position,
  SecurityType,
  UniversalActivity,
  UniversalSymbol,
};

// For backward compatibility with existing code
export type OptionPosition = OptionsPosition;
export type OptionSymbol = OptionsSymbol;

// Define our own Order type since it's not directly available from the SDK
export interface Order {
  brokerage_order_id: string;
  status: string;
  universal_symbol?: UniversalSymbol;
  symbol: string;
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
}

// Response types - these can remain as custom interfaces
export interface SnapTradeLoginResponse {
  loginResponse: {
    redirectURI: string;
  };
}

export interface SnapTradeAccountsResponse {
  accounts: Account[];
}

export interface SnapTradeAccountDetailsResponse {
  accountDetails: Account;
}

export interface SnapTradeAccountBalancesResponse {
  balances: Balance[];
}

export interface SnapTradeUsersResponse {
  snapTradeUsers: {
    id: string;
    displayName: string;
    createdAt: number;
  }[];
}

export interface SnapTradeBrokerageAuthorizationsResponse {
  brokerageAuthorizations: BrokerageAuthorization[];
}

export interface TotalValue {
  value: number;
  currency: string;
}

export interface AccountHoldingsResponse {
  account: Account;
  balances: Balance[];
  positions: Position[];
  option_positions: OptionsPosition[];
  orders: Order[];
  total_value: TotalValue;
}

// For activities we'll maintain our own type since we need customizations
export interface Activity {
  id: string;
  account_id: string;
  date: string;
  type: string;
  description: string;
  symbol?: string;
  currency: string;
  amount: number;
  fee?: number;
  institution_id?: string;
}
