import * as clientService from "../../services/client/users";

import { createHttpFunction } from "../../utils/function-wrapper";
import { logger } from "../../utils/logger";

/**
 * Client user management functions
 */

/**
 * Adds a new client to the system
 */
export const addClient = createHttpFunction({
  handler: async ({ req, res }) => {
    const { portfolioManagerId, firstName, lastName, email } = req.body;

    logger.info(`Adding client ${email} for portfolio manager ${portfolioManagerId}`, "ClientUserManagement");

    const result = await clientService.addClient({
      portfolioManagerId,
      firstName,
      lastName,
      email
    });

    // Handle different result statuses with appropriate HTTP status codes
    switch (result.status) {
      case "created":
        // 201 Created - Brand new client was created
        res.status(201).json({
          success: true,
          data: {
            status: "created",
            message: result.message,
            clientId: result.clientId,
          },
          timestamp: new Date().toISOString(),
        });
        break;

      case "existing":
        // 200 OK - Existing client, no errors
        res.status(200).json({
          success: true,
          data: {
            status: "existing",
            message: result.message,
            clientId: result.clientId,
            alreadyExists: true
          },
          timestamp: new Date().toISOString(),
        });
        break;

      case "conflict":
        // 409 Conflict - Client exists but can't be used
        res.status(409).json({
          success: false,
          data: {
            status: "conflict",
            message: result.message,
            alreadyExists: true
          },
          timestamp: new Date().toISOString(),
        });
        break;

      default:
        // Unexpected status
        res.status(500).json({
          success: false,
          error: "Unexpected result status",
          timestamp: new Date().toISOString(),
        });
    }
  },
  options: {
    requireAuth: true,
    requiredRole: "portfolioManager",
    requiredParams: {
      body: ["portfolioManagerId", "firstName", "lastName", "email"]
    }
  }
});

/**
 * Gets a client by ID
 */
export const getClient = createHttpFunction({
  handler: async ({ req, res }) => {
    // Check for required path parameter
    const { clientId } = req.params;

    logger.info(`Getting client with ID: ${clientId}`, "ClientUserManagement");

    const client = await clientService.getClient(clientId);

    if (!client) {
      res.status(404).json({
        success: false,
        error: "Client not found",
        timestamp: new Date().toISOString(),
      });
      return;
    }

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
    requiredRole: "portfolioManager"
  }
});

/**
 * Lists all clients for a portfolio manager
 */
export const listClients = createHttpFunction({
  handler: async ({ req, res }) => {
    // Check for required query parameter
    const { portfolioManagerId } = req.query;

    logger.info(`Listing clients for portfolio manager: ${portfolioManagerId}`, "ClientUserManagement");

    const clients = await clientService.listClients(portfolioManagerId as string);

    logger.info(`Retrieved ${clients.length} clients`, "ClientUserManagement");
    // Return success response
    res.json({
      success: true,
      data: { clients },
      timestamp: new Date().toISOString(),
    });
  },
  options: {
    requireAuth: true,
    requiredRole: "portfolioManager",
    requiredParams: {
      query: ["portfolioManagerId"]
    }
  }
});

/**
 * Updates a client's information
 */
export const updateClient = createHttpFunction({
  handler: async ({ req, res }) => {
    // Check for required parameters
    const { clientId } = req.params;
    const { firstName, lastName, status } = req.body;

    logger.info(`Updating client with ID: ${clientId}`, "ClientUserManagement");

    await clientService.updateClient({
      clientId,
      firstName,
      lastName,
      status
    });

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
    requiredRole: "portfolioManager"
  }
});
