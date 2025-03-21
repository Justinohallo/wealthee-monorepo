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
  return new Snaptrade({
    consumerKey: snapTradeConsumerKey.value(),
    clientId: snapTradeClientId.value(),
  });
}
