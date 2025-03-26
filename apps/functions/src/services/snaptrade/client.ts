import {
  snapTradeClientId,
  snapTradeConsumerKey,
} from "../../config/secrets";

/**
 * SnapTrade client initialization service
 */
import { Snaptrade } from "snaptrade-typescript-sdk";
import { logger } from "../../utils/logger";

let snapTradeClientInstance: Snaptrade | null = null;

/**
 * Creates a new SnapTrade client instance or returns the existing one
 * @return A configured SnapTrade client
 */
export function createSnapTradeClient(): Snaptrade {
  try {
    if (!snapTradeConsumerKey.value() || !snapTradeClientId.value()) {
      throw new Error("SnapTrade consumer key or client ID is not set");
    }

    if (!snapTradeClientInstance) {
      logger.info("Creating new SnapTrade client instance", "SnapTradeClient");
      snapTradeClientInstance = new Snaptrade({
        consumerKey: snapTradeConsumerKey.value(),
        clientId: snapTradeClientId.value(),
      });
    }

    return snapTradeClientInstance;
  } catch (error) {
    logger.error(
      `Failed to create SnapTrade client: ${error instanceof Error ? error.message : String(error)}`,
      "SnapTradeClient",
      error
    );
    throw error;
  }
}

/**
 * Resets the SnapTrade client instance
 * This is useful for testing purposes or when the client needs to be re-initialized
 */
export function resetSnapTradeClient(): void {
  snapTradeClientInstance = null;
  logger.info("SnapTrade client instance reset", "SnapTradeClient");
}

