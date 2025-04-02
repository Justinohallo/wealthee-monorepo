'use server'

import { AddClientFormData, AddClientResult, Client, UpdateClientParams } from "@/types/client";
import { revalidatePath, revalidateTag } from "next/cache";

import { CLIENT } from "@/constants/functionNames";
import { callFirebaseFunction } from "@/lib/firebase-functions";

/**
 * Add a new client
 * @param data Form data for adding a client
 * @param idToken Authentication token
 * @param portfolioManagerId Portfolio manager ID
 * @returns Result object with client information and status
 */
export async function addClient(
  data: AddClientFormData,
  idToken: string,
  portfolioManagerId: string
): Promise<AddClientResult> {
  try {
    const response = await callFirebaseFunction<AddClientResult>({
      functionName: CLIENT.USERS.ADD,
      idToken,
      options: {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          portfolioManagerId,
        }),
      },
    });
    revalidateTag('clients')
    return response?.data || {
      clientId: "",
      status: "conflict",
      message: "Failed to add client"
    };
  } catch (error) {
    // Handle conflict error (409)
    if (error instanceof Error && error.message.includes("already associated with another portfolio manager")) {
      return {
        clientId: "",
        status: "conflict",
        message: "Client is already associated with another portfolio manager"
      };
    }

    // Re-throw other errors
    throw error;
  }
}

/**
 * Get a client by ID
 * @param clientId Client ID
 * @param idToken Authentication token
 * @returns Client data or null if not found
 */
export async function getClient(
  clientId: string,
  idToken: string
): Promise<Client | null> {
  try {
    const response = await callFirebaseFunction<{ client: Client }>({
      functionName: CLIENT.USERS.GET,
      idToken,
      queryParams: { clientId },
      options: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    });
    return response?.data?.client || null;
  } catch (error) {
    if (error instanceof Error && error.message.includes("not found")) {
      return null;
    }
    throw error;
  }
}

/**
 * List all clients for a portfolio manager
 * @param portfolioManagerId Portfolio manager ID
 * @param idToken Authentication token
 * @returns Array of clients
 */
export async function listClients(
  portfolioManagerId: string,
  idToken: string
): Promise<Client[]> {
  try {
    const response = await callFirebaseFunction<{ clients: Client[] }>({
      functionName: CLIENT.USERS.LIST,
      idToken,
      queryParams: { portfolioManagerId },
      options: {
        tags: ['clients']
      }
    });
    return response?.data?.clients || [];
  } catch (error) {
    console.error("Error listing clients:", error);
    return [];
  }
}

/**
 * Update a client's information
 * @param params Parameters for updating a client
 * @param idToken Authentication token
 * @returns void
 */
export async function updateClient(
  params: UpdateClientParams,
  idToken: string
): Promise<void> {
  await callFirebaseFunction({
    functionName: CLIENT.USERS.UPDATE,
    idToken,
    options: {
      method: "PUT",
      body: JSON.stringify(params),
    },
  });
}
