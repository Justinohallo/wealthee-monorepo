import { ValidationError } from "../../utils/error-handling";
import { auth } from "../../config/firebase";
/**
 * Portfolio Manager user management functions
 */
import { createHttpFunction } from "../../utils/function-wrapper";
import { logger } from "../../utils/logger";

/**
 * Creates a new portfolio manager user
 */
export const createPortfolioManager = createHttpFunction({
  handler: async ({ req, res }) => {
    // Validate required parameters
    if (!req.body.email || !req.body.password) {
      throw new ValidationError("Required body parameters 'email' and 'password' are missing");
    }

    // Extract fields from request body
    const { email, password, displayName } = req.body;

    logger.info(`Creating portfolio manager user with email: ${email}`, "PortfolioManagerUsers");

    // Create the auth user with additional fields if needed
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: displayName || "",
    });

    // Set custom claims to assign the role "portfolioManager"
    await auth.setCustomUserClaims(userRecord.uid, { role: "portfolioManager" });

    logger.info(`Portfolio manager created successfully: ${userRecord.uid}`, "PortfolioManagerUsers");

    // Return success response
    res.json({
      success: true,
      data: {
        uid: userRecord.uid,
        email: userRecord.email,
        role: "portfolioManager",
      },
      timestamp: new Date().toISOString(),
    });
  },
  options: {
    requireAuth: true,
    requiredRole: "admin",
    requiredParams: {
      body: ["email", "password"]
    }
  }
});

/**
 * Lists all portfolio manager users
 */
export const listPortfolioManagers = createHttpFunction({
  handler: async ({ res }) => {
    logger.info("Listing all portfolio manager users", "PortfolioManagerUsers");

    // Fetch all users and filter by custom claim role "portfolioManager"
    const { users } = await auth.listUsers();

    // Filter users with portfolioManager role
    const portfolioManagers = users.filter(
      (user) => user.customClaims &&
        user.customClaims.role === "portfolioManager"
    );

    // Transform user data to include only necessary fields
    const formattedUsers = portfolioManagers.map((user) => ({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      disabled: user.disabled,
      metadata: {
        creationTime: user.metadata.creationTime,
        lastSignInTime: user.metadata.lastSignInTime,
      }
    }));

    logger.info(`Retrieved ${formattedUsers.length} portfolio managers`, "PortfolioManagerUsers");

    // Return success response
    res.json({
      success: true,
      data: formattedUsers,
      timestamp: new Date().toISOString(),
    });
  },
  options: {
    requireAuth: true,
    requiredRole: "admin"
  }
});

/**
 * Gets a portfolio manager by ID
 */
export const getPortfolioManager = createHttpFunction({
  handler: async ({ req, res }) => {
    // Check for required query parameter
    const { uid } = req.query;
    if (!uid) {
      throw new ValidationError("Required path parameter 'uid' is missing");
    }

    logger.info(`Getting portfolio manager with ID: ${uid}`, "PortfolioManagerUsers");
    // Get user from Firebase Auth
    const user = await auth.getUser(uid as string);

    // Verify that the user is a portfolio manager
    if (!user.customClaims || user.customClaims.role !== "portfolioManager") {
      res.status(404).json({
        success: false,
        error: "Portfolio manager not found",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Format the user data
    const formattedUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      disabled: user.disabled,
      emailVerified: user.emailVerified,
      providerData: user.providerData,
      metadata: {
        creationTime: user.metadata.creationTime,
        lastSignInTime: user.metadata.lastSignInTime,
        lastRefreshTime: user.metadata.lastRefreshTime,
        tokensValidAfterTime: user.tokensValidAfterTime,
      },
      customClaims: user.customClaims
    };

    logger.info(`Portfolio manager retrieved successfully: ${uid}`, "PortfolioManagerUsers");

    // Return success response
    res.json({
      success: true,
      data: formattedUser,
      timestamp: new Date().toISOString(),
    });
  },
  options: {
    requireAuth: true,
    requiredRole: "admin"
  }
});

/**
 * Updates a portfolio manager's account
 */
export const updatePortfolioManager = createHttpFunction({
  handler: async ({ req, res }) => {
    // Check for required parameters
    const { uid } = req.params;
    if (!uid) {
      throw new ValidationError("Required path parameter 'uid' is missing");
    }

    logger.info(`Updating portfolio manager with ID: ${uid}`, "PortfolioManagerUsers");

    // Get user from Firebase Auth
    const user = await auth.getUser(uid);

    // Verify that the user is a portfolio manager
    if (!user.customClaims || user.customClaims.role !== "portfolioManager") {
      res.status(404).json({
        success: false,
        error: "Portfolio manager not found",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Extract fields to update
    const { displayName, email, password, disabled } = req.body;

    // Create update object with only provided fields
    const updateParams: {
      displayName?: string;
      email?: string;
      password?: string;
      disabled?: boolean;
    } = {};

    if (displayName !== undefined) updateParams.displayName = displayName;
    if (email !== undefined) updateParams.email = email;
    if (password !== undefined) updateParams.password = password;
    if (disabled !== undefined) updateParams.disabled = disabled;

    // Update the user in Firebase Auth
    await auth.updateUser(uid, updateParams);

    logger.info(`Portfolio manager updated successfully: ${uid}`, "PortfolioManagerUsers");

    // Return success response
    res.json({
      success: true,
      data: {
        message: "Portfolio manager updated successfully",
        uid
      },
      timestamp: new Date().toISOString(),
    });
  },
  options: {
    requireAuth: true,
    requiredRole: "admin"
  }
});
