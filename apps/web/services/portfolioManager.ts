import { PORTFOLIO_MANAGER } from "../constants/functionNames";
import { callFirebaseFunction } from "@/lib/firebase-functions";

export interface PortfolioManager {
  uid?: string;
  id?: string;
  email: string;
  displayName?: string;
  createdAt?: string;
  snapTradeUserId?: string;
  emailVerified?: boolean;
  disabled?: boolean;
  metadata?: {
    creationTime: string;
    lastSignInTime: string | null;
    lastRefreshTime: string | null;
  };
  customClaims?: Record<string, string>;
  tokensValidAfterTime?: string;
  providerData?: unknown[];
}



/**
 * Portfolio Manager Service
 *
 * Provides typed methods for interacting with portfolio manager functions
 */

/**
 * Create a new portfolio manager
 */
export async function createPortfolioManager(
  idTokenOrData: string | { displayName: string; email: string; password: string },
  data?: { email: string; displayName?: string }
): Promise<PortfolioManager | null | { success: boolean; data?: any; error?: string }> {
  if (typeof idTokenOrData === 'string' && data) {
    // New API format - using ID token
    try {
      const result = await callFirebaseFunction({
        idToken: idTokenOrData,
        functionName: PORTFOLIO_MANAGER.USERS.CREATE,
        options: {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      });

      return result as PortfolioManager;
    } catch (error) {
      console.error('Error creating portfolio manager:', error);
      return null;
    }
  } else if (typeof idTokenOrData === 'object') {
    // Legacy API format - no ID token
    try {
      const result = await callFirebaseFunction({
        functionName: PORTFOLIO_MANAGER.USERS.CREATE,
        options: {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(idTokenOrData),
        }
      });

      return { success: true, data: result };
    } catch (error) {
      console.error("Failed to create portfolio manager:", error);
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  }

  return null;
}

/**
 * List all portfolio managers
 */
export async function listPortfolioManagers(idToken: string): Promise<PortfolioManager[]> {
  try {
    const response = await callFirebaseFunction<{
      data: PortfolioManager[],
      success: boolean,
      timestamp: string,
    }>({
      idToken,
      functionName: PORTFOLIO_MANAGER.USERS.LIST,
      options: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    });
    return response?.data || [];
  } catch (error) {
    console.error('Error fetching portfolio managers:', error);
    return [];
  }
}

/**
 * Get details for a specific portfolio manager
 */
export async function getPortfolioManager(
  idTokenOrUid: string,
  managerId: string
) {
  try {
    // New API format with idToken and managerId
    const data = await callFirebaseFunction<{ data: PortfolioManager, success: boolean, timestamp: string }>({
      idToken: idTokenOrUid,
      functionName: PORTFOLIO_MANAGER.USERS.GET,
      queryParams: { uid: managerId },
      options: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    });
    console.log(data)
    if (!data) {
      return null;
    }

    return data.data;
  } catch (error) {

    console.error('Error fetching portfolio manager:', error);
    return null;
  }
}

/**
 * Update a portfolio manager's details
 */
export async function updatePortfolioManager(
  idToken: string,
  managerId: string,
  data: Partial<Omit<PortfolioManager, 'id' | 'createdAt'>>
): Promise<PortfolioManager | null> {
  try {
    return await callFirebaseFunction<PortfolioManager>({
      idToken,
      functionName: 'portfoliomanager-updateportfoliomanager',
      options: {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          managerId,
          ...data
        })
      }
    });
  } catch (error) {
    console.error('Error updating portfolio manager:', error);
    return null;
  }
}

/**
 * Delete a portfolio manager
 */
export async function deletePortfolioManager(
  idToken: string,
  managerId: string
): Promise<boolean> {
  try {
    await callFirebaseFunction({
      idToken,
      functionName: 'portfoliomanager-deleteportfoliomanager',
      queryParams: { managerId },
      options: {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    });
    return true;
  } catch (error) {
    console.error('Error deleting portfolio manager:', error);
    return false;
  }
}
