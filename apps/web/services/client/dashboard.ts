import { Account } from "@/types/snaptrade";
import { CLIENT } from "@/constants/functionNames";
import { callFirebaseFunction } from "@/lib/firebase-functions";

/**
 * Get the primary SnapTrade account of the client's portfolio manager
 * @param clientId The client's user ID
 * @param idToken Authentication token
 * @returns The portfolio manager's primary account or null if not found
 */
export async function getManagerPrimaryAccount(
  clientId: string,
  idToken: string
): Promise<Account | null> {
  try {
    const response = await callFirebaseFunction<{ accountDetails: Account }>({
      functionName: CLIENT.DASHBOARD.GET_MANAGER_PRIMARY_ACCOUNT,
      idToken,
      queryParams: { clientId },
      options: {
        method: "GET",
        revalidate: 60 // Cache for 60 seconds
      }
    });
    return response?.data?.accountDetails || null;
  } catch (error) {
    console.error("Error fetching manager's primary account:", error);
    return null;
  }
}
