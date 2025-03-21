import { ValidationError } from "../../utils/error-handling";
/**
 * SnapTrade brokerage connection related Cloud Functions
 */
import { createHttpFunction } from "../../utils/function-wrapper";
import { logger } from "../../utils/logger";
import { snapTradeAuthService } from "../../services/snaptrade/auth";
import { snapTradeConnectionService } from "../../services/snaptrade/connections";

/**
 * Get a redirect URI for connecting to a brokerage
 */
export const getBrokerageRedirectUri = createHttpFunction({
  handler: async ({ req, res }) => {
    // Check for required path parameter
    const { snapTradeUserId } = req.params;
    if (!snapTradeUserId) {
      throw new ValidationError("Required path parameter 'snapTradeUserId' is missing");
    }

    // Check for required query parameters
    const { redirectUri, brokerageId } = req.query;
    if (!redirectUri) {
      throw new ValidationError("Required query parameter 'redirectUri' is missing");
    }

    // Get the user from the database
    // This would pull from Firestore in a real implementation
    logger.info(`Getting redirect URI for user ${snapTradeUserId} and broker ${brokerageId || "any"}`,
      "SnapTradeConnectionFunction");

    // Get brokerage connection redirect URI from SnapTrade
    const snapTradeUser = {
      userId: snapTradeUserId,
      userSecret: "user-secret", // In real implementation, retrieve from database
    };

    // Generate the redirect URI
    const uri = await snapTradeAuthService.generateRedirectUri(
      snapTradeUser.userId,
      snapTradeUser.userSecret,
      redirectUri as string,
      brokerageId as string
    );

    res.json({
      success: true,
      data: { redirectUri: uri },
      timestamp: new Date().toISOString(),
    });
  },
  options: {
    requireAuth: true,
    requiredRole: "portfolioManager",
  }
});

/**
 * List all brokerage connections for a SnapTrade user
 */
export const listBrokerageConnections = createHttpFunction({
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
    const connections = await snapTradeConnectionService.listBrokerageConnections(
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
export const deleteBrokerageConnection = createHttpFunction({
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
    const success = await snapTradeConnectionService.deleteBrokerageConnection(
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
