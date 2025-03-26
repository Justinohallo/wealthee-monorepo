import { PORTFOLIO_MANAGER } from "@/constants/functionNames";
import { SnapTradeUser } from "../snaptrade/users";
import { callFirebaseFunction } from "@/lib/firebase-functions";

/**
 * Portfolio Manager SnapTrade related service functions
 */

export interface SnapTradeLoginResponse {
  redirectUri: string;
  userId: string;
}

export interface RegisterSnapTradeUserParams {
  displayName: string;
  redirectUri: string;
  brokerageId?: string;
  userId?: string;
}

/**
 * Check if a SnapTrade user exists for a portfolio manager
 */
export async function checkSnapTradeUserExists(
  userId: string,
  idToken: string
): Promise<boolean> {
  try {
    const response = await callFirebaseFunction<{ exists: boolean }>({
      idToken,
      functionName: PORTFOLIO_MANAGER.SNAPTRADE.CHECK_USER_EXISTS,
      queryParams: { userId },
      options: { method: "GET" }
    });

    return response?.data?.exists || false;
  } catch (error) {
    console.error("Failed to check if SnapTrade user exists:", error);
    return false;
  }
}

/**
 * Get the primary SnapTrade user for a portfolio manager
 */
export async function getPrimarySnapTradeUser(
  userId: string,
  idToken: string
): Promise<SnapTradeUser | null> {
  try {
    const response = await callFirebaseFunction<{ user: SnapTradeUser }>({
      idToken,
      functionName: PORTFOLIO_MANAGER.SNAPTRADE.GET_PRIMARY_USER,
      queryParams: { userId },
      options: { method: "GET" }
    });

    return response?.data?.user || null;
  } catch (error) {
    console.error("Failed to get primary SnapTrade user:", error);
    return null;
  }
}

/**
 * Get all SnapTrade users for a portfolio manager
 */
export async function getSnapTradeUsers(
  userId: string,
  idToken: string
): Promise<SnapTradeUser[]> {
  try {
    const response = await callFirebaseFunction<{ snapTradeUsers: SnapTradeUser[] }>({
      idToken,
      functionName: PORTFOLIO_MANAGER.SNAPTRADE.GET_USERS,
      queryParams: { userId },
      options: {
        method: "GET",
        revalidate: 0 // Don't cache user data
      }
    });

    return response?.data?.snapTradeUsers || [];
  } catch (error) {
    console.error("Failed to get SnapTrade users:", error);
    return [];
  }
}

/**
 * Login a SnapTrade user
 */
export async function loginSnapTradeUser(
  userId: string,
  snapTradeUserId: string,
  idToken: string
): Promise<SnapTradeLoginResponse | null> {
  try {
    const response = await callFirebaseFunction<SnapTradeLoginResponse>({
      idToken,
      functionName: PORTFOLIO_MANAGER.SNAPTRADE.LOGIN_USER,
      queryParams: { userId, snapTradeUserId },
      options: { method: "GET" }
    });

    return response?.data || null;
  } catch (error) {
    console.error("Failed to login SnapTrade user:", error);
    return null;
  }
}

/**
 * Register a primary SnapTrade user
 */
export async function registerPrimarySnapTradeUser(
  params: Omit<RegisterSnapTradeUserParams, 'userId'>,
  idToken: string
): Promise<SnapTradeUser | null> {
  try {
    const response = await callFirebaseFunction<{ user: SnapTradeUser }>({
      idToken,
      functionName: PORTFOLIO_MANAGER.SNAPTRADE.REGISTER_PRIMARY_USER,
      options: {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params)
      }
    });

    return response?.data?.user || null;
  } catch (error) {
    console.error("Failed to register primary SnapTrade user:", error);
    return null;
  }
}

/**
 * Register a SnapTrade user with display name
 */
export async function registerSnapTradeUserWithDisplay(
  params: RegisterSnapTradeUserParams,
  idToken: string
): Promise<SnapTradeUser | null> {
  try {
    const response = await callFirebaseFunction<{ user: SnapTradeUser }>({
      idToken,
      functionName: PORTFOLIO_MANAGER.SNAPTRADE.REGISTER_USER_WITH_DISPLAY,
      options: {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params)
      }
    });

    return response?.data?.user || null;
  } catch (error) {
    console.error("Failed to register SnapTrade user with display:", error);
    return null;
  }
}
