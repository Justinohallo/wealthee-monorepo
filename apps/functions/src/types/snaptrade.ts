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
  brokerageId: string;
  brokerageName: string;
  authorizationId: string;
  createdAt: string;
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
