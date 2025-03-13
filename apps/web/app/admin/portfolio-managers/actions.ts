"use server"

import { PortfolioManager } from "@/types/portfolioManager"

export async function fetchPortfolioManagers(): Promise<PortfolioManager[]> {
  try {
    const response = await fetch("https://portfoliomanager-listportfoliomanagers-zncz3ts4ka-uc.a.run.app/")
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()

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

