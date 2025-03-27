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
