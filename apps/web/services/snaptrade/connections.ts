import { BrokerageAuthorization } from "@/types/snaptrade";
import { SNAPTRADE } from "@/constants/functionNames";
import { callFirebaseFunction } from "@/lib/firebase-functions";

/**
 * Fetch brokerage authorizations for a SnapTrade user
 */
export async function listBrokerageConnections(
  userId: string,
  idToken: string
): Promise<BrokerageAuthorization[]> {
  try {
    const response = await callFirebaseFunction<{ connections: BrokerageAuthorization[] }>({
      idToken,
      functionName: SNAPTRADE.CONNECTIONS.LIST_BROKERAGE_CONNECTIONS,
      queryParams: { snapTradeUserId: userId },
      options: {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'GET',
        revalidate: 0 // Don't cache this data
      }
    });
    return response?.data?.connections || [];
  } catch (error) {
    console.error("Error fetching brokerage authorizations:", error);
    return [];
  }
}

/**
 * Get a login URL for SnapTrade brokerage connection
 */
export async function getSnapTradeBrokerageConnectionURL(
  userId: string,
  snapTradeUserId: string,
  idToken: string
): Promise<string | null> {
  try {
    const response = await callFirebaseFunction<{ url: string }>({
      idToken,
      functionName: SNAPTRADE.CONNECTIONS.GENERATE_CONNECTION_URL,
      queryParams: {
        userId,
        snapTradeUserId
      },
      options: {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'GET',
        revalidate: 0 // Don't cache this data
      }
    });

    return response?.data?.url || null;
  } catch (error) {
    console.error("Error fetching SnapTrade login URL:", error);
    return null;
  }
}

/**
 * Get details for a specific brokerage authorization
 */
export async function fetchBrokerageAuthorization(
  { userId, brokerageId, snapTradeUserId, idToken }: {
    userId: string,
    brokerageId: string,
    snapTradeUserId: string,
    idToken: string
  }
): Promise<BrokerageAuthorization | null> {
  try {
    const response = await callFirebaseFunction<{ brokerageAuthorization: BrokerageAuthorization }>({
      idToken,
      functionName: SNAPTRADE.CONNECTIONS.DETAIL_BROKERAGE_AUTHORIZATION,
      queryParams: {
        userId,
        authorizationId: brokerageId,
        snapTradeUserId
      },
      options: {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'GET',
        revalidate: 0 // Don't cache this data
      }
    });

    return response?.data?.brokerageAuthorization || null;
  } catch (error) {
    console.error("Error fetching brokerage authorization:", error);
    throw error;
  }
}

/**
 * Delete a brokerage connection
 */
export async function deleteBrokerageConnection(
  userId: string,
  brokerageId: string,
  idToken: string
): Promise<{ success: boolean }> {
  try {
    await callFirebaseFunction<{ deleted: boolean }>({
      idToken,
      functionName: SNAPTRADE.CONNECTIONS.DELETE_BROKERAGE_CONNECTION,
      queryParams: {
        snapTradeUserId: userId,
        brokerageId
      },
      options: {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json'
        }
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to delete brokerage connection:", error);
    throw error;
  }
}
