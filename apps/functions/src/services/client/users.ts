import * as admin from "firebase-admin";

import { logger } from "../../utils/logger";

/**
 * Interface for parameters required to add a new client
 */
interface AddClientParams {
  portfolioManagerId: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
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
 * Interface for mapping between portfolio manager and client
 */
interface PortfolioManagerClientMapping {
  portfolioManagerId: string;
  clientId: string;
  createdAt: string;
}

/**
 * Client data without the ID
 */
type ClientData = Omit<Client, "id">;

/**
 * Check if a user with the given email already exists
 * @param email Email address to check
 * @returns User record if found, null if not found
 */
async function findUserByEmail(email: string): Promise<admin.auth.UserRecord | null> {
  try {
    return await admin.auth().getUserByEmail(email);
  } catch (error: unknown) {
    // Any error here means the user doesn't exist or something went wrong
    // Either way, return null to indicate "no user found"
    return null;
  }
}

/**
 * Check if a client is already associated with a portfolio manager
 * @param clientId Client ID to check
 * @param portfolioManagerId Portfolio manager ID to check against
 * @returns Boolean indicating if the association exists
 */
async function isClientAssociatedWithManager(clientId: string, portfolioManagerId: string): Promise<boolean> {
  const mappingsSnapshot = await admin.database()
    .ref("portfolioManager_client_mappings")
    .orderByChild("clientId")
    .equalTo(clientId)
    .once("value");

  if (!mappingsSnapshot.exists()) {
    return false;
  }

  const mappings = mappingsSnapshot.val();
  return Object.values(mappings).some(
    (mapping: unknown) => {
      if (mapping && typeof mapping === "object" && "portfolioManagerId" in mapping) {
        return (mapping as { portfolioManagerId: string }).portfolioManagerId === portfolioManagerId;
      }
      return false;
    }
  );
}

/**
 * Check if a client is associated with any portfolio manager
 * @param clientId Client ID to check
 * @returns Boolean indicating if any association exists
 */
async function isClientAssociatedWithAnyManager(clientId: string): Promise<boolean> {
  try {
    const mappingsSnapshot = await admin.database()
      .ref("portfolioManager_client_mappings")
      .orderByChild("clientId")
      .equalTo(clientId)
      .once("value");

    return mappingsSnapshot.exists();
  } catch (error) {
    logger.error(`Error checking if client ${clientId} is associated with any manager: ${error instanceof Error ? error.message : String(error)}`,
      "isClientAssociatedWithAnyManager", error);
    throw error;
  }
}

/**
 * Create a new Firebase Auth user
 * @param email User email
 * @param firstName User first name
 * @param lastName User last name
 * @param password User password
 * @returns Created user record
 */
async function createFirebaseUser(
  email: string,
  firstName: string,
  lastName: string,
  password: string
): Promise<admin.auth.UserRecord> {
  const userRecord = await admin.auth().createUser({
    email,
    password,
    displayName: `${firstName} ${lastName}`,
    disabled: false
  });
  logger.info(`Created new Firebase user with ID ${userRecord.uid}`, "createFirebaseUser");
  return userRecord;
}

/**
 * Create client data in the database
 * @param clientId Client ID
 * @param params Client data
 * @param status Client status
 */
async function createClientData(
  clientId: string,
  { firstName, lastName, email }: AddClientParams,
  status: "active" | "pending" = "pending"
): Promise<void> {
  const timestamp = new Date().toISOString();
  const clientData: ClientData = {
    firstName,
    lastName,
    email,
    status,
    createdAt: timestamp,
    updatedAt: timestamp
  };

  await admin.database()
    .ref(`clients/${clientId}`)
    .set(clientData);

  logger.info(`Created client data for ID ${clientId}`, "createClientData");
}

/**
 * Create a mapping between portfolio manager and client
 * @param portfolioManagerId Portfolio manager ID
 * @param clientId Client ID
 * @returns The ID of the created mapping
 */
async function createManagerClientMapping(
  portfolioManagerId: string,
  clientId: string
): Promise<string> {
  const timestamp = new Date().toISOString();
  const mapping: PortfolioManagerClientMapping = {
    portfolioManagerId,
    clientId,
    createdAt: timestamp
  };

  const mappingsRef = admin.database().ref("portfolioManager_client_mappings");
  const newMappingRef = mappingsRef.push();
  await newMappingRef.set(mapping);

  logger.info(`Created mapping between portfolio manager ${portfolioManagerId} and client ${clientId}`,
    "createManagerClientMapping");

  return newMappingRef.key as string;
}

/**
 * Result of adding a client
 */
export interface AddClientResult {
  clientId: string;
  status: "created" | "existing" | "conflict";
  message: string;
}

/**
 * Add a new client for a portfolio manager
 * @param params Parameters for adding a client
 * @returns Result object with client ID and status information
 */
export async function addClient(params: AddClientParams): Promise<AddClientResult> {
  const { portfolioManagerId, firstName, lastName, email, password } = params;

  try {
    // Step 1: Check if user already exists in Firebase Auth
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      // User exists - log for debugging
      logger.info(`Found existing user for email ${email} with ID ${existingUser.uid}`, "addClient");

      const clientId = existingUser.uid;

      // Step 2a: Check if already associated with this portfolio manager
      if (await isClientAssociatedWithManager(clientId, portfolioManagerId)) {
        return {
          clientId,
          status: "existing",
          message: "Client already exists and is associated with this portfolio manager"
        };
      }

      // Step 2b: Check if associated with any other portfolio manager
      if (await isClientAssociatedWithAnyManager(clientId)) {
        return {
          clientId,
          status: "conflict",
          message: "Client is already associated with another portfolio manager"
        };
      }

      // Step 3a: If client exists but isn't associated with any manager, create association
      await createClientData(clientId, params, "active");
      await createManagerClientMapping(portfolioManagerId, clientId);

      return {
        clientId,
        status: "existing",
        message: "Existing client has been associated with this portfolio manager"
      };
    } else {
      // Step 3b: User doesn't exist, create everything
      logger.info(`Creating new client with email ${email}`, "addClient");

      // Step 4: Create Firebase Auth user
      const newUser = await createFirebaseUser(email, firstName, lastName, password);

      // Step 5: Store client data
      await createClientData(newUser.uid, params);

      // Step 6: Create the relationship mapping
      await createManagerClientMapping(portfolioManagerId, newUser.uid);

      // TODO: Send welcome email with temporary password

      return {
        clientId: newUser.uid,
        status: "created",
        message: "New client created successfully"
      };
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`Failed to add client: ${errorMessage}`, "addClient", error);
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
