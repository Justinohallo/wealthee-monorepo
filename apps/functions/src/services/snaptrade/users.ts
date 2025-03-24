/**
 * SnapTrade User Service
 *
 * Provides data access functions for working with SnapTrade users in the normalized database structure.
 */

import { Response } from "express";
import { createSnapTradeClient } from "./client";
import { db } from "../../config/firebase";
import { logger } from "../../utils/logger";

/**
 * Registers a new SnapTrade user and associates it with a portfolio manager
 */
export const registerSnapTradeUser = async (
  displayName: string,
  portfolioManagerId: string
): Promise<{ snapTradeUserId: string, displayName: string }> => {
  logger.info(`Registering new SnapTrade user with display name: ${displayName}`, "SnapTradeUserService");

  // Create reference to snapTradeUsers collection
  const snapTradeUsersRef = db.ref("snapTradeUsers");

  // Generate a new unique key for this snaptrade user
  const newSnapTradeUserRef = snapTradeUsersRef.push();

  // Get the generated ID
  const snapTradeUserId = newSnapTradeUserRef.key;
  if (!snapTradeUserId) {
    throw new Error("Failed to generate SnapTrade user ID");
  }

  // Create SnapTrade client and call API
  const snaptrade = createSnapTradeClient();
  const response = await snaptrade.authentication.registerSnapTradeUser({
    userId: snapTradeUserId,
  });

  // Set data for the new SnapTrade user
  await newSnapTradeUserRef.set({
    displayName,
    userSecret: response.data.userSecret,
    createdAt: new Date().toISOString(),
  });

  // Create the relationship mapping
  const mappingsRef = db.ref("portfolioManager_snapTradeUser_mappings");
  const newMappingRef = mappingsRef.push();

  await newMappingRef.set({
    portfolioManagerId,
    snapTradeUserId,
    createdAt: new Date().toISOString(),
  });

  // Also add the snapTradeUserId to the portfolio manager's list for quick access
  const portfolioManagerRef = db.ref(`portfolioManagers/${portfolioManagerId}/snapTradeUserIds`);
  await portfolioManagerRef.update({
    [snapTradeUserId]: true
  });

  logger.info(`SnapTrade user registered successfully: ${snapTradeUserId}`, "SnapTradeUserService");

  return { snapTradeUserId, displayName };
};

/**
 * Generates a connection URL for a SnapTrade user
 *
 * @param snapTradeUserId - ID of the SnapTrade user
 * @param options - Optional parameters for the connection URL
 * @returns The connection response from SnapTrade API
 */
export const generateSnapTradeConnectionUrl = async (
  snapTradeUserId: string,
  options?: {
    broker?: string;
    redirectUri?: string;
  }
) => {
  logger.info(`Generating connection URL for SnapTrade user: ${snapTradeUserId}`, "SnapTradeUserService");

  // Get the SnapTrade user
  const snapTradeUser = await getSnapTradeUser(snapTradeUserId);
  if (!snapTradeUser) {
    throw new Error(`SnapTrade user not found: ${snapTradeUserId}`);
  }

  // Create SnapTrade client and call API
  const snaptrade = createSnapTradeClient();
  const response = await snaptrade.authentication.loginSnapTradeUser({
    userId: snapTradeUserId,
    userSecret: snapTradeUser.userSecret,
    broker: options?.broker,
    immediateRedirect: false,
    customRedirect: options?.redirectUri,
  });

  logger.info(`Connection URL generated successfully for SnapTrade user: ${snapTradeUserId}`, "SnapTradeUserService");
  // The response from loginSnapTradeUser can be either EncryptedResponse or LoginRedirectURI
  // For our purposes, we're extracting the redirectURI from LoginRedirectURI type
  // If the response is of type EncryptedResponse, we'd need to decrypt it
  // but that's not implemented here as we're expecting LoginRedirectURI

  // Check if we have a valid response with redirectURI
  if (!response.data || (typeof response.data === "object" && !("redirectURI" in response.data))) {
    logger.error(`Failed to get valid redirect URI for user: ${snapTradeUserId}`, "SnapTradeUserService");
    throw new Error("Failed to generate connection URL: Invalid response format");
  }

  return response.data.redirectURI;
};

