import { SNAPTRADE } from "@/constants/functionNames";
import { callFirebaseFunction } from "@/lib/firebase-functions";

/**
 * SnapTrade User related service functions
 */

// Type definitions for SnapTrade users
export interface SnapTradeUser {
  id: string;
  displayName: string;
  createdAt: string;
}

export interface SnapTradeUserResponse {
  user: SnapTradeUser;
}

export interface SnapTradeUsersResponse {
  snapTradeUsers: SnapTradeUser[];
}

export interface RegisterSnapTradeUserParams {
  displayName: string;
  redirectUri: string;
}
/**
 * List SnapTrade users for a portfolio manager
 */
export async function listSnapTradeUsersForPortfolioManager(
  portfolioManagerId: string,
  idToken: string
): Promise<SnapTradeUser[]> {
  try {
    const response = await callFirebaseFunction<SnapTradeUsersResponse>({
      idToken,
      functionName: SNAPTRADE.USERS.LIST_FOR_PORTFOLIO_MANAGER,
      queryParams: { portfolioManagerId },
      options: {
        method: "GET",
      }
    });

    return response?.data?.snapTradeUsers || [];
  } catch (error) {
    console.error("Failed to list SnapTrade users:", error);
    return [];
  }
}

/**
 * Delete a SnapTrade user
 */
export async function deleteSnapTradeUser({
  idToken,
  portfolioManagerId,
  snapTradeUserId,
}: {
  idToken: string;
  portfolioManagerId: string;
  snapTradeUserId: string;
}): Promise<{ success: boolean }> {
  try {
    const response = await callFirebaseFunction<{ success: boolean }>({
      idToken,
      functionName: SNAPTRADE.USERS.DELETE,
      queryParams: {
        portfolioManagerId,
        snapTradeUserId
      },
      options: { method: "DELETE" }
    });

    return { success: response?.data?.success || true };
  } catch (error) {
    console.error("Failed to delete SnapTrade user:", error);
    return { success: false };
  }
}
