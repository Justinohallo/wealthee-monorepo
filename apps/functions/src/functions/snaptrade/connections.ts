import {
  deleteBrokerageConnectionService,
  detailBrokerageAuthorizationService,
  listBrokerageConnectionsService,
} from "../../services/snaptrade/connections";
import { generateSnapTradeConnectionUrl, getSnapTradeUser } from "../../services/snaptrade/users";

import { createHttpFunction } from "../../utils/function-wrapper";
import { logger } from "../../utils/logger";
/**
 * SnapTrade brokerage connection related Cloud Functions
 */
import { snaptradeSecrets } from "../../config";

/**
 * Authenticates a SnapTrade user and returns the Connection Portal URL used for connecting brokerage accounts.
 */
export const getUrl = createHttpFunction({
  handler: async ({ req, res }) => {
    const { snapTradeUserId, broker, redirectUri } = req.query;

    logger.info(`Request received to generate connection URL for SnapTrade user: ${snapTradeUserId}`, "SnapTradeUsers");

    // Call service to generate connection URL
    const data = await generateSnapTradeConnectionUrl(snapTradeUserId as string, {
      broker: broker as string | undefined,
      redirectUri: redirectUri as string | undefined
    });
    // Return success response
    res.json({
      success: true,
      data: { url: data },
      timestamp: new Date().toISOString(),
    });
  },
  options: {
    requireAuth: true,
    requiredRole: "portfolioManager",
    requiredParams: {
      query: ["snapTradeUserId"]
    },
    secrets: snaptradeSecrets
  }
});

/**
 * List all brokerage connections for a SnapTrade user
 */
export const list = createHttpFunction({
  options: {
    requireAuth: true,
    requiredRole: "portfolioManager",
    requiredParams: {
      query: ["snapTradeUserId"]
    },
    secrets: snaptradeSecrets
  },
  handler: async ({ req, res }) => {
    // Check for required path parameter
    const { snapTradeUserId } = req.query;
    // Get the user from the database
    // This would pull from Firestore in a real implementation
    logger.info(`Listing brokerage connections for user ${snapTradeUserId}`,
      "SnapTradeConnectionFunction");

    // Get SnapTrade user details
    const snapTradeUser = await getSnapTradeUser(snapTradeUserId as string, res);

    if (!snapTradeUser) {
      // Error response is handled by getSnapTradeUser if res is passed
      return;
    }
    // Get all brokerage connections for the user
    const connections = await listBrokerageConnectionsService(
      snapTradeUserId as string,
      snapTradeUser.userSecret
    );
    res.json({
      success: true,
      data: { connections },
      timestamp: new Date().toISOString(),
    });
  },

});

/**
 * Get details for a specific brokerage authorization
 */
export const get = createHttpFunction({
  options: {
    requireAuth: true,
    requiredRole: "portfolioManager",
    requiredParams: {
      query: ["snapTradeUserId", "authorizationId"]
    },
    secrets: snaptradeSecrets
  },
  handler: async ({ req, res }) => {
    // Check for required query parameters
    const { snapTradeUserId, authorizationId } = req.query;

    logger.info(`Fetching brokerage details for authorization ${authorizationId} and user ${snapTradeUserId}`,
      "SnapTradeConnectionFunction");

    // Get SnapTrade user details
    const snapTradeUser = await getSnapTradeUser(snapTradeUserId as string, res);

    if (!snapTradeUser) {
      // Error response is handled by getSnapTradeUser if res is passed
      return;
    }

    // Get brokerage authorization details
    const brokerageAuthorization = await detailBrokerageAuthorizationService(
      snapTradeUserId as string,
      snapTradeUser.userSecret,
      authorizationId as string
    );

    res.json({
      success: true,
      data: { brokerageAuthorization },
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * Delete a brokerage connection
 */
export const remove = createHttpFunction({
  options: {
    requireAuth: true,
    requiredRole: "portfolioManager",
    requiredParams: {
      query: ["snapTradeUserId", "brokerageId"]
    },
    secrets: snaptradeSecrets
  },
  handler: async ({ req, res }) => {
    // Check for required query parameters
    const { snapTradeUserId, brokerageId } = req.query;

    logger.info(`Deleting brokerage connection ${brokerageId} for user ${snapTradeUserId}`,
      "SnapTradeConnectionFunction");

    // Get SnapTrade user details
    const snapTradeUser = await getSnapTradeUser(snapTradeUserId as string, res);

    if (!snapTradeUser) {
      // Error response is handled by getSnapTradeUser if res is passed
      return;
    }

    // Delete the brokerage connection
    const success = await deleteBrokerageConnectionService(
      snapTradeUserId as string,
      snapTradeUser.userSecret,
      brokerageId as string
    );

    res.json({
      success: true,
      data: { deleted: success },
      timestamp: new Date().toISOString(),
    });
  }
});


