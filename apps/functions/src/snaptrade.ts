import {defineSecret} from "firebase-functions/params";
import {Snaptrade} from "snaptrade-typescript-sdk";
import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

const snapTradeConsumerKey = defineSecret("SNAPTRADE_CONSUMER_KEY");
// This is for the Snaptrade Account at the root - not a client
const snapTradeClientId = defineSecret("SNAPTRADE_CLIENT_ID");
// TFSA, Self Managed Etc -  a client can have different accounts
const snaptradeAccountClientId = defineSecret("SNAPTRADE_ACCOUNT_CLIENT_ID");
// The user ID for a given client
const snapTradeClientUserId = defineSecret("SNAPTRADE_CLIENT_USER_ID");
// Secret
const snapTradeClientUserSecret = defineSecret("SNAPTRADE_CLIENT_USER_SECRET");

const snaptradeSecrets = [
  snapTradeConsumerKey,
  snapTradeClientId,
  snaptradeAccountClientId,
  snapTradeClientUserId,
  snapTradeClientUserSecret]
  ;

export const getAccountDetail = onRequest(
  {
    secrets: [
      ...snaptradeSecrets,
    ],
  },
  async (req, res) => {
    const snaptrade = new Snaptrade({
      consumerKey: snapTradeConsumerKey.value(),
      clientId: snapTradeClientId.value(),
    });
    const val = await snaptrade.accountInformation.getUserAccountDetails(
      {
        accountId: snaptradeAccountClientId.value(),
        userId: snapTradeClientUserId.value(),
        userSecret: snapTradeClientUserSecret.value(),
      },
    );
    res.send(val.data);
  }
);

export const listAccountBalances = onRequest(
  {
    secrets: [...snaptradeSecrets],
  },

  async (request, response) => {
    const snaptrade = new Snaptrade({
      consumerKey: snapTradeConsumerKey.value(),
      clientId: snapTradeClientId.value(),
    });
    try {
      const data =
        await snaptrade.accountInformation
          .getUserAccountBalance(
            {
              accountId: snaptradeAccountClientId.value(),
              userId: snapTradeClientUserId.value(),
              userSecret: snapTradeClientUserSecret.value(),
            },
          );
      response.send("status:" + JSON.stringify(data.data, null, 4));
    } catch (error) {
      logger.error("Error", JSON.stringify(error));
      response.send("Error " + JSON.stringify(error));
    }
  });

export const listAccountPositions = onRequest(
  {
    secrets: [...snaptradeSecrets],
  },

  async (request, response) => {
    const snaptrade = new Snaptrade({
      consumerKey: snapTradeConsumerKey.value(),
      clientId: snapTradeClientId.value(),
    });
    try {
      const data =
        await snaptrade
          .accountInformation
          .getUserAccountPositions(
            {
              accountId: snaptradeAccountClientId.value(),
              userId: snapTradeClientUserId.value(),
              userSecret: snapTradeClientUserSecret.value(),
            },
          );
      response.send(`
              <!DOCTYPE html>
              <head>
                  <title>Account Positions</title>
              </head>
              <body>
                  <pre>${JSON.stringify(data.data, null, 4)}</pre>
              </body>
              `);
    } catch (error) {
      logger.error("Error", JSON.stringify(error));
      response.send("Error " + JSON.stringify(error));
    }
  });

export const listAccountHoldings = onRequest(
  {
    secrets: [...snaptradeSecrets],
  },

  async (request, response) => {
    const snaptrade = new Snaptrade({
      consumerKey: snapTradeConsumerKey.value(),
      clientId: snapTradeClientId.value(),
    });
    try {
      const data =
        await snaptrade.accountInformation
          .getUserHoldings(
            {
              accountId: snaptradeAccountClientId.value(),
              userId: snapTradeClientUserId.value(),
              userSecret: snapTradeClientUserSecret.value(),
            },
          );
      response.send("status:" + JSON.stringify(data.data, null, 4));
    } catch (error) {
      logger.error("Error", JSON.stringify(error));
      response.send("Error " + JSON.stringify(error));
    }
  });


