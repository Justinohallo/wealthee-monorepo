import { createSnapTradeClient } from "./client";
/**
 * SnapTrade brokerage connection service
 */
import { logger } from "../../utils/logger";

/**
 * List all brokerage connections for a SnapTrade user
 *
 * @param userId - SnapTrade user ID
 * @param userSecret - SnapTrade user secret
 * @return List of brokerage connections
 */
export const listBrokerageConnectionsService = async (
  userId: string,
  userSecret: string
) => {
  try {
    const client = createSnapTradeClient();
    const response = await client.connections.listBrokerageAuthorizations({
      userId,
      userSecret,

    });

    // Transform the API response to match our expected type
    const connections = response.data;
    return connections;
  } catch (error) {
    logger.error(
      `Failed to list brokerage connections: ${error instanceof Error ?
        error.message : String(error)}`,
      "SnapTradeConnectionService",
      error
    );
    throw error;
  }
};

/**
 * Get details for a specific brokerage authorization
 *
 * @param userId - SnapTrade user ID
 * @param userSecret - SnapTrade user secret
 * @param authorizationId - ID of the brokerage authorization to retrieve
 * @return Brokerage authorization details
 */
export const detailBrokerageAuthorizationService = async (
  userId: string,
  userSecret: string,
  authorizationId: string
) => {
  try {
    const client = createSnapTradeClient();
    const response = await client.connections.detailBrokerageAuthorization({
      userId,
      userSecret,
      authorizationId,
    });

    return response.data;
  } catch (error) {
    logger.error(
      `Failed to get brokerage authorization details: ${error instanceof Error ?
        error.message : String(error)}`,
      "SnapTradeConnectionService",
      error
    );
    throw error;
  }
};

/**
 * Delete a brokerage connection
 *
 * @param userId - SnapTrade user ID
 * @param userSecret - SnapTrade user secret
 * @param connectionId - ID of the connection to delete
 * @return Whether the deletion was successful
 */
export const deleteBrokerageConnectionService = async (
  userId: string,
  userSecret: string,
  connectionId: string
): Promise<boolean> => {
  try {
    const client = createSnapTradeClient();
    const response = await client.connections.removeBrokerageAuthorization({
      userId,
      userSecret,
      authorizationId: connectionId,
    });

    return response.status === 200;
  } catch (error) {
    logger.error(
      `Failed to delete brokerage connection: ${error instanceof Error ?
        error.message : String(error)}`,
      "SnapTradeConnectionService",
      error
    );
    throw error;
  }
};

/**
 * Get all supported brokerages
 *
 * @return List of supported brokerages
 */
export const getSupportedBrokerages = async (): Promise<any[]> => {
  try {
    const client = createSnapTradeClient();
    const response = await client.referenceData.listAllBrokerages();

    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    logger.error(
      `Failed to get supported brokerages: ${error instanceof Error ?
        error.message : String(error)}`,
      "SnapTradeConnectionService",
      error
    );
    throw error;
  }
};
