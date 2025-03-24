import {
  deleteBrokerageConnection,
  listBrokerageConnections,
} from "../../services/snaptrade/connections";

import { ValidationError } from "../../utils/error-handling";
import { createHttpFunction } from "../../utils/function-wrapper";
import { generateSnapTradeConnectionUrl } from "../../services/snaptrade/users";
import { logger } from "../../utils/logger";
/**
 * SnapTrade brokerage connection related Cloud Functions
 */
import { snaptradeSecrets } from "../../config";

/**
 * Authenticates a SnapTrade user and returns the Connection Portal URL used for connecting brokerage accounts.
 */
export const generateConnectionUrl = createHttpFunction({
  handler: async ({ req, res }) => {
    const { snapTradeUserId, broker, redirectUri } = req.query;

    logger.info(`Request received to generate connection URL for SnapTrade user: ${snapTradeUserId}`, "SnapTradeUsers");

    // Call service to generate connection URL
    const data = await generateSnapTradeConnectionUrl(snapTradeUserId as string, {
      broker: broker as string | undefined,
      redirectUri: redirectUri as string | undefined
    });
    console.log("data", data)
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
export const listBrokerageConnectionsForUser = createHttpFunction({
  handler: async ({ req, res }) => {
    // Check for required path parameter
    const { snapTradeUserId } = req.params;
    if (!snapTradeUserId) {
      throw new ValidationError("Required path parameter 'snapTradeUserId' is missing");
    }

    // Get the user from the database
    // This would pull from Firestore in a real implementation
    logger.info(`Listing brokerage connections for user ${snapTradeUserId}`,
      "SnapTradeConnectionFunction");

    // Get SnapTrade user details
    const snapTradeUser = {
      userId: snapTradeUserId,
      userSecret: "user-secret", // In real implementation, retrieve from database
    };

    // Get all brokerage connections for the user
    const connections = await listBrokerageConnections(
      snapTradeUser.userId,
      snapTradeUser.userSecret
    );

    res.json({
      success: true,
      data: connections,
      timestamp: new Date().toISOString(),
    });
  },
  options: {
    requireAuth: true,
    requiredRole: "portfolioManager",
  }
});

/**
 * Delete a brokerage connection
 */
export const deleteBrokerageConnectionForUser = createHttpFunction({
  handler: async ({ req, res }) => {
    // Check for required path parameters
    const { snapTradeUserId, connectionId } = req.params;
    if (!snapTradeUserId) {
      throw new ValidationError("Required path parameter 'snapTradeUserId' is missing");
    }
    if (!connectionId) {
      throw new ValidationError("Required path parameter 'connectionId' is missing");
    }

    // Get the user from the database
    // This would pull from Firestore in a real implementation
    logger.info(`Deleting brokerage connection ${connectionId} for user ${snapTradeUserId}`,
      "SnapTradeConnectionFunction");

    // Get SnapTrade user details
    const snapTradeUser = {
      userId: snapTradeUserId,
      userSecret: "user-secret", // In real implementation, retrieve from database
    };

    // Delete the brokerage connection
    const success = await deleteBrokerageConnection(
      snapTradeUser.userId,
      snapTradeUser.userSecret,
      connectionId
    );

    res.json({
      success: true,
      data: { deleted: success },
      timestamp: new Date().toISOString(),
    });
  },
  options: {
    requireAuth: true,
    requiredRole: "portfolioManager",
  }
});
