import { BrokerageAuthorization } from "snaptrade-typescript-sdk";
import { BrokerageConnectionDTO } from "../../types/snaptrade";
/**
 * SnapTrade brokerage connection service
 */
import { createSnapTradeClient } from "./client";
import { logger } from "../../utils/logger";

/**
 * List all brokerage connections for a SnapTrade user
 *
 * @param userId - SnapTrade user ID
 * @param userSecret - SnapTrade user secret
 * @return List of brokerage connections
 */
export const listBrokerageConnections = async (
  userId: string,
  userSecret: string
): Promise<BrokerageConnectionDTO[]> => {
  try {
    const client = createSnapTradeClient();
    const response = await client.connections.listBrokerageAuthorizations({
      userId,
      userSecret
    });

    // Transform the API response to match our expected type
    const connections = response.data;
    return Array.isArray(connections) ? connections.map((auth: BrokerageAuthorization) => ({
      id: auth.id || "",
      brokerageId: auth.brokerage?.id || "",
      brokerageName: auth.brokerage?.name || "",
      authorizationId: auth.id || "",
      createdAt: auth.createdDate || new Date().toISOString(),
    })) : [];
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
 * Delete a brokerage connection
 *
 * @param userId - SnapTrade user ID
 * @param userSecret - SnapTrade user secret
 * @param connectionId - ID of the connection to delete
 * @return Whether the deletion was successful
 */
export const deleteBrokerageConnection = async (
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
