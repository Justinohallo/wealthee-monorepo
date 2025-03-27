/**
 * SnapTrade Users API
 *
 * This module provides functions for managing SnapTrade users in a normalized database structure.
 * Each SnapTrade user exists as an independent entity, with separate relationship mappings to portfolio managers.
 */

import {
  deleteSnapTradeUserFromDb,
  getSnapTradeUser,
  getSnapTradeUsersForPortfolioManager,
  registerSnapTradeUser,
  verifyPortfolioManagerAccess
} from "../../services/snaptrade/users";

import { createHttpFunction } from "../../utils/function-wrapper";
import { logger } from "../../utils/logger";
import { snaptradeSecrets } from "../../config";

/**
 * Registers a new SnapTrade user
 */
export const registerUser = createHttpFunction({
  handler: async ({ req, res }) => {
    const { displayName, portfolioManagerId } = req.body;

    logger.info(`Request received to register new SnapTrade user: ${displayName}`, "SnapTradeUsers");

    // Call the service to handle all business logic
    const result = await registerSnapTradeUser(displayName, portfolioManagerId);

    // Return success response
    res.json({
      success: true,
      data: {
        message: "SnapTrade user registered successfully",
        ...result
      },
      timestamp: new Date().toISOString(),
    });
  },
  options: {
    requireAuth: true,
    requiredRole: "portfolioManager",
    requiredParams: {
      body: ["displayName", "portfolioManagerId"]
    },
    secrets: snaptradeSecrets
  }
});

/**
 * Get SnapTrade user details
 */
export const getUser = createHttpFunction({
  handler: async ({ req, res }) => {
    const { snapTradeUserId } = req.query;

    logger.info(`Getting SnapTrade user: ${snapTradeUserId}`, "SnapTradeUsers");

    // Get SnapTrade user data using the service
    const snapTradeUser = await getSnapTradeUser(snapTradeUserId as string, res);

    if (!snapTradeUser) {
      // Error response is handled by getSnapTradeUser if res is passed
      return;
    }

    // Don't expose the userSecret in the response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { userSecret, ...safeUserData } = snapTradeUser;

    res.json({
      success: true,
      data: {
        id: snapTradeUserId,
        ...safeUserData,
      },
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
 * List all SnapTrade users for a portfolio manager
 */
export const listUsersForPortfolioManager = createHttpFunction({
  handler: async ({ req, res }) => {
    const { portfolioManagerId } = req.query;

    logger.info(`Listing SnapTrade users for portfolio manager: ${portfolioManagerId}`, "SnapTradeUsers");

    // Get users using the service function
    const snapTradeUsers = await getSnapTradeUsersForPortfolioManager(portfolioManagerId as string);
    res.json({
      success: true,
      data: { snapTradeUsers },
      timestamp: new Date().toISOString(),
    });
  },
  options: {
    requireAuth: true,
    requiredRole: "portfolioManager",
    requiredParams: {
      query: ["portfolioManagerId"]
    },
    secrets: snaptradeSecrets
  }
});

/**
 * Deletes a SnapTrade user
 */
export const deleteUserV2 = createHttpFunction({
  options: {
    requireAuth: true,
    requiredRole: "portfolioManager",
    secrets: snaptradeSecrets,
    requiredParams: {
      query: ["portfolioManagerId", "snapTradeUserId"]
    }
  },
  handler: async ({ req, res }) => {
    // Get query parameters
    const { portfolioManagerId, snapTradeUserId } = req.query;

    // Validate access
    const hasAccess = await verifyPortfolioManagerAccess(
      portfolioManagerId as string,
      snapTradeUserId as string,
      res
    );

    if (!hasAccess) {
      // Error response is handled by verifyPortfolioManagerAccess if res is passed
      return;
    }

    // Delete the user
    await deleteSnapTradeUserFromDb(
      snapTradeUserId as string,
      portfolioManagerId as string
    );

    // Return success response
    res.json({
      success: true,
      data: { deleted: true },
      timestamp: new Date().toISOString(),
    });
  },
});


