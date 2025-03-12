import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";

import {onRequest} from "firebase-functions/v2/https";


export interface Client {
  _id: string;
  dateCreated: string;
  email: string;
  expoPushToken: string | false;
  firstName: string;
  lastName: string;
  phone: string;
}

// eslint-disable-next-line max-len
const handleCreateClientUser = (
  client: Omit<Client, "_id" |
    "dateCreated" |
    "expoPushToken" |
    "phone">) => {
  try {
    return admin.auth().createUser({
      email: client.email,
      emailVerified: false,
      password: "portfolio",
      displayName: `${client.firstName} ${client.lastName}`,
      disabled: false,
    });
  } catch (e) {
    console.error(e);
    throw new Error();
  }
};

const handleSetClient = async ({
  clientId,
  client,
}: {
  clientId: string;
  client: Client;
}) => {
  const dataBase = admin.database();
  const ref = "clients/" + clientId;
  try {
    await dataBase.ref(ref).set(client);
  } catch (e) {
    console.error(e);
    throw new Error();
  }
};

export const addClient = onRequest(
  {cors: [/wealthee-a97ed\.web\.app$/, /127\.0\.0\.1:5002$/]},
  async (req, res) => {
    try {
      if (!req.body.client) {
        logger.info("Received request to add client",
          {client: req.body.client});
        res.status(400).send("Missing client or portfolioId in request body");
        return;
      }

      const client: Client = req.body.client;
      const {uid} = await handleCreateClientUser({
        firstName: "Justion",
        lastName: "Bieber",
        email: "j@biebs.com",
      });
      const dateCreated = new Date().toISOString();

      const clientObject: Client = {
        ...client,
        dateCreated,
        expoPushToken: false,
        _id: uid,
      };

      await handleSetClient({clientId: uid, client: clientObject});
      logger.info("Client added successfully", {clientId: uid});
      res.status(200).send(
        {
          message: "Client added successfully",
          clientId: uid,
        });
    } catch (e) {
      console.error(e);
      logger.error("Error adding client", {error: e});
      res.status(500).send("Error adding client");
    }
  });

export const getClient = onRequest(async (req, res) => {
  res.send("GETTING CLIENT!");
});
