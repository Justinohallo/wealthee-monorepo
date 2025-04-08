/**
 * SnapTrade Types
 *
 * Centralized type definitions for SnapTrade integration
 * Acts as a buffer between our app and the SDK to allow for easier updates
 */

// Import types from models
import {
  type Account,
  type AccountHoldings,
  type AccountHoldingsAccount,
  type AccountSimple,
  type AccountSyncStatus,
  type AccountUniversalActivity,
  type Balance,
  type BrokerageAuthorization,
  type BrokerageType,
  type Currency,
  type Exchange,
  type OptionsPosition,
  type OptionsSymbol,
  type PaginatedUniversalActivity,
  type Position,
  type SecurityType,
  type UniversalActivity,
  type UniversalSymbol,
} from "snaptrade-typescript-sdk/dist/models";
// Import SDK types

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



