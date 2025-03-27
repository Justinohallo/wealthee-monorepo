/**
 * SnapTrade Account Service
 *
 * Provides functions for interacting with SnapTrade accounts
 */

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
) => {
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
 *
 * @param userId - SnapTrade user ID
 * @param userSecret - SnapTrade user secret
 * @param accountId - SnapTrade account ID
 * @param state - Filter orders by state: 'all', 'open', or 'executed'
 * @param days - Number of days in the past to fetch orders (default: 30)
 * @returns Account orders
 */
export const getAccountOrdersService = async (
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
    state?: "all" | "open" | "executed",
    days?: number
  }) => {
  logger.info(`Getting orders for SnapTrade account ${accountId}`, "SnapTradeAccountService");

  // Create SnapTrade client
  const snaptrade = createSnapTradeClient();

  // Call SnapTrade API
  const response = await snaptrade.accountInformation.getUserAccountOrders({
    userId,
    userSecret,
    accountId,
    state,
    days
  });

  return response.data;
};
