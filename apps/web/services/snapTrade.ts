import {
  AccountHoldingsResponse,
  SnapTradeAccount,
  SnapTradeAccountBalancesResponse,
  SnapTradeAccountDetailsResponse,
  SnapTradeAccountsResponse,
  SnapTradeBrokerageAuthorization,
  SnapTradeBrokerageAuthorizationsResponse,
  SnapTradeLoginResponse,
  SnapTradeUser,
  SnapTradeUsersResponse
} from "../types/snaptrade";
import { PORTFOLIO_MANAGER, SNAPTRADE } from "../constants/functionNames";

import { callFirebaseFunction } from "@/lib/firebase-functions";

/**
 * SnapTrade Service
 *
 * Provides typed methods for interacting with SnapTrade functions
 */

// Define the missing interface
interface RegisterSnapTradeUserWithDisplayParams {
  idToken: string;
  redirectUri: string;
  brokerageId: string;
  displayName: string;
  userId: string;
}

/**
 * Register a new SnapTrade user with display name
 */
export const registerSnapTradeUserWithDisplay = async ({
  idToken,
  redirectUri,
  brokerageId,
  displayName,
  userId,
}: RegisterSnapTradeUserWithDisplayParams) => {
  try {
    const result = await callFirebaseFunction({
      idToken,
      functionName: PORTFOLIO_MANAGER.SNAPTRADE.REGISTER_USER_WITH_DISPLAY,
      options: {
        method: "POST",
        body: JSON.stringify({ redirectUri, brokerageId, displayName, userId }),
      },
    });

    return result;
  } catch (error) {
    console.error("Failed to register SnapTrade user:", error);
    throw error;
  }
};

/**
 * Get account details from SnapTrade
 */
export const getSnapTradeAccountDetail = async ({ idToken }: { idToken: string }) => {
  try {
    const data = await callFirebaseFunction<any>({
      functionName: SNAPTRADE.ACCOUNTS.GET_DETAILS,
      options: {}
    });

    return data;
  } catch (error) {
    console.error("Failed to get SnapTrade account detail:", error);
    throw error;
  }
};

/**
 * List SnapTrade users
 */
export const getSnapTradeUsers = async ({
  idToken,
  userId,
}: {
  idToken: string;
  userId: string;
}) => {
  try {
    const data = await callFirebaseFunction<SnapTradeUsersResponse>({
      idToken,
      functionName: PORTFOLIO_MANAGER.SNAPTRADE.GET_USERS,
      queryParams: { userId },
      options: {
        method: "GET",
      },
    });

    return data?.snapTradeUsers || [];
  } catch (error) {
    console.error("Failed to get SnapTrade users:", error);
    throw error;
  }
};

/**
 * Get a login URL for a SnapTrade user
 */
export const loginSnapTradeUser = async ({
  idToken,
  userId,
  snapTradeUserId,
}: {
  idToken: string;
  userId: string;
  snapTradeUserId: string;
}) => {
  try {
    const data = await callFirebaseFunction<SnapTradeLoginResponse>({
      idToken,
      functionName: PORTFOLIO_MANAGER.SNAPTRADE.LOGIN_USER,
      queryParams: {
        userId,
        snapTradeUserId,
      },
      options: {
        method: "GET",
      },
    });

    return data;
  } catch (error) {
    console.error("Failed to login SnapTrade user:", error);
    throw error;
  }
};

/**
 * List brokerage authorizations for a SnapTrade user
 */
export const listBrokerageConnections = async ({
  idToken,
  userId,
}: {
  idToken: string;
  userId: string;
}) => {
  try {
    const data = await callFirebaseFunction<SnapTradeBrokerageAuthorizationsResponse>({
      idToken,
      functionName: SNAPTRADE.CONNECTIONS.LIST_BROKERAGE_CONNECTIONS,
      queryParams: { userId },
      options: {
        method: "GET",
      },
    });

    return data;
  } catch (error) {
    console.error("Failed to list brokerage connections:", error);
    throw error;
  }
};

