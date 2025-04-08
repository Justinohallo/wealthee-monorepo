import admin from "../../config/firebase";
import { createHttpFunction } from "../../utils/function-wrapper";
import { getAccountDetailsService } from "../../services/snaptrade/accounts";
import { getPrimaryAccount } from "../../services/portfolioManager/primaryAccount";
import { logger } from "../../utils/logger";
import { snaptradeSecrets } from "../../config";

/**
 * Client Dashboard Functions
 */

/**
 * Gets the portfolio manager's primary SnapTrade account for a client
 *
 * This function fetches the primary account of the portfolio manager
 * associated with the client to display on the client dashboard.
 */
export const getManagerPrimaryAccountV2 = createHttpFunction({
  handler: async ({ req, res }) => {
    const { clientId } = req.query;
    logger.info(`Getting portfolio manager's primary account for client: ${clientId}`, "ClientDashboard");

    // Step 1: Find the portfolio manager associated with this client
    const mappingSnapshot = await admin.database()
      .ref("portfolioManager_client_mappings")
      .orderByChild("clientId")
      .equalTo(clientId as string)
      .once("value");

    if (!mappingSnapshot.exists()) {
      logger.info(`No portfolio manager found for client: ${clientId}`, "ClientDashboard");
      res.status(404).json({
        success: false,
        error: "No portfolio manager found for this client",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Get the first mapping (there should only be one)
    const mappings = mappingSnapshot.val();
    const mappingKey = Object.keys(mappings)[0];
    const mapping = mappings[mappingKey];
    const portfolioManagerId = mapping.portfolioManagerId;

    if (!portfolioManagerId) {
      logger.error(`Invalid mapping found for client: ${clientId}`, "ClientDashboard");
      res.status(500).json({
        success: false,
        error: "Invalid portfolio manager mapping",
        timestamp: new Date().toISOString(),
      });
      return;
    }
    // Step 2: Get the portfolio manager's primary account data using the service
    const primaryAccountData = await getPrimaryAccount(portfolioManagerId);
    if (!primaryAccountData || !primaryAccountData.accountId || !primaryAccountData.snapTradeUserId) {
      logger.info(`No primary account found for portfolio manager: ${portfolioManagerId}`, "ClientDashboard");
      res.status(404).json({
        success: false,
        error: "Portfolio manager has no primary account set",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Step 3: Get the SnapTrade user data for the account
    const snapTradeUserSnapshot = await admin.database()
      .ref(`snapTradeUsers/${primaryAccountData.snapTradeUserId}`)
      .once("value");
    if (!snapTradeUserSnapshot.exists()) {
      logger.error(`SnapTrade user not found: ${primaryAccountData.snapTradeUserId}`, "ClientDashboard");
      res.status(404).json({
        success: false,
        error: "SnapTrade user not found",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const snapTradeUserData = snapTradeUserSnapshot.val();
    if (!snapTradeUserData.userSecret) {
      logger.error(`SnapTrade user secret missing for: ${primaryAccountData.snapTradeUserId}`, "ClientDashboard");
      res.status(500).json({
        success: false,
        error: "SnapTrade user configuration incomplete",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    try {
      // Get account details using SnapTrade service with the correct user credentials
      const accountDetails = await getAccountDetailsService({
        userId: primaryAccountData.snapTradeUserId,
        userSecret: snapTradeUserData.userSecret,
        accountId: primaryAccountData.accountId
      });

      console.log("accountDetails", accountDetails);

      // Return the account data in a consistent response format
      res.json({
        success: true,
        data: { accountDetails },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Error getting account details: ${error}`, "ClientDashboard");
      res.status(500).json({
        success: false,
        error: "Error retrieving account details",
        timestamp: new Date().toISOString(),
      });
    }
  },
  options: {
    requireAuth: true,
    requiredRole: "client",
    requiredParams: {
      query: ["clientId"]
    },
    secrets: snaptradeSecrets
  }
});
