/**
 * SnapTrade Account Service
 *
 * Provides functions for interacting with SnapTrade accounts
 */

import { Account } from "snaptrade-typescript-sdk";
import { createSnapTradeClient } from "./client";
import { logger } from "../../utils/logger";

/**
 * Gets account details for a specific SnapTrade account
 *
 * @param userId - SnapTrade user ID
 * @param userSecret - SnapTrade user secret
 * @param accountId - SnapTrade account ID
 * @returns Account details
 */
export const getAccountDetailsService = async (
  { userId,
    userSecret,
    accountId,
  }: {
    userId: string,
    userSecret: string,
    accountId: string
  }
): Promise<Account> => {
  logger.info(`Getting account details for SnapTrade account ${accountId}`, "SnapTradeAccountService");

  // Create SnapTrade client
  const snaptrade = createSnapTradeClient();

  // Call SnapTrade API
  const response = await snaptrade.accountInformation.getUserAccountDetails({
    userId,
    userSecret,
    accountId
  });

  return response.data;
};

/**
 * Gets account balances for a specific SnapTrade account
 *
 * @param userId - SnapTrade user ID
 * @param userSecret - SnapTrade user secret
 * @param accountId - SnapTrade account ID
 * @returns Account balances
 */
export const getAccountBalancesService = async (
  userId: string,
  userSecret: string,
  accountId: string
) => {
  logger.info(`Getting account balances for SnapTrade account ${accountId}`, "SnapTradeAccountService");

  // Create SnapTrade client
  const snaptrade = createSnapTradeClient();

  // Call SnapTrade API
  const response = await snaptrade.accountInformation.getUserAccountBalance({
    userId,
    userSecret,
    accountId
  });

  return response.data;
};

/**
 * Gets holdings for a specific SnapTrade account
 *
 * @param userId - SnapTrade user ID
 * @param userSecret - SnapTrade user secret
 * @param accountId - SnapTrade account ID
 * @returns Account holdings
 */
export const getAccountHoldingsService = async (
  { userId,
    userSecret,
    accountId,
  }: {
    userId: string,
    userSecret: string,
    accountId: string
  }) => {
  logger.info(`Getting holdings for SnapTrade account ${accountId}`, "SnapTradeAccountService");

  // Create SnapTrade client
  const snaptrade = createSnapTradeClient();

  // Call SnapTrade API
  const response = await snaptrade.accountInformation.getUserHoldings({
    userId,
    userSecret,
    accountId
  });

  return response.data;
};

/**
 * Lists all accounts for a SnapTrade user
 *
 * @param userId - SnapTrade user ID
 * @param userSecret - SnapTrade user secret
 * @returns List of user accounts
 */
export const listUserAccounts = async (
  userId: string,
  userSecret: string
) => {
  logger.info(`Listing accounts for SnapTrade user ${userId}`, "SnapTradeAccountService");

  // Create SnapTrade client
  const snaptrade = createSnapTradeClient();

  // Call SnapTrade API
  const response = await snaptrade.accountInformation.listUserAccounts({
    userId,
    userSecret
  });

  return response.data;
};


/**
 * Gets positions for a specific SnapTrade account
 *
 * @param userId - SnapTrade user ID
 * @param userSecret - SnapTrade user secret
 * @param accountId - SnapTrade account ID
 * @returns Account positions
 */
export const getAccountPositionsService = async (
  { userId,
    userSecret,
    accountId,
  }: {
    userId: string,
    userSecret: string,
    accountId: string
  }) => {
  logger.info(`Getting positions for SnapTrade account ${accountId}`, "SnapTradeAccountService");

  // Create SnapTrade client
  const snaptrade = createSnapTradeClient();

  // Call SnapTrade API
  const response = await snaptrade.accountInformation.getUserAccountPositions({
    userId,
    userSecret,
    accountId
  });

  return response.data;
};

/**
 * Gets account orders for a specific SnapTrade account
 * @param userId - Firebase user ID
 * @param userSecret - SnapTrade user secret
 * @param accountId - SnapTrade account ID
 * @param state - Filter by order state (default: 'all')
 * @param days - Number of days to look back (default: 30)
 * @returns Promise with account orders data
 */
export async function getAccountOrdersService(
  {
    userId,
    userSecret,
    accountId,
    state = "all",
    days = 30
  }: {
    userId: string,
    userSecret: string,
    accountId: string,
    state: "all" | "open" | "executed",
    days: number
  }
) {
  logger.info(`Getting account orders for account ${accountId}`, "SnapTradeAccounts");

  const client = createSnapTradeClient();
  const response = await client.accountInformation.getUserAccountOrders({
    userId,
    userSecret,
    accountId,
    state,
    days
  });

  return response.data;
}

/**
 * Gets account activities for a specific SnapTrade account
 * @param params - Request parameters
 * @param params.userId - Firebase user ID
 * @param params.userSecret - SnapTrade user secret
 * @param params.accountId - SnapTrade account ID
 * @param params.startDate - Start date for activities (optional)
 * @param params.endDate - End date for activities (optional)
 * @returns Promise with account activities data
 */
export async function getAccountActivitiesService(
  {
    userId,
    userSecret,
    accountId,
    startDate,
    endDate
  }: {
    userId: string,
    userSecret: string,
    accountId: string,
    startDate?: string,
    endDate?: string
  }
) {
  logger.info(`Getting account activities for account ${accountId}`, "SnapTradeAccounts");

  const client = createSnapTradeClient();

  // Default to last 30 days if dates not provided
  let formattedStartDate = startDate;
  let formattedEndDate = endDate;

  if (!formattedStartDate) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    formattedStartDate = thirtyDaysAgo.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  }

  if (!formattedEndDate) {
    const today = new Date();
    formattedEndDate = today.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  }

  // Create request parameters
  const params = {
    userId,
    userSecret,
    accountId,
    startDate: formattedStartDate,
    endDate: formattedEndDate
  };

  const response = await client.accountInformation.getAccountActivities(params);

  return response.data;
}
