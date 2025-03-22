"use server"

import { PortfolioManager } from "@/types/portfolioManager"
import { callFirebaseFunction } from "@/lib/firebase-functions"

export async function fetchPortfolioManagers(): Promise<PortfolioManager[]> {
  try {
    const data = await callFirebaseFunction<PortfolioManager[]>({
      functionName: 'portfoliomanager-listportfoliomanagers',
      options: {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    })

    if (!data) {
      return [];
    }

    return data.map((manager: PortfolioManager) => ({
      uid: manager.uid,
      email: manager.email,
      emailVerified: manager.emailVerified,
      displayName: manager.displayName,
      disabled: manager.disabled,
      metadata: {
        creationTime: manager.metadata.creationTime,
        lastSignInTime: manager.metadata.lastSignInTime,
        lastRefreshTime: manager.metadata.lastRefreshTime,
      },
      customClaims: manager.customClaims,
      tokensValidAfterTime: manager.tokensValidAfterTime,
      providerData: manager.providerData,
    }))
  } catch (error) {
    console.error("Failed to fetch portfolio managers:", error)
    throw error
  }
}