/**
 * Retrieves a SnapTrade user by ID
 *
 * @param snapTradeUserId - ID of the SnapTrade user
 * @param res - Response object for error handling (optional)
 * @returns SnapTrade user data or null if not found
 */
export const getSnapTradeUser = async (
  snapTradeUserId: string,
  res?: Response
): Promise<any | null> => {
  logger.info(`Getting SnapTrade user with ID: ${snapTradeUserId}`, "SnapTradeUserService");

  // Get reference to the SnapTrade user
  const userRef = db.ref(`snapTradeUsers/${snapTradeUserId}`);

  // Get the user data
  const snapshot = await userRef.once("value");
  if (!snapshot.exists()) {
    if (res) {
      res.status(404).json({
        error: "SnapTrade user not found",
        timestamp: new Date().toISOString(),
      });
    }
    return null;
  }

  const snapTradeUser = snapshot.val();
  if (!snapTradeUser.userSecret) {
    if (res) {
      res.status(400).json({
        error: "User secret not found for this SnapTrade user",
        timestamp: new Date().toISOString(),
      });
    }
    return null;
  }

  return snapTradeUser;
};

/**
 * Gets all SnapTrade users for a portfolio manager
 *
 * @param portfolioManagerId - ID of the portfolio manager
 * @returns Array of SnapTrade users or empty array if none found
 */
export const getSnapTradeUsersForPortfolioManager = async (
  portfolioManagerId: string
): Promise<any[]> => {
  logger.info(`Getting all SnapTrade users for portfolio manager: ${portfolioManagerId}`, "SnapTradeUserService");

  // Get the list of snapTradeUserIds from the portfolio manager document
  const idsRef = db.ref(`portfolioManagers/${portfolioManagerId}/snapTradeUserIds`);
  const snapshot = await idsRef.once("value");

  if (!snapshot.exists()) {
    return [];
  }

  const userIds = Object.keys(snapshot.val());
  const snapTradeUsers = [];

  // Fetch data for each user
  for (const id of userIds) {
    const userRef = db.ref(`snapTradeUsers/${id}`);
    const userSnapshot = await userRef.once("value");

    if (userSnapshot.exists()) {
      const userData = userSnapshot.val();
      // Don't expose the userSecret in the response
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { userSecret, ...safeUserData } = userData;
      snapTradeUsers.push({
        id,
        ...safeUserData,
      });
    }
  }

  return snapTradeUsers;
};

/**
 * Verifies if a portfolio manager has access to a SnapTrade user
 *
 * @param portfolioManagerId - ID of the portfolio manager
 * @param snapTradeUserId - ID of the SnapTrade user
 * @param res - Response object for error handling (optional)
 * @returns Boolean indicating whether access is allowed
 */
export const verifyPortfolioManagerAccess = async (
  portfolioManagerId: string,
  snapTradeUserId: string,
  res?: Response
): Promise<boolean> => {
  logger.info(`Verifying portfolio manager
    ${portfolioManagerId} access to SnapTrade user ${snapTradeUserId}`, "SnapTradeUserService");

  // Check if the snapTradeUserId is in the portfolio manager's list
  const accessRef = db.ref(`portfolioManagers/${portfolioManagerId}/snapTradeUserIds/${snapTradeUserId}`);
  const snapshot = await accessRef.once("value");

  if (!snapshot.exists()) {
    if (res) {
      res.status(403).json({
        error: "Portfolio manager does not have access to this SnapTrade user",
        timestamp: new Date().toISOString(),
      });
    }
    return false;
  }

  return true;
};
