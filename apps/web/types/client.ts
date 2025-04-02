/**
 * Types related to client management
 */

/**
 * Client interface - represents a client in the system
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
 * Type alias for Client to use in data contexts
 */
export type ClientData = Client;

/**
 * Form data for adding a new client
 */
export interface AddClientFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

/**
 * Result of adding a client
 */
export interface AddClientResult {
  clientId: string;
  status: "created" | "existing" | "conflict";
  message: string;
  alreadyExists?: boolean;
}

/**
 * Parameters for updating a client
 */
export interface UpdateClientParams {
  clientId: string;
  firstName?: string;
  lastName?: string;
  status?: "active" | "inactive" | "pending";
}

