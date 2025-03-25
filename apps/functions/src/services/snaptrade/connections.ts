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
export const listBrokerageConnectionsService = async (
  userId: string,
  userSecret: string
): Promise<BrokerageConnectionDTO[]> => {
  try {
    const client = createSnapTradeClient();
    const response = await client.connections.listBrokerageAuthorizations({
      userId,
      userSecret,

    });

    // Transform the API response to match our expected type
    const connections = response.data;
    return Array.isArray(connections) ? connections.map((auth: BrokerageAuthorization) => ({
      id: auth.id || "",
      created_date: auth.createdDate || new Date().toISOString(),
      brokerage: {
        id: auth.brokerage?.id || "",
        name: auth.brokerage?.name || "",
        slug: auth.brokerage?.slug || "",
        display_name: auth.brokerage?.displayName || auth.brokerage?.name || "",
        description: auth.brokerage?.description || "",
        aws_s3_logo_url: auth.brokerage?.logoUrl || "",
        aws_s3_square_logo_url: auth.brokerage?.squareLogoUrl || "",
        url: auth.brokerage?.url || "",
        enabled: auth.brokerage?.enabled ?? true,
        maintenance_mode: auth.brokerage?.maintenanceMode ?? false,
        allows_trading: auth.brokerage?.allowsTrading ?? true,
        allows_fractional_units: auth.brokerage?.allowsFractionalUnits ?? false,
        has_reporting: auth.brokerage?.hasReporting ?? true,
        is_real_time_connection: auth.brokerage?.isRealTimeConnection ?? false,
        brokerage_type: {
          id: auth.brokerage?.brokerageType?.id || "",
          name: auth.brokerage?.brokerageType?.name || ""
        },
        exchanges: auth.brokerage?.exchanges || [],
        open_url: auth.brokerage?.openUrl || ""
      },
      name: auth.name || "",
      type: auth.type || "AUTH",
      disabled: auth.disabled ?? false,
      updated_date: auth.updatedDate || auth.createdDate || new Date().toISOString()
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
