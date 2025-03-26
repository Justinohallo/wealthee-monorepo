import { auth, db } from "../../config/firebase";

import { ValidationError } from "../../utils/error-handling";
/**
 * Client user management functions
 */
import { createHttpFunction } from "../../utils/function-wrapper";
import { logger } from "../../utils/logger";

/**
 * Client interface defining the structure of client data
 */
interface Client {
  _id: string;
  dateCreated: string;
  email: string;
  expoPushToken: string | false;
  firstName: string;
  lastName: string;
  phone: string;
}

/**
 * Adds a new client to the system
 */
export const addClient = createHttpFunction({
  handler: async ({ req, res }) => {
    // Validate required parameters
    if (!req.body.client) {
      throw new ValidationError("Required body parameter 'client' is missing");
    }

    // Extract client data from request
    const clientData = req.body.client;
    logger.info("Adding new client", "ClientUserManagement");

    // Create the user in Firebase Auth with a default password
    const userRecord = await auth.createUser({
      email: clientData.email,
      emailVerified: false,
      password: "portfolio", // In production, use a secure random password generator
      displayName: `${clientData.firstName} ${clientData.lastName}`,
      disabled: false,
    });

    // Set custom claims to assign the role "client"
    await auth.setCustomUserClaims(userRecord.uid, { role: "client" });

    // Create client object with additional data
    const client: Client = {
      ...clientData,
      _id: userRecord.uid,
      dateCreated: new Date().toISOString(),
      expoPushToken: clientData.expoPushToken || false,
      phone: clientData.phone || "",
    };

    // Save client data to the database
    const clientRef = db.ref(`clients/${userRecord.uid}`);
    await clientRef.set(client);

    logger.info(`Client added successfully: ${userRecord.uid}`, "ClientUserManagement");

    // Return success response
    res.json({
      success: true,
      data: {
        message: "Client added successfully",
        clientId: userRecord.uid,
      },
      timestamp: new Date().toISOString(),
    });
  },
  options: {
    requireAuth: true,
    requiredRole: "portfolioManager",
  }
});

/**
 * Gets a client by ID
 */
export const getClient = createHttpFunction({
  handler: async ({ req, res }) => {
    // Check for required path parameter
    const { clientId } = req.params;
    if (!clientId) {
      throw new ValidationError("Required path parameter 'clientId' is missing");
    }

    logger.info(`Getting client with ID: ${clientId}`, "ClientUserManagement");

    // Get client data from the database
    const clientRef = db.ref(`clients/${clientId}`);
    const snapshot = await clientRef.once("value");

    if (!snapshot.exists()) {
      res.status(404).json({
        success: false,
        error: "Client not found",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const client = snapshot.val();

    logger.info(`Client retrieved successfully: ${clientId}`, "ClientUserManagement");

    // Return success response
    res.json({
      success: true,
      data: client,
      timestamp: new Date().toISOString(),
    });
  },
  options: {
    requireAuth: true,
    requiredRole: "portfolioManager",
  }
});

/**
 * Lists all clients for a portfolio manager
 */
export const listClients = createHttpFunction({
  handler: async ({ req, res }) => {
    // Check for required query parameter
    const { portfolioManagerId } = req.query;
    if (!portfolioManagerId) {
      throw new ValidationError("Required query parameter 'portfolioManagerId' is missing");
    }

    logger.info(`Listing clients for portfolio manager: ${portfolioManagerId}`, "ClientUserManagement");

    // Get all clients from the database
    const clientsRef = db.ref("clients");
    // In a real implementation, we would filter by portfolio manager ID
    // For now, we'll just get all clients
    const snapshot = await clientsRef.once("value");

    if (!snapshot.exists()) {
      res.json({
        success: true,
        data: [],
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Convert the snapshot to an array of clients
    const clients: Client[] = [];
    snapshot.forEach((childSnapshot) => {
      clients.push(childSnapshot.val());
      return false; // Return false to continue iterating
    });

    logger.info(`Retrieved ${clients.length} clients`, "ClientUserManagement");

    // Return success response
    res.json({
      success: true,
      data: clients,
      timestamp: new Date().toISOString(),
    });
  },
  options: {
    requireAuth: true,
    requiredRole: "portfolioManager",
  }
});

/**
 * Updates a client's information
 */
export const updateClient = createHttpFunction({
  handler: async ({ req, res }) => {
    // Check for required parameters
    const { clientId } = req.params;
    if (!clientId) {
      throw new ValidationError("Required path parameter 'clientId' is missing");
    }

    if (!req.body.client) {
      throw new ValidationError("Required body parameter 'client' is missing");
    }

    const clientData = req.body.client;
    logger.info(`Updating client with ID: ${clientId}`, "ClientUserManagement");

    // Verify client exists
    const clientRef = db.ref(`clients/${clientId}`);
    const snapshot = await clientRef.once("value");

    if (!snapshot.exists()) {
      res.status(404).json({
        success: false,
        error: "Client not found",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Update client data in the database, preserving unmodified fields
    await clientRef.update(clientData);

    // If email or name was updated, update Auth user record as well
    if (clientData.email || clientData.firstName || clientData.lastName) {
      const updateParams: Partial<{ email: string, displayName: string }> = {};

      if (clientData.email) {
        updateParams.email = clientData.email;
      }

      if (clientData.firstName || clientData.lastName) {
        const firstName = clientData.firstName || snapshot.val().firstName;
        const lastName = clientData.lastName || snapshot.val().lastName;
        updateParams.displayName = `${firstName} ${lastName}`;
      }

      await auth.updateUser(clientId, updateParams);
    }

    logger.info(`Client updated successfully: ${clientId}`, "ClientUserManagement");

    // Return success response
    res.json({
      success: true,
      data: {
        message: "Client updated successfully",
        clientId,
      },
      timestamp: new Date().toISOString(),
    });
  },
  options: {
    requireAuth: true,
    requiredRole: "portfolioManager",
  }
});