/**
 * Get details for a specific brokerage authorization
 */
export const getBrokerageConnection = async ({
  idToken,
  userId,
  authorizationId,
}: {
  idToken: string;
  userId: string;
  authorizationId: string;
}) => {
  try {
    const data = await callFirebaseFunction<{ brokerageAuthorization: SnapTradeBrokerageAuthorization }>({
      idToken,
      functionName: SNAPTRADE.LEGACY.DETAIL_BROKERAGE_AUTHORIZATION,
      queryParams: {
        userId,
        authorizationId,
      },
      options: {
        method: "GET",
      },
    });

    return data;
  } catch (error) {
    console.error("Failed to get brokerage connection:", error);
    throw error;
  }
};

/**
 * List accounts for a SnapTrade user
 */
export const listUserAccounts = async ({
  idToken,
  userId,
}: {
  idToken: string;
  userId: string;
}) => {
  try {
    const data = await callFirebaseFunction<SnapTradeAccountsResponse>({
      idToken,
      functionName: SNAPTRADE.LEGACY.LIST_USER_ACCOUNTS,
      queryParams: {
        userId,
      },
      options: {
        method: "GET",
      },
    });

    return data;
  } catch (error) {
    console.error("Failed to list user accounts:", error);
    throw error;
  }
};

/**
 * Get details for a specific account
 */
export const getUserAccountDetails = async ({
  idToken,
  userId,
  accountId,
}: {
  idToken: string;
  userId: string;
  accountId: string;
}) => {
  try {
    const data = await callFirebaseFunction<SnapTradeAccountDetailsResponse>({
      idToken,
      functionName: SNAPTRADE.LEGACY.GET_USER_ACCOUNT_DETAILS,
      queryParams: {
        userId,
        accountId,
      },
      options: {
        method: "GET",
      },
    });

    return data;
  } catch (error) {
    console.error("Failed to get user account details:", error);
    throw error;
  }
};

/**
 * Get account balances
 */
export const getUserAccountBalances = async ({
  idToken,
  userId,
  accountId,
}: {
  idToken: string;
  userId: string;
  accountId: string;
}) => {
  try {
    const data = await callFirebaseFunction<SnapTradeAccountBalancesResponse>({
      idToken,
      functionName: SNAPTRADE.LEGACY.GET_USER_ACCOUNT_BALANCES,
      queryParams: {
        userId,
        accountId,
      },
      options: {
        method: "GET",
      },
    });

    return data;
  } catch (error) {
    console.error("Failed to get user account balances:", error);
    throw error;
  }
};

/**
 * Get account holdings
 */
export const getUserAccountHoldings = async ({
  idToken,
  userId,
  accountId,
}: {
  idToken: string;
  userId: string;
  accountId: string;
}) => {
  try {
    const data = await callFirebaseFunction<{ holdings: AccountHoldingsResponse }>({
      idToken,
      functionName: SNAPTRADE.LEGACY.GET_USER_HOLDINGS,
      queryParams: {
        userId,
        accountId,
      },
      options: {
        method: "GET",
      },
    });

    return data;
  } catch (error) {
    console.error("Failed to get user account holdings:", error);
    throw error;
  }
};

/**
 * Delete a SnapTrade user
 */
export const deleteSnapTradeUser = async ({
  idToken,
  portfolioManagerId,
  snapTradeUserId,
}: {
  idToken: string;
  portfolioManagerId: string;
  snapTradeUserId: string;
}): Promise<{ success: boolean }> => {
  try {
    const response = await callFirebaseFunction<{ success: boolean; data: { deleted: boolean }; timestamp: string }>({
      idToken,
      functionName: SNAPTRADE.USERS.DELETE,
      queryParams: {
        portfolioManagerId,
        snapTradeUserId,
      },
      options: {
        method: "DELETE",
      },
    });

    return { success: response?.success || false };
  } catch (error) {
    console.error("Failed to delete SnapTrade user:", error);
    return { success: false };
  }
};
