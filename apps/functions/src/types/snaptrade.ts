/**
 * SnapTrade related type definitions
 */

/**
 * SnapTrade user data for API interaction
 */
export interface SnapTradeUserDTO {
  userId: string;
  userSecret: string;
  createdAt: string;
  accounts?: Record<string, SnapTradeAccountDTO>;
}

/**
 * SnapTrade account data for API interaction
 */
export interface SnapTradeAccountDTO {
  id: string;
  brokerageId: string;
  name: string;
  createdAt: string;
}

/**
 * SnapTrade brokerage connection data for API interaction
 */
export interface BrokerageConnectionDTO {
  id: string;
  created_date: string;
  brokerage: {
    id: string;
    slug: string;
    name: string;
    display_name: string;
    description: string;
    aws_s3_logo_url: string;
    aws_s3_square_logo_url: string;
    url: string;
    enabled: boolean;
    maintenance_mode: boolean;
    allows_trading: boolean;
    allows_fractional_units: boolean;
    has_reporting: boolean;
    is_real_time_connection: boolean;
    brokerage_type: {
      id: string;
      name: string;
    };
    exchanges: string[];
    open_url: string;
  };
  name: string;
  type: string;
  disabled: boolean;
  disabled_date?: string;
  meta?: {
    identifier: number;
  };
  updated_date: string;
}

/**
 * SnapTrade account details from API
 */
export interface AccountDetails {
  id: string;
  name: string;
  number: string;
  createdAt: string;
  brokerageId: string;
  brokerageName: string;
  balance?: AccountBalance;
}

/**
 * SnapTrade account balance from API
 */
export interface AccountBalance {
  cash: number;
  marketValue: number;
  totalValue: number;
  currency: string;
}
