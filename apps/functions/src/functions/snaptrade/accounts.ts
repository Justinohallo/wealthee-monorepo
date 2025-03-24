import {
  getAccountDetails as getSnapTradeAccountDetails,
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
  },
  handler: async ({ req, res }) => {
    // Get path parameters
    const { snapTradeUserId, accountId } = req.params;

    // Get the SnapTrade user from the database
    const snapTradeUser = await getSnapTradeUser(snapTradeUserId, res);

    if (!snapTradeUser) {
      // Error response is handled by getSnapTradeUser if res is passed
      return;
    }

    // Get account details using the service
    const accountDetails = await getSnapTradeAccountDetails(
      snapTradeUserId,
      snapTradeUser.userSecret,
      accountId
    );

    // Return success response
    res.json({
      success: true,
      data: accountDetails,
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
      data: accounts,
      timestamp: new Date().toISOString(),
    });
  },
});
