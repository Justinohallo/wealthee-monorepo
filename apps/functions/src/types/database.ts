/**
 * Database schema type definitions
 */

/**
 * Portfolio manager data in the database
 */
export interface PortfolioManager {
  uid: string;
  email: string;
  displayName?: string;
  createdAt: string;
  snapTrade?: {
    userId: string;
    userSecret: string;
    linkedAccounts?: Record<string, SnapTradeLinkedAccount>;
  };
  snapTradeUsers?: Record<string, SnapTradeUser>;
  clients?: Record<string, Client>;
}

/**
 * Client data in the database
 */
export interface Client {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  portfolioManagerId: string;
  createdAt: string;
}

/**
 * SnapTrade user data in the database
 */
export interface SnapTradeUser {
  userSecret: string;
  createdAt: string;
  brokerageConnections?: Record<string, BrokerageConnection>;
  accounts?: Record<string, SnapTradeAccount>;
}

/**
 * SnapTrade account data in the database
 */
export interface SnapTradeAccount {
  id: string;
  name: string;
  number: string;
  brokerageId: string;
  brokerageName: string;
  brokerageConnectionId: string;
  createdAt: string;
}

/**
 * Brokerage connection data in the database
 */
export interface BrokerageConnection {
  id: string;
  authorizationId: string;
  brokerageId: string;
  brokerageName: string;
  createdAt: string;
}

/**
 * SnapTrade linked account data in the database
 */
export interface SnapTradeLinkedAccount {
  id: string;
  brokerageId: string;
  brokerageName: string;
  createdAt: string;
}
