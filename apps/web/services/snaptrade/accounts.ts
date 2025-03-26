import { SNAPTRADE } from "@/constants/functionNames";
import { callFirebaseFunction } from "@/lib/firebase-functions";
import { type Account } from "snaptrade-typescript-sdk";

/**
 * List all accounts for a SnapTrade user
 */
export async function listUserAccounts(
  userId: string,
  snapTradeUserId: string,
  idToken: string
) {
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
    console.error("Failed to list user accounts:", error);
    return [];
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
    const response = await callFirebaseFunction<AccountBalance[]>({
      idToken,
      functionName: SNAPTRADE.LEGACY.GET_USER_ACCOUNT_BALANCES,
      queryParams: { userId, snapTradeUserId, accountId },
      options: { method: "GET" }
    });

    return response?.data || null;
  } catch (error) {
    console.error("Failed to get account balances:", error);
    return null;
  }
}

/**
 * Get account holdings
 */
export async function getAccountHoldings(
  userId: string,
  snapTradeUserId: string,
  accountId: string,
  idToken: string
): Promise<AccountHoldingsResponse | null> {
  try {
    const response = await callFirebaseFunction<{ data: AccountHoldingsResponse }>({
      idToken,
      functionName: SNAPTRADE.LEGACY.GET_USER_HOLDINGS,
      queryParams: { userId, snapTradeUserId, accountId },
      options: { method: "GET" }
    });

    return response?.data?.data || null;
  } catch (error) {
    console.error("Failed to get account holdings:", error);
    return null;
  }
}

/**
 * Get details for a specific account (fetches more comprehensive account details)
 */
export async function fetchAccountDetails(
  userId: string,
  snapTradeUserId: string,
  accountId: string,
  idToken: string
): Promise<SnapTradeAccount | null> {
  try {
    const response = await callFirebaseFunction<{ accountDetails: SnapTradeAccount }>({
      idToken,
      functionName: 'portfoliomanager-getsnaptradeuseraccountdetails',
      queryParams: {
        userId,
        snapTradeUserId,
        accountId
      },
      options: {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'GET',
        revalidate: 0 // Don't cache this data
      }
    });

    return response?.data?.accountDetails || null;
  } catch (error) {
    console.error("Error fetching account details:", error);
    return null;
  }
}

/**
 * Fetch all accounts for a SnapTrade user
 */
export async function fetchSnapTradeAccounts(
  userId: string,
  snapTradeUserId: string,
  idToken: string
): Promise<SnapTradeAccount[]> {
  try {
    const response = await callFirebaseFunction<{ accounts: SnapTradeAccount[] }>({
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
    return [];
  }
}
