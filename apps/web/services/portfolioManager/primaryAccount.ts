// This space intentionally left blank

import { PORTFOLIO_MANAGER } from "@/constants/functionNames"; // Updated import
import { callFirebaseFunction } from "@/lib/firebase-functions";

interface SetPrimaryAccountParams {
  portfolioManagerId: string; // Now explicitly required
  accountId: string;
  idToken: string;
}

// Response type expected from the GET function
interface GetPrimaryAccountResponse {
  portfolioManagerId: string;
  primaryAccountId: string | null;
}

/**
 * Sets an account as the primary account for a Portfolio Manager82
 */
export async function setPrimaryAccount({
  portfolioManagerId,
  accountId,
  idToken
}: SetPrimaryAccountParams): Promise<void> {
  console.log({ portfolioManagerId, accountId })
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
        accountId
      }) // Pass both portfolioManagerId and accountId in body
    }
  });
  // Consider returning a success indicator if needed by callers
}

/**
 * Gets the primary account ID for a Portfolio Manager
 */
export async function getPrimaryAccount(
  portfolioManagerId: string,
  idToken: string
): Promise<string | null> {
  // No try-catch needed here
  const result = await callFirebaseFunction<GetPrimaryAccountResponse>({
    idToken,
    functionName: PORTFOLIO_MANAGER.PRIMARY_ACCOUNT.GET, // Corrected function name
    queryParams: { portfolioManagerId }, // Add portfolioManagerId as query param
    options: { method: "GET", revalidate: 0 } // No revalidation for user-specific data
  });
  // Return the primaryAccountId from the response data
  return result?.data?.primaryAccountId || null;
}
