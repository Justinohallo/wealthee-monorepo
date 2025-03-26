import { PORTFOLIO_MANAGER } from "@/constants/functionNames";
import { callFirebaseFunction } from "@/lib/firebase-functions";

/**
 * Portfolio Manager Users related service functions
 */

export interface PortfolioManager {
    uid: string;
    email: string;
    displayName: string;
    emailVerified: boolean;
    disabled: boolean;
    metadata: {
        creationTime: string;
        lastSignInTime: string;
        lastRefreshTime: string;
    };
    customClaims: {
        role: string;
    };
    tokensValidAfterTime: string;
    providerData: Array<{
        uid: string;
        displayName: string;
        email: string;
        providerId: string;
    }>;
}

export interface CreatePortfolioManagerParams {
    displayName: string;
    email: string;
    password: string;
}

/**
 * Create a new portfolio manager
 */
export async function createPortfolioManager(
    params: CreatePortfolioManagerParams,
    idToken: string
): Promise<PortfolioManager | null> {
    try {
        const response = await callFirebaseFunction<{ manager: PortfolioManager }>({
            idToken,
            functionName: PORTFOLIO_MANAGER.USERS.CREATE,
            options: {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(params)
            }
        });

        return response?.data?.manager || null;
    } catch (error) {
        console.error("Failed to create portfolio manager:", error);
        throw error;
    }
}

/**
 * List all portfolio managers
 */
export async function listPortfolioManagers(
    idToken: string
): Promise<PortfolioManager[]> {
    try {
        const response = await callFirebaseFunction<{ managers: PortfolioManager[] }>({
            idToken,
            functionName: PORTFOLIO_MANAGER.USERS.LIST,
            options: {
                method: "GET",
                revalidate: 0 // Don't cache user data
            }
        });

        return response?.data?.managers || [];
    } catch (error) {
        console.error("Failed to list portfolio managers:", error);
        return [];
    }
}

/**
 * Get a portfolio manager by ID
 */
export async function getPortfolioManager(
    managerId: string,
    idToken: string
): Promise<PortfolioManager | null> {
    try {
        const response = await callFirebaseFunction<{ manager: PortfolioManager }>({
            idToken,
            functionName: PORTFOLIO_MANAGER.USERS.GET,
            queryParams: { managerId },
            options: { method: "GET" }
        });

        return response?.data?.manager || null;
    } catch (error) {
        console.error("Failed to get portfolio manager:", error);
        return null;
    }
}

/**
 * Update a portfolio manager
 */
export async function updatePortfolioManager(
    managerId: string,
    updates: Partial<CreatePortfolioManagerParams>,
    idToken: string
): Promise<PortfolioManager | null> {
    try {
        const response = await callFirebaseFunction<{ manager: PortfolioManager }>({
            idToken,
            functionName: PORTFOLIO_MANAGER.USERS.UPDATE,
            queryParams: { managerId },
            options: {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates)
            }
        });

        return response?.data?.manager || null;
    } catch (error) {
        console.error("Failed to update portfolio manager:", error);
        return null;
    }
}
