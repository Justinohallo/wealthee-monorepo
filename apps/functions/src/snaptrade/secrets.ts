import {defineSecret} from "firebase-functions/params";

const snapTradeConsumerKey = defineSecret("SNAPTRADE_CONSUMER_KEY");
// This is for the Snaptrade Account at the root - not a client
const snapTradeClientId = defineSecret("SNAPTRADE_CLIENT_ID");
// TFSA, Self Managed Etc -  a client can have different accounts
const snaptradeAccountClientId = defineSecret("SNAPTRADE_ACCOUNT_CLIENT_ID");
// The user ID for a given client
const snapTradeClientUserId = defineSecret("SNAPTRADE_CLIENT_USER_ID");
// Secret
const snapTradeClientUserSecret = defineSecret("SNAPTRADE_CLIENT_USER_SECRET");

export {
  snapTradeConsumerKey,
  snapTradeClientId,
  snaptradeAccountClientId,
  snapTradeClientUserId,
  snapTradeClientUserSecret,
};

export const snaptradeSecrets = [
  snapTradeConsumerKey,
  snapTradeClientId,
  snaptradeAccountClientId,
  snapTradeClientUserId,
  snapTradeClientUserSecret]
  ;
