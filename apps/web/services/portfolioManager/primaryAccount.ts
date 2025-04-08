// This space intentionally left blank

import { PORTFOLIO_MANAGER } from "@/constants/functionNames"; // Updated import
import { callFirebaseFunction } from "@/lib/firebase-functions";

interface SetPrimaryAccountParams {
  portfolioManagerId: string; // Now explicitly required
  accountId: string;
  snapTradeUserId: string;
  idToken: string;
}

export interface PrimaryAccountData {
  accountId: string;
  snapTradeUserId: string;
  updatedAt?: string;
}

/**
 * Sets an account as the primary account for a Portfolio Manager
 */
export async function setPrimaryAccount({
  portfolioManagerId,
  accountId,
  snapTradeUserId,
  idToken
}: SetPrimaryAccountParams): Promise<void> {
  // No try-catch needed here, callFirebaseFunction handles errors
  await callFirebaseFunction<void>({ // Explicit void return type
    idToken,
    functionName: PORTFOLIO_MANAGER.PRIMARY_ACCOUNT.SET, // Corrected function name
    options: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        portfolioManagerId,
        accountId,
        snapTradeUserId
      })
    }
  });
  // Consider returning a success indicator if needed by callers
}
type PrimaryAccountResponse = {
  success: boolean;
  data: {
    portfolioManagerId: string;
    primaryAccount: PrimaryAccountData | null;
  };
  timestamp: string;
};
/**
 * Gets the primary account data for a Portfolio Manager
 */
export async function getPrimaryAccount(
  portfolioManagerId: string,
  idToken: string
): Promise<PrimaryAccountData | null> {
  // Use type assertion to tell TypeScript about the response structure


  try {
    const response = await callFirebaseFunction<{
      portfolioManagerId: string;
      primaryAccount: PrimaryAccountData | null;
    }>({
      idToken,
      functionName: PORTFOLIO_MANAGER.PRIMARY_ACCOUNT.GET,
      queryParams: { portfolioManagerId },
      options: { method: "GET", revalidate: 0 }
    });

    // Type assertion to help TypeScript
    const typedResponse = response;
    return typedResponse?.data?.primaryAccount || null;
  } catch (error) {
    console.error("Error fetching primary account:", error);
    return null;
  }
}
