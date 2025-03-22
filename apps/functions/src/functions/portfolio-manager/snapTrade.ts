import { ValidationError } from "../../utils/error-handling";
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
 * Registers a primary SnapTrade user for a portfolio manager
 *
 * This is a one-time operation that allows the portfolio manager to link
 * their own SnapTrade account to the application. The portfolio manager
 * can then manage multiple client accounts through this primary account.
 */
export const registerPrimarySnaptradeUser = createHttpFunction({
  handler: async ({ req, res }) => {
    // Check for required parameters
    const { userId } = req.body;
    if (!userId) {
      throw new ValidationError("Required body parameter 'userId' is missing");
    }

    logger.info(`Registering primary SnapTrade user for portfolio manager: ${userId}`, "PortfolioManagerSnapTrade");

    // Check if user already has a SnapTrade account
    const userRef = db.ref(`portfolioManagers/${userId}/snapTrade`);
    const userSnapshot = await userRef.once("value");

    if (userSnapshot.exists()) {
      res.status(409).json({
        success: false,
        error: "SnapTrade user already registered",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Create SnapTrade client and call API
    const snaptrade = createSnapTradeClient();
    const response = await snaptrade.authentication.registerSnapTradeUser({ userId });

    // Save SnapTrade user data to database
    await userRef.set({
      userId,
      userSecret: response.data.userSecret,
      linkedAccounts: {},
      selectedProfile: null,
      createdAt: new Date().toISOString(),
    });

    logger.info(`Primary SnapTrade user registered successfully for: ${userId}`, "PortfolioManagerSnapTrade");

    // Return success response
    res.json({
      success: true,
      data: {
        message: "SnapTrade user registered successfully",
        userId,
      },
      timestamp: new Date().toISOString(),
    });
  },
  options: {
    requireAuth: true,
    requiredRole: "portfolioManager",
    requiredParams: {
      body: ["userId"]
    }
  }
});

/**
 * Gets primary SnapTrade user details for a portfolio manager
 */
export const getPrimarySnaptradeUser = createHttpFunction({
  handler: async ({ req, res }) => {
    // Check for required parameters
    const { userId } = req.query;
    if (!userId) {
      throw new ValidationError("Required query parameter 'userId' is missing");
    }

    logger.info(`Getting primary SnapTrade user for portfolio manager: ${userId}`, "PortfolioManagerSnapTrade");

    // Retrieve snaptrade info from the database
    const userSnapRef = db.ref(`portfolioManagers/${userId as string}/snapTrade`);
    const snapshot = await userSnapRef.once("value");

    if (!snapshot.exists()) {
      res.status(404).json({
        success: false,
        error: "SnapTrade info not found for given userId",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const snapInfo = snapshot.val();

    // Create SnapTrade client and call API
    const snaptrade = createSnapTradeClient();

    try {
      // Get user details from SnapTrade
      const details = await snaptrade.accountInformation.listUserAccounts({
        userId: userId as string,
        userSecret: snapInfo.userSecret,
      });

      // Return success response
      res.json({
        success: true,
        data: {
          snapTradeInfo: {
            userId: snapInfo.userId,
            createdAt: snapInfo.createdAt,
            // Don't expose the userSecret
          },
          accounts: details.data,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      // Handle specific SnapTrade errors
      if (error.response?.status === 401 && error.response?.data?.code === "1083") {
        res.status(401).json({
          success: false,
          error: "Invalid userID or userSecret provided",
          details: error.response?.data,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Re-throw the error to be handled by the error middleware
      throw error;
    }
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
 * Checks if a SnapTrade user exists
 */
export const checkSnapTradeUserExists = createHttpFunction({
  handler: async ({ req, res }) => {
    // Check for required parameters
    const { userId } = req.query;
    if (!userId) {
      throw new ValidationError("Required query parameter 'userId' is missing");
    }

    logger.info(`Checking if SnapTrade user exists: ${userId}`, "PortfolioManagerSnapTrade");

    // Create SnapTrade client and call API
    const snaptrade = createSnapTradeClient();
    const listResponse = await snaptrade.authentication.listSnapTradeUsers();

    // Check if the user exists in the response
    const exists = Array.isArray(listResponse.data) ?
      listResponse.data.includes(userId as string) :
      false;

    // Return success response
    res.json({
      success: true,
      data: { exists },
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
 * Registers a new SnapTrade user with a display name for a portfolio manager
 *
 * This allows a portfolio manager to create multiple SnapTrade users,
 * each representing a different client or account group.
 */
export const registerSnaptradeUserWithDisplay = createHttpFunction({
  handler: async ({ req, res, auth: decodedToken }) => {
    // Check for required parameters
    const { userId, displayName } = req.body;
    if (!userId || !displayName) {
      throw new ValidationError("Required body parameters 'userId' and 'displayName' are missing");
    }

    logger.info(`Registering SnapTrade user with display name for portfolio manager: ${userId}`, "PortfolioManagerSnapTrade");

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
export const getSnaptradeUsers = createHttpFunction({
  handler: async ({ req, res }) => {
    // Check for required query parameter
    const { userId } = req.query;
    if (!userId) {
      throw new ValidationError("Required query parameter 'userId' is missing");
    }

    logger.info(`Getting SnapTrade users for portfolio manager: ${userId}`, "PortfolioManagerSnapTrade");

    // Get reference to the user's snapTradeUsers in database
    const userRef = db.ref(`portfolioManagers/${userId as string}/snapTradeUsers`);

    // Get all snapTradeUsers for this portfolio manager
    const snapshot = await userRef.once("value");

    // Convert the snapshot to an array of users
    const snapTradeUsers = snapshot.exists() ?
      Object.entries(snapshot.val()).map(([id, data]) => ({
        id,
        ...data as object,
      })) :
      [];

    logger.info(`Retrieved ${snapTradeUsers.length} SnapTrade users`, "PortfolioManagerSnapTrade");

    // Return success response
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
      query: ["userId"]
    },
    secrets: snaptradeSecrets
  }
});

/**
 * Generates a login URI for a SnapTrade user
 */
export const loginSnapTradeUser = createHttpFunction({
  handler: async ({ req, res }) => {
    // Check for required parameters
    const { userId, snapTradeUserId, redirectUri } = req.query;
    if (!userId || !snapTradeUserId) {
      throw new ValidationError("Required query parameters 'userId' and 'snapTradeUserId' are missing");
    }

    logger.info(`Logging in SnapTrade user: ${snapTradeUserId} for portfolio manager: ${userId}`, "PortfolioManagerSnapTrade");

    // Get SnapTrade user data from database
    const userRef = db.ref(`portfolioManagers/${userId as string}/snapTradeUsers/${snapTradeUserId as string}`);
    const snapshot = await userRef.once("value");

    if (!snapshot.exists()) {
      res.status(404).json({
        success: false,
        error: "SnapTrade user not found",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const snapTradeUser = snapshot.val();

    // Create SnapTrade client and call API
    const snaptrade = createSnapTradeClient();
    const response = await snaptrade.authentication.loginSnapTradeUser({
      userId: snapTradeUserId as string,
      userSecret: snapTradeUser.userSecret,
      broker: req.query.broker as string | undefined,
      immediateRedirect: false,
      customRedirect: redirectUri as string || undefined,
    });

    logger.info(`SnapTrade user login successful: ${snapTradeUserId}`, "PortfolioManagerSnapTrade");

    // Return success response
    res.json({
      success: true,
      data: { loginResponse: response.data },
      timestamp: new Date().toISOString(),
    });
  },
  options: {
    requireAuth: true,
    requiredRole: "portfolioManager",
    requiredParams: {
      query: ["userId", "snapTradeUserId"]
    }
  }
});
