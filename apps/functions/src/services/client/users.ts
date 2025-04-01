import * as admin from "firebase-admin";

import { generateTemporaryPassword } from "../../utils/password-utils";
import { logger } from "../../utils/logger";

/**
 * Interface for parameters required to add a new client
 */
interface AddClientParams {
  portfolioManagerId: string;
  firstName: string;
  lastName: string;
  email: string;
}

/**
 * Interface for a client
 */
export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: "active" | "inactive" | "pending";
  createdAt: string;
  updatedAt: string;
}

/**
 * Interface for parameters required to update a client
 */
interface UpdateClientParams {
  clientId: string;
  firstName?: string;
  lastName?: string;
  status?: "active" | "inactive" | "pending";
}

/**
 * Add a new client for a portfolio manager
 * @param params Parameters for adding a client
 * @returns The ID of the newly created client
 */
export async function addClient(params: AddClientParams): Promise<{ clientId: string }> {
  const { portfolioManagerId, firstName, lastName, email } = params;

  try {
    // Check if user already exists
    try {
      const userRecord = await admin.auth().getUserByEmail(email);
      logger.warn(`Client with email ${email} already exists with ID ${userRecord.uid}`, "AddClient");

      // Check if client is already associated with a portfolio manager via mappings
      const mappingsSnapshot = await admin.database()
        .ref("portfolioManager_client_mappings")
        .orderByChild("clientId")
        .equalTo(userRecord.uid)
        .once("value");

      if (mappingsSnapshot.exists()) {
        const mappings = mappingsSnapshot.val();
        const mappingIds = Object.keys(mappings);

        // Check if any of the mappings are for this portfolio manager
        for (const mappingId of mappingIds) {
          if (mappings[mappingId].portfolioManagerId === portfolioManagerId) {
            logger.info(`Client ${userRecord.uid} is already associated with portfolio
              manager ${portfolioManagerId} via mapping`, "AddClient");
            return { clientId: userRecord.uid };
          }
        }

        // Client exists but is associated with a different portfolio manager
        logger.warn(`Client ${userRecord.uid} is already associated with another portfolio manager`, "AddClient");
        throw new Error("Client is already associated with another portfolio manager");
      }

      // If client exists as a user but not as a client, associate them with this portfolio manager
      const timestamp = new Date().toISOString();

      // Store client in the central repository
      await admin.database()
        .ref(`clients/${userRecord.uid}`)
        .set({
          firstName,
          lastName,
          email,
          status: "active",
          createdAt: timestamp,
          updatedAt: timestamp
        });

      // Create the relationship mapping
      const mappingsRef = admin.database().ref("portfolioManager_client_mappings");
      const newMappingRef = mappingsRef.push();

      await newMappingRef.set({
        portfolioManagerId,
        clientId: userRecord.uid,
        createdAt: timestamp,
      });

      return { clientId: userRecord.uid };
    } catch (error) {
      // If error is not UserNotFound, rethrow
      if (error instanceof Error && error.message !== "auth/user-not-found") {
        throw error;
      }

      // User doesn't exist, create a new one
      logger.info(`Creating new client with email ${email}`, "AddClient");

      // Generate temporary password
      const tempPassword = generateTemporaryPassword();

      // Create Firebase Auth user
      const userRecord = await admin.auth().createUser({
        email,
        password: tempPassword,
        displayName: `${firstName} ${lastName}`,
        disabled: false
      });

      // Store client details in Realtime Database
      const timestamp = new Date().toISOString();
      const clientData = {
        firstName,
        lastName,
        email,
        status: "pending",
        createdAt: timestamp,
        updatedAt: timestamp
      };

      // Store in global clients list
      await admin.database()
        .ref(`clients/${userRecord.uid}`)
        .set(clientData);

      // Create the relationship mapping
      const mappingsRef = admin.database().ref("portfolioManager_client_mappings");
      const newMappingRef = mappingsRef.push();

      await newMappingRef.set({
        portfolioManagerId,
        clientId: userRecord.uid,
        createdAt: timestamp,
      });

      // TODO: Send welcome email with temporary password

      return { clientId: userRecord.uid };
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`Failed to add client: ${errorMessage}`, "AddClient", error);
    throw error;
  }
}

/**
 * List all clients for a portfolio manager
 * @param portfolioManagerId Portfolio manager ID to list clients for
 * @returns Array of clients
 */
export async function listClients(portfolioManagerId: string): Promise<Client[]> {
  try {
    // Get clients from the mappings table
    const mappingsSnapshot = await admin.database()
      .ref("portfolioManager_client_mappings")
      .orderByChild("portfolioManagerId")
      .equalTo(portfolioManagerId)
      .once("value");

    const clientIds: string[] = [];

    if (mappingsSnapshot.exists()) {
      const mappings = mappingsSnapshot.val();
      Object.values(mappings).forEach((mapping: unknown) => {
        if (mapping && typeof mapping === "object" && "clientId" in mapping) {
          clientIds.push((mapping as { clientId: string }).clientId);
        }
      });
    }

    // If no clients found, return empty array
    if (clientIds.length === 0) {
      return [];
    }
    console.log(clientIds);
    // Fetch each client's full data from the clients collection
    const clientPromises = clientIds.map(async (clientId) => {
      const clientSnapshot = await admin.database()
        .ref(`clients/${clientId}`)
        .once("value");

      if (!clientSnapshot.exists()) {
        // Handle inconsistency - client reference exists but client data doesn't
        logger.warn(`Client reference exists but client data missing for ${clientId}`, "ListClients");
        return null;
      }

      const clientData = clientSnapshot.val();
      return {
        id: clientId,
        ...clientData
      };
    });
    const clients = await Promise.all(clientPromises);
    console.log(clients);
    // Filter out any null values from clients that might be missing
    return clients.filter((client) => client !== null) as Client[];
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`Failed to list clients: ${errorMessage}`, "ListClients", error);
    throw error;
  }
}

/**
 * Get a specific client by ID
 * @param clientId Client ID to retrieve
 * @returns Client data or null if not found
 */
export async function getClient(clientId: string): Promise<Client | null> {
  try {
    const clientSnapshot = await admin.database()
      .ref(`clients/${clientId}`)
      .once("value");

    if (!clientSnapshot.exists()) {
      return null;
    }

    const clientData = clientSnapshot.val();

    return {
      id: clientId,
      ...clientData
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`Failed to get client: ${errorMessage}`, "GetClient", error);
    throw error;
  }
}

/**
 * Update a client's information
 * @param params Parameters for updating a client
 */
export async function updateClient(params: UpdateClientParams): Promise<void> {
  const { clientId, ...updateData } = params;

  try {
    // Get the client's data
    const clientSnapshot = await admin.database()
      .ref(`clients/${clientId}`)
      .once("value");

    if (!clientSnapshot.exists()) {
      throw new Error(`Client ${clientId} not found`);
    }

    // Update timestamp
    const updates = {
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    // Update client data in the central clients collection
    await admin.database()
      .ref(`clients/${clientId}`)
      .update(updates);

    // If updating name, also update in Firebase Auth
    if (updateData.firstName || updateData.lastName) {
      const clientData = clientSnapshot.val();
      const currentFirstName = clientData.firstName;
      const currentLastName = clientData.lastName;

      const newFirstName = updateData.firstName || currentFirstName;
      const newLastName = updateData.lastName || currentLastName;

      await admin.auth().updateUser(clientId, {
        displayName: `${newFirstName} ${newLastName}`
      });
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`Failed to update client: ${errorMessage}`, "UpdateClient", error);
    throw error;
  }
}
