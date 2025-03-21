/**
 * Centralized configuration of secrets for Firebase Functions
 */
import {defineSecret} from "firebase-functions/params";

/**
 * SnapTrade API secrets
 */
export const snapTradeConsumerKey = defineSecret("SNAPTRADE_CONSUMER_KEY");
// This is for the Snaptrade Account at the root - not a client
export const snapTradeClientId = defineSecret("SNAPTRADE_CLIENT_ID");
// TFSA, Self Managed Etc -  a client can have different accounts
export const snaptradeAccountClientId =
  defineSecret("SNAPTRADE_ACCOUNT_CLIENT_ID");
// The user ID for a given client
export const snapTradeClientUserId = defineSecret("SNAPTRADE_CLIENT_USER_ID");
// Secret
export const snapTradeClientUserSecret =
  defineSecret("SNAPTRADE_CLIENT_USER_SECRET");

/**
 * Grouping of secrets for easier function configuration
 */
export const snaptradeSecrets = [
  snapTradeConsumerKey,
  snapTradeClientId,
  snaptradeAccountClientId,
  snapTradeClientUserId,
  snapTradeClientUserSecret,
];

/**
 * Authentication secrets
 */
// Add any auth-related secrets here

/**
 * Database secrets
 */
// Add any database-related secrets here
