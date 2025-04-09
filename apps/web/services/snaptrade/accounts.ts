import {
  Account,
  AccountHoldingsAccount,
  Balance,
  Order,
  PaginatedUniversalActivity,
  Position
} from "@/types/snaptrade";

import { SNAPTRADE } from "@/constants/functionNames";
import { callFirebaseFunction } from "@/lib/firebase-functions";

/**
 * List all accounts for a SnapTrade user
 */
export async function listUserAccounts(
  userId: string,
  snapTradeUserId: string,
  idToken: string
): Promise<Account[]> {
  try {
    const response = await callFirebaseFunction<{ accounts: Account[] }>({
      idToken,
      functionName: SNAPTRADE.ACCOUNTS.LIST_USER_ACCOUNTS,
      queryParams: { userId, snapTradeUserId },
      options: {
        method: "GET",
        revalidate: 0 // Don't cache accounts
      }
    });

    return response?.data?.accounts || [];
  } catch (error) {
    console.error(`Failed to list accounts for user ${snapTradeUserId}:`, error);
    throw error; // Re-throw error to allow error boundaries to catch it
  }
}

/**
 * Get details for a specific account
 */
export async function getAccountDetails(
  { userId,
    snapTradeUserId,
    accountId,
    idToken,
  }: {
    userId: string,
    snapTradeUserId: string,
    accountId: string,
    idToken: string
  }) {
  try {
    const response = await callFirebaseFunction<Account>({
      idToken,
      functionName: SNAPTRADE.ACCOUNTS.GET_DETAILS,
      queryParams: { userId, snapTradeUserId, accountId },
      options: { method: "GET" }
    });

    return response?.data || null;
  } catch (error) {
    console.error("Failed to get account details:", error);
    return null;
  }
}

/**
 * Get account balances
 */
export async function getAccountBalances({ userId, snapTradeUserId, accountId, idToken }: { userId: string, snapTradeUserId: string, accountId: string, idToken: string }) {
  try {
    const response = await callFirebaseFunction<{ balances: Balance[] }>({
      idToken,
      functionName: SNAPTRADE.ACCOUNTS.GET_ACCOUNT_BALANCES,
      queryParams: { userId, snapTradeUserId, accountId },
      options: { method: "GET" }
    });

    return response?.data?.balances || null;
  } catch (error) {
    console.error(`Failed to get account balances for account ${accountId}:`, error);
    throw error;
  }
}

/**
 * Get account holdings
 */
export async function getAccountHoldings({ userId, snapTradeUserId, accountId, idToken }:
  {
    userId: string,
    snapTradeUserId: string,
    accountId: string,
    idToken: string
  }
) {
  try {
    const response = await callFirebaseFunction<{ holdings: AccountHoldingsAccount }>({
      idToken,
      functionName: SNAPTRADE.ACCOUNTS.GET_ACCOUNT_HOLDINGS,
      queryParams: { userId, snapTradeUserId, accountId },
      options: { method: "GET" }
    });

    return response?.data?.holdings || null;
  } catch (error) {
    console.error("Failed to get account holdings:", error);
    throw error;
  }
}

/**
 * Get account positions
 */
export async function getAccountPositions({ userId, snapTradeUserId, accountId, idToken }:
  {
    userId: string,
    snapTradeUserId: string,
    accountId: string,
    idToken: string
  }
) {
  try {
    const response = await callFirebaseFunction<{ positions: Position[] }>({
      idToken,
      functionName: SNAPTRADE.ACCOUNTS.GET_ACCOUNT_POSITIONS,
      queryParams: { userId, snapTradeUserId, accountId },
      options: { method: "GET" }
    });

    return response?.data?.positions || null;
  } catch (error) {
    console.error(`Failed to get account positions for account ${accountId}:`, error);
    throw error;
  }
}

/**
 * Get details for a specific account (fetches more comprehensive account details)
 */
export async function fetchAccountDetails(
  { userId,
    snapTradeUserId,
    accountId,
    idToken,
  }: {
    userId: string,
    snapTradeUserId: string,
    accountId: string,
    idToken: string
  }
) {
  try {
    const response = await callFirebaseFunction<{ accountDetails: Account }>({
      idToken,
      functionName: SNAPTRADE.ACCOUNTS.GET_DETAILS,
      queryParams: {
        userId,
        snapTradeUserId,
        accountId
      },
      options: {
        method: 'GET',
        revalidate: 0 // Don't cache this data
      }
    });
    return response?.data?.accountDetails || null;
  } catch (error) {
    console.error("Error fetching account details:", error);
    throw error;
  }
}

/**
 * Fetch all accounts for a SnapTrade user
 */
export async function fetchSnapTradeAccounts(
  { snapTradeUserId, idToken }: { snapTradeUserId: string, idToken: string }

) {
  try {
    const response = await callFirebaseFunction<{ accounts: Account[] }>({
      idToken,
      functionName: SNAPTRADE.ACCOUNTS.LIST_USER_ACCOUNTS,
      queryParams: {
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

    return response?.data?.accounts || [];
  } catch (error) {
    console.error("Error fetching SnapTrade accounts:", error);
    throw error
  }
}

/**
 * Get account orders
 */
export async function getAccountOrders({
  userId,
  snapTradeUserId,
  accountId,
  idToken,
  state,
  days
}: {
  userId: string,
  snapTradeUserId: string,
  accountId: string,
  idToken: string,
  state?: 'all' | 'open' | 'executed',
  days?: number
}) {
  try {
    const queryParams: Record<string, string> = {
      userId,
      snapTradeUserId,
      accountId
    };

    // Add optional parameters if provided
    if (state) queryParams.state = state;
    if (days) queryParams.days = days.toString();

    const response = await callFirebaseFunction<{ orders: Order[] }>({
      idToken,
      functionName: SNAPTRADE.ACCOUNTS.GET_ACCOUNT_ORDERS,
      queryParams,
      options: { method: "GET" }
    });

    return response?.data?.orders || [];
  } catch (error) {
    console.error(`Failed to get account orders for account ${accountId}:`, error);
    throw error; // Re-throw error to allow error boundaries to catch it
  }
}

/**
 * Get account activities
 */
export async function getAccountActivities({
  userId,
  snapTradeUserId,
  accountId,
  idToken,
  startDate,
  endDate
}: {
  userId: string,
  snapTradeUserId: string,
  accountId: string,
  idToken: string,
  startDate?: string,
  endDate?: string
}) {
  try {
    const queryParams: Record<string, string> = {
      userId,
      snapTradeUserId,
      accountId
    };

    // Add optional parameters if provided
    if (startDate) queryParams.startDate = startDate;
    if (endDate) queryParams.endDate = endDate;

    const response = await callFirebaseFunction<{ activities: PaginatedUniversalActivity }>({
      idToken,
      functionName: SNAPTRADE.ACCOUNTS.GET_ACCOUNT_ACTIVITIES,
      queryParams,
      options: { method: "GET" }
    });

    return response?.data?.activities || [];
  } catch (error) {
    console.error(`Failed to get account activities for account ${accountId}:`, error);
    throw error; // Re-throw error to allow error boundaries to catch it
  }
}
