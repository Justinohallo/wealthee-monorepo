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
export const getAccountDetails = async (
  userId: string,
  userSecret: string,
  accountId: string
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
export const getAccountBalances = async (
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
export const getAccountHoldings = async (
  userId: string,
  userSecret: string,
  accountId: string
) => {
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
