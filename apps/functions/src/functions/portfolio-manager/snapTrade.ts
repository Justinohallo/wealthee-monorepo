/**
 * Portfolio Manager SnapTrade Integration Functions
 *
 * These functions handle the integration between portfolio managers and SnapTrade,
 * allowing managers to register SnapTrade users, manage connections, and perform
 * operations on behalf of their clients.
 */
import { createHttpFunction } from "../../utils/function-wrapper";
import { createSnapTradeClient } from "../../services/snaptrade/client";
import { db } from "../../config/firebase";
import { logger } from "../../utils/logger";
import { snaptradeSecrets } from "../../config";

/**
 * Registers a new SnapTrade user with a display name for a portfolio manager
 *
 * This allows a portfolio manager to create multiple SnapTrade users,
 * each representing a different client or account group.
 */
export const registerWithDisplay = createHttpFunction({
  handler: async ({ req, res }) => {
    // Check for required parameters
    const { userId, displayName } = req.body;
    logger.info(`Registering SnapTrade user
      with display name for portfolio manager: ${userId}`, "PortfolioManagerSnapTrade");

    // Create reference to the user's snaptrade data in database
    const userRef = db.ref(`portfolioManagers/${userId}/snapTradeUsers`);

    // Generate a new unique key for this snaptrade user
    const newSnaptradeUserRef = userRef.push();

    // Set initial data with display name
    await newSnaptradeUserRef.set({
      displayName,
      createdAt: new Date().toISOString(),
    });

    // Get the generated ID
    const snaptradeUserId = newSnaptradeUserRef.key;
    if (!snaptradeUserId) {
      throw new Error("Failed to generate Snaptrade user ID");
    }

    // Create SnapTrade client and call API
    const snaptrade = createSnapTradeClient();
    const response = await snaptrade.authentication.registerSnapTradeUser({
      userId: snaptradeUserId,
    });

    // Update the database entry with the user secret
    await newSnaptradeUserRef.update({
      userSecret: response.data.userSecret,
    });

    logger.info(`SnapTrade user registered successfully: ${snaptradeUserId}`, "PortfolioManagerSnapTrade");

    // Return success response
    res.json({
      success: true,
      data: {
        message: "SnapTrade user registered successfully",
        snaptradeUserId,
        displayName,
      },
      timestamp: new Date().toISOString(),
    });
  },
  options: {
    requireAuth: true,
    requiredRole: "portfolioManager",
    requiredParams: {
      body: ["userId", "displayName"]
    },
    secrets: snaptradeSecrets
  }
});

/**
 * Gets all SnapTrade users for a portfolio manager
 */
export const getUsers = createHttpFunction({
  handler: async ({ req, res }) => {
    // Check for required query parameter
    const { userId } = req.query;

    logger.info(`Getting SnapTrade users for portfolio manager: ${userId}`, "PortfolioManagerSnapTrade");

    // Get reference to the user's snapTradeUsers in database
    const userRef = db.ref(`portfolioManagers/${userId}/snapTradeUsers`);
    const userSnapshot = await userRef.once("value");

    if (!userSnapshot.exists()) {
      // Return empty array if no users found
      res.json({
        success: true,
        data: { users: [] },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Convert snapshot to array of users with IDs
    const usersData = userSnapshot.val();
    const users = Object.keys(usersData).map((id) => ({
      id,
      ...usersData[id],
    }));

    // Return success response
    res.json({
      success: true,
      data: { users },
      timestamp: new Date().toISOString(),
    });
  },
  options: {
    requireAuth: true,
    requiredRole: "portfolioManager",
    requiredParams: {
      query: ["userId"]
    }
  }
});

/**
 * Gets the primary SnapTrade user for a portfolio manager
 */
export const getPrimary = createHttpFunction({
  handler: async ({ req, res }) => {
    // Check for required query parameter
    const { userId } = req.query;


    logger.info(`Getting primary SnapTrade user for portfolio manager: ${userId}`, "PortfolioManagerSnapTrade");

    // Get reference to the user's snapTrade data in database
    const userRef = db.ref(`portfolioManagers/${userId}/snapTrade`);
    const userSnapshot = await userRef.once("value");

    if (!userSnapshot.exists()) {
      res.status(404).json({
        success: false,
        error: "SnapTrade user not found",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const userData = userSnapshot.val();

    // Don't expose the userSecret in the response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { userSecret, ...safeUserData } = userData;

    // Return success response
    res.json({
      success: true,
      data: {
        userId: userData.userId,
        ...safeUserData
      },
      timestamp: new Date().toISOString(),
    });
  },
  options: {
    requireAuth: true,
    requiredRole: "portfolioManager",
    requiredParams: {
      query: ["userId"]
    }
  }
});

