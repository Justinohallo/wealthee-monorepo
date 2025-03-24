import {
  snapTradeClientId,
  snapTradeConsumerKey,
} from "../../config/secrets";

/**
 * SnapTrade client initialization service
 */
import { Snaptrade } from "snaptrade-typescript-sdk";

/**
 * Creates a new SnapTrade client instance
 * @return A configured SnapTrade client
 */
export function createSnapTradeClient(): Snaptrade {
  if (!snapTradeConsumerKey.value() || !snapTradeClientId.value()) {
    throw new Error("SnapTrade consumer key or client ID is not set");
  }
  return new Snaptrade({
    consumerKey: snapTradeConsumerKey.value(),
    clientId: snapTradeClientId.value(),
  });
}
