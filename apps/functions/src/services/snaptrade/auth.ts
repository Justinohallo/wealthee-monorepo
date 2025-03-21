/**
 * SnapTrade authentication service
 */
import { createSnapTradeClient } from "./client";
import { logger } from "../../utils/logger";

// Define a more specific type for the redirect URI response
interface RedirectUriResponse {
  redirectURI: string;
  [key: string]: unknown;
}

/**
 * Service for SnapTrade authentication operations
 */
export const snapTradeAuthService = {
  /**
   * Register a new SnapTrade user
   *
   * @param userId - User identifier to register with SnapTrade
   * @return The registered user data
   */
  async registerUser(userId: string): Promise<{ userId: string; userSecret: string } | null> {
    try {
      const client = createSnapTradeClient();
      const response = await client.authentication.registerSnapTradeUser({ userId });

      if (!response.data.userSecret) {
        throw new Error("User secret not returned from SnapTrade");
      }

      return {
        userId: response.data.userId || userId,
        userSecret: response.data.userSecret,
      };
    } catch (error) {
      logger.error(
        `Failed to register SnapTrade user: ${error instanceof Error ?
          error.message : String(error)}`,
        "SnapTradeAuthService",
        error
      );
      throw error;
    }
  },

  /**
   * Delete a SnapTrade user
   *
   * @param userId - SnapTrade user ID
   * @return Whether the deletion was successful
   */
  async deleteUser(userId: string): Promise<boolean> {
    try {
      const client = createSnapTradeClient();
      const response = await client.authentication.deleteSnapTradeUser({
        userId,
        // Note: userSecret is handled by the SDK or backend, not needed in our request
      });

      return response.data?.status === "success";
    } catch (error) {
      logger.error(
        `Failed to delete SnapTrade user: ${error instanceof Error ?
          error.message : String(error)}`,
        "SnapTradeAuthService",
        error
      );
      throw error;
    }
  },

  /**
   * Generate a new redirect URI for brokerage connection
   *
   * @param userId - SnapTrade user ID
   * @param userSecret - SnapTrade user secret
   * @param redirectUri - URI to redirect to after connection
   * @param brokerageId - Optional brokerage ID to connect to
   * @return The redirect URI to send the user to
   */
  async generateRedirectUri(
    userId: string,
    userSecret: string,
    redirectUri: string,
    brokerageId?: string
  ): Promise<string | null> {
    try {
      const client = createSnapTradeClient();
      const response = await client.authentication.loginSnapTradeUser({
        userId,
        userSecret,
        broker: brokerageId,
        immediateRedirect: false,
        customRedirect: redirectUri,
      });

      // Extract the redirect URI from the response
      // The typings might be incorrect, so we need to use a more specific type
      const responseData = response.data as RedirectUriResponse;
      if (!responseData.redirectURI) {
        throw new Error("Redirect URI not returned from SnapTrade");
      }

      return responseData.redirectURI;
    } catch (error) {
      logger.error(
        `Failed to generate redirect URI: ${error instanceof Error ?
          error.message : String(error)}`,
        "SnapTradeAuthService",
        error
      );
      throw error;
    }
  },
};
