import { SNAPTRADE } from "@/constants/functionNames";
import { callFirebaseFunction } from "@/lib/firebase-functions";
import { type Balance, type Account, type AccountHoldingsAccount, type Position } from "snaptrade-typescript-sdk/dist/models";

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
      functionName: 'snaptrade-accounts-getAccountDetails',
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
