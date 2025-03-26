import {
  getAccountBalancesService,
  getAccountDetailsService,
  getAccountHoldingsService,
  listUserAccounts as listSnapTradeUserAccounts
} from "../../services/snaptrade/accounts";

import { createHttpFunction } from "../../utils/function-wrapper";
import { getSnapTradeUser } from "../../services/snaptrade/users";
/**
 * SnapTrade account related Cloud Functions
 */
import { snaptradeSecrets } from "../../config/secrets";

/**
 * Gets account details for a specific SnapTrade account
 */
export const getAccountDetails = createHttpFunction({
  options:
  {
    requireAuth: true,
    requiredRole: "portfolioManager",
    secrets: snaptradeSecrets,
    requiredParams: {
      query: ["snapTradeUserId", "accountId"]
    }


  },
  handler: async ({ req, res }) => {
    // Get path parameters
    const { snapTradeUserId, accountId } = req.query;

    // // Get the SnapTrade user from the database
    const snapTradeUser = await getSnapTradeUser(snapTradeUserId as string, res);

    if (!snapTradeUser) {
      // Error response is handled by getSnapTradeUser if res is passed
      return;
    }

    // // Get account details using the service
    const accountDetails = await getAccountDetailsService({
      userId: snapTradeUserId as string,
      userSecret: snapTradeUser.userSecret,
      accountId: accountId as string
    }
    );

    // Return success response
    res.json({
      success: true,
      data: { accountDetails },
      timestamp: new Date().toISOString(),
    });
  },
});

/**
 * Lists all accounts for a specific SnapTrade user
 */
export const listUserAccounts = createHttpFunction({
  options: {
    requireAuth: true,
    requiredRole: "portfolioManager",
    secrets: snaptradeSecrets,
  },
  handler: async ({ req, res }) => {
    // Get query parameters
    const { snapTradeUserId } = req.query;

    // Get the SnapTrade user from the database
    const snapTradeUser = await getSnapTradeUser(snapTradeUserId as string, res);

    if (!snapTradeUser) {
      // Error response is handled by getSnapTradeUser if res is passed
      return;
    }

    // Get user accounts using the service
    const accounts = await listSnapTradeUserAccounts(
      snapTradeUserId as string,
      snapTradeUser.userSecret
    );

    // Return success response
    res.json({
      success: true,
      data: { accounts },
      timestamp: new Date().toISOString(),
    });
  },
});

/**
 * Gets account balances for a specific SnapTrade account
 */
export const getAccountBalances = createHttpFunction({
  options: {
    requireAuth: true,
    requiredRole: "portfolioManager",
    secrets: snaptradeSecrets,
    requiredParams: {
      query: ["snapTradeUserId", "accountId"]
    }
  },
  handler: async ({ req, res }) => {
    // Get query parameters
    const { snapTradeUserId, accountId } = req.query;

    // Get the SnapTrade user from the database
    const snapTradeUser = await getSnapTradeUser(snapTradeUserId as string, res);

    if (!snapTradeUser) {
      // Error response is handled by getSnapTradeUser if res is passed
      return;
    }

    // Get account balances using the service
    const balances = await getAccountBalancesService(
      snapTradeUserId as string,
      snapTradeUser.userSecret,
      accountId as string
    );

    // Return success response
    res.json({
      success: true,
      data: { balances },
      timestamp: new Date().toISOString(),
    });
  },
});

/**
 * Gets account holdings for a specific SnapTrade account
 */
export const getAccountHoldings = createHttpFunction({
  options: {
    requireAuth: true,
    requiredRole: "portfolioManager",
    secrets: snaptradeSecrets,
    requiredParams: {
      query: ["snapTradeUserId", "accountId"]
    }
  },
  handler: async ({ req, res }) => {
    // Get query parameters
    const { snapTradeUserId, accountId } = req.query;

    // Get the SnapTrade user from the database
    const snapTradeUser = await getSnapTradeUser(snapTradeUserId as string, res);

    if (!snapTradeUser) {
      // Error response is handled by getSnapTradeUser if res is passed
      return;
    }

    // Get account holdings using the service
    const holdings = await getAccountHoldingsService({
      userId: snapTradeUserId as string,
      userSecret: snapTradeUser.userSecret,
      accountId: accountId as string
    });

    // Return success response
    res.json({
      success: true,
      data: { holdings },
      timestamp: new Date().toISOString(),
    });
  },
});
