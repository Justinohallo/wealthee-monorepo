import { AccountBalance, AccountDetails } from "../../types/snaptrade";
// Import the SDK types to use them directly
import { AccountHoldings, Position } from "snaptrade-typescript-sdk";

/**
 * SnapTrade account operations service
 */
import { createSnapTradeClient } from "./client";
import { logger } from "../../utils/logger";

// Define more specific types to replace 'any'
// interface Position {
//   id: string;
//   symbol: string;
//   quantity: number;
//   price: number;
//   [key: string]: unknown;
// }

// interface Holding {
//   id: string;
//   symbol: string;
//   quantity: number;
//   value: number;
//   [key: string]: unknown;
// }

/**
 * Service for SnapTrade account operations
 */
export const snapTradeAccountService = {
  /**
       * Get details for a specific account
       *
       * @param userId - SnapTrade user ID
       * @param userSecret - SnapTrade user secret
       * @param accountId - SnapTrade account ID
       * @return Account details
       */
  async getAccountDetails(
    userId: string,
    userSecret: string,
    accountId: string
  ): Promise<AccountDetails | null> {
    try {
      const client = createSnapTradeClient();
      const response = await client.accountInformation.getUserAccountDetails({
        userId,
        userSecret,
        accountId,
      });

      // Transform the API response to match our AccountDetails type
      const account = response.data;
      const accountDetails: AccountDetails = {
        id: account.id,
        name: account.name || "",
        number: account.number || "",
        createdAt: account.createdDate || new Date().toISOString(),
        brokerageId: account.brokerage?.id || "",
        brokerageName: account.brokerage?.name || "",
      };

      return accountDetails;
    } catch (error) {
      logger.error(
        `Failed to get account details: ${error instanceof Error ? error.message : String(error)}`,
        "SnapTradeAccountService",
        error
      );
      throw error;
    }
  },

  /**
       * Get balance for a specific account
       *
       * @param userId - SnapTrade user ID
       * @param userSecret - SnapTrade user secret
       * @param accountId - SnapTrade account ID
       * @return Account balance
       */
  async getAccountBalance(
    userId: string,
    userSecret: string,
    accountId: string
  ): Promise<AccountBalance | null> {
    try {
      const client = createSnapTradeClient();
      const response = await client.accountInformation.getUserAccountBalance({
        userId,
        userSecret,
        accountId,
      });

      // Transform the API response to match our AccountBalance type
      const balances = response.data;
      // Assuming the first balance is the main one, or default to empty values
      const firstBalance = Array.isArray(balances) && balances.length > 0 ? balances[0] : null;

      const accountBalance: AccountBalance = {
        cash: firstBalance?.cash || 0,
        marketValue: firstBalance?.marketValue || 0,
        totalValue: firstBalance?.totalValue || 0,
        currency: String(firstBalance?.currency || "USD"),
      };

      return accountBalance;
    } catch (error) {
      logger.error(
        `Failed to get account balance: ${error instanceof Error ? error.message : String(error)}`,
        "SnapTradeAccountService",
        error
      );
      throw error;
    }
  },

  /**
       * Get all positions for a specific account
       *
       * @param userId - SnapTrade user ID
       * @param userSecret - SnapTrade user secret
       * @param accountId - SnapTrade account ID
       * @return Account positions
       */
  async getAccountPositions(
    userId: string,
    userSecret: string,
    accountId: string
  ): Promise<Position[]> {
    try {
      const client = createSnapTradeClient();
      const response = await client.accountInformation.getUserAccountPositions({
        userId,
        userSecret,
        accountId,
      });

      // Ensure the response is an array
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      logger.error(
        `Failed to get account positions: ${error instanceof Error ? error.message : String(error)}`,
        "SnapTradeAccountService",
        error
      );
      throw error;
    }
  },

  /**
       * Get all holdings for a specific account
       *
       * @param userId - SnapTrade user ID
       * @param userSecret - SnapTrade user secret
       * @param accountId - SnapTrade account ID
       * @return Account holdings
       */
  async getAccountHoldings(
    userId: string,
    userSecret: string,
    accountId: string
  ): Promise<AccountHoldings[]> {
    try {
      const client = createSnapTradeClient();
      const response = await client.accountInformation.getUserHoldings({
        userId,
        userSecret,
        accountId,
      });

      // Ensure the response is an array
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      logger.error(
        `Failed to get account holdings: ${error instanceof Error ? error.message : String(error)}`,
        "SnapTradeAccountService",
        error
      );
      throw error;
    }
  },
};
