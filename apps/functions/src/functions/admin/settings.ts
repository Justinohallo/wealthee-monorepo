/**
 * Admin settings management functions
 */
import { createHttpFunction } from "../../utils/function-wrapper";
import { db } from "../../config/firebase";
import { logger } from "../../utils/logger";

/**
 * Updates application settings
 */
export const updateSettings = createHttpFunction({
  handler: async ({ req, res }) => {
    // Check for required body parameters
    if (!req.body.settings || typeof req.body.settings !== "object") {
      res.status(400).json({
        success: false,
        error: "Required body parameter 'settings' is missing or invalid",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const { settings } = req.body;
    logger.info("Updating application settings", "AdminSettings");

    // Update settings in the database
    const settingsRef = db.ref("settings");
    await settingsRef.update(settings);

    logger.info("Application settings updated successfully", "AdminSettings");

    // Return success response
    res.json({
      success: true,
      data: { updated: true },
      timestamp: new Date().toISOString(),
    });
  },
  options: {
    requireAuth: true,
    requiredRole: "admin",
  }
});

/**
 * Gets application settings
 */
export const getSettings = createHttpFunction({
  handler: async ({ res }) => {
    logger.info("Retrieving application settings", "AdminSettings");

    // Get settings from the database
    const settingsRef = db.ref("settings");
    const snapshot = await settingsRef.once("value");
    const settings = snapshot.val() || {};

    logger.info("Application settings retrieved successfully", "AdminSettings");

    // Return success response
    res.json({
      success: true,
      data: settings,
      timestamp: new Date().toISOString(),
    });
  },
  options: {
    requireAuth: true,
    requiredRole: "admin",
  }
});

/**
 * Resets application settings to defaults
 */
export const resetSettings = createHttpFunction({
  handler: async ({ res }) => {
    logger.info("Resetting application settings to defaults", "AdminSettings");

    // Define default settings
    const defaultSettings = {
      appName: "Wealthee",
      theme: "light",
      features: {
        snapTrade: true,
        portfolioManagement: true,
        clientDashboard: true,
      },
      security: {
        sessionTimeout: 30, // minutes
        passwordRequirements: {
          minLength: 8,
          requireSpecialChars: true,
          requireNumbers: true,
        },
      },
      notifications: {
        email: true,
        push: true,
      },
      version: "1.0.0",
      lastReset: new Date().toISOString(),
    };

    // Reset settings in the database
    const settingsRef = db.ref("settings");
    await settingsRef.set(defaultSettings);

    logger.info("Application settings reset successfully", "AdminSettings");

    // Return success response
    res.json({
      success: true,
      data: defaultSettings,
      timestamp: new Date().toISOString(),
    });
  },
  options: {
    requireAuth: true,
    requiredRole: "admin",
  }
});
