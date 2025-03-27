import {
  // getAccountActivitiesService,
  getAccountBalancesService,
  getAccountDetailsService,
  getAccountHoldingsService,
  getAccountOrdersService,
  getAccountPositionsService,
  listUserAccounts as listSnapTradeUserAccounts
} from "../../services/snaptrade/accounts";

import { ValidationError } from "../../utils/error-handling";
import { createHttpFunction } from "../../utils/function-wrapper";
import { getSnapTradeUser } from "../../services/snaptrade/users";
import { logger } from "../../utils/logger";
/**
 * SnapTrade account related Cloud Functions
 */
import { snaptradeSecrets } from "../../config/secrets";

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
 * Returns account holdings for a specific SnapTrade account.

The data returned here is always cached and refreshed once a day.
If you need real-time data, please use the manual refresh endpoint.
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


/**
 * Returns account detail known to SnapTrade for the specified account.

The data returned here is always cached and refreshed once a day.
If you need real-time data, please use the manual refresh endpoint.
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
 * Returns a list of balances for the account.
 * Each element of the list has a distinct currency.
 * Some brokerages like Questrade allows holding multiple currencies in the same account.

The data returned here is cached. How long the data is cached for varies by brokerage.
Check the brokerage integrations doc and look for "Cache Expiry Time" to see the exact value for a specific brokerage.
If you need real-time data, please use the manual refresh endpoint.
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
 * Returns a list of positions for the account.
 *
 *
 *
 */
export const getAccountPositions = createHttpFunction({
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

    // Get account positions using the service
    const positions = await getAccountPositionsService({
      userId: snapTradeUserId as string,
      userSecret: snapTradeUser.userSecret,
      accountId: accountId as string
    });

    // Return success response
    res.json({
      success: true,
      data: { positions },
      timestamp: new Date().toISOString(),
    });
  },
});

/**
 * Returns account orders for a specific SnapTrade account.
 *
 * The data returned here is cached and includes orders from the past 30 days by default.
 * The state parameter can be used to filter orders: 'all', 'open', or 'executed'.
 */
export const getAccountOrders = createHttpFunction({
  options: {
    requireAuth: true,
    requiredRole: "portfolioManager",
    secrets: snaptradeSecrets,
    requiredParams: {
      query: ["snapTradeUserId", "accountId"]
    }
  },
  handler: async ({ req, res }) => {
    logger.info("Getting account orders", "SnapTradeAccounts");

    // Get query parameters
    const { snapTradeUserId, accountId, state, days } = req.query;

    if (!snapTradeUserId || !accountId) {
      throw new ValidationError("Required parameters missing: snapTradeUserId, accountId");
    }

    // Get the SnapTrade user from the database
    const snapTradeUser = await getSnapTradeUser(snapTradeUserId as string, res);

    if (!snapTradeUser) {
      // Error response is handled by getSnapTradeUser if res is passed
      return;
    }

    // Get account orders using the service
    const ordersData = await getAccountOrdersService({
      userId: snapTradeUserId as string,
      userSecret: snapTradeUser.userSecret,
      accountId: accountId as string,
      state: state as "all" | "open" | "executed",
      days: days ? parseInt(days as string, 10) : 30
    });

    // Return success response
    res.json({
      success: true,
      data: {
        orders: ordersData || []
      },
      timestamp: new Date().toISOString(),
    });
  },
});

/**
 * Gets account activities for a specific SnapTrade account
 *
 * This function retrieves activities (transactions, dividends, etc.) for a SnapTrade account.
 * Results are cached for 10 minutes to improve performance. Date ranges can be specified with
 * startDate and endDate parameters (YYYY-MM-DD format). If not provided, defaults to last 30 days.
 */
// export const getAccountActivitiesV2 = createHttpFunction({
//   options: {
//     requireAuth: true,
//     requiredRole: "portfolioManager",
//     secrets: snaptradeSecrets,
//     requiredParams: {
//       query: ["snapTradeUserId", "accountId"],
//     }
//   },
//   handler: async ({ req, res }) => {
//     logger.info("Getting account activities", "SnapTradeAccounts");

//     // Get query parameters
//     const { snapTradeUserId, accountId, startDate, endDate } = req.query;

//     if (!snapTradeUserId || !accountId) {
//       throw new ValidationError("Required parameters missing: snapTradeUserId, accountId");
//     }

//     // Get the SnapTrade user from the database
//     const snapTradeUser = await getSnapTradeUser(snapTradeUserId as string, res);

//     if (!snapTradeUser) {
//       // Error response is handled by getSnapTradeUser if res is passed
//       return;
//     }

//     // Get account activities
//     const activitiesData = await getAccountActivitiesService({
//       userId: snapTradeUserId as string,
//       userSecret: snapTradeUser.userSecret,
//       accountId: accountId as string,
//       startDate: startDate as string | undefined,
//       endDate: endDate as string | undefined
//     });

//     // Return success response
//     res.json({
//       success: true,
//       data: {
//         activities: activitiesData || []
//       },
//       timestamp: new Date().toISOString(),
//     });
//   },
// });
