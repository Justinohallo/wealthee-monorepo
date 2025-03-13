"use server"

import { PortfolioManager } from "@/types/portfolioManager"

export async function fetchPortfolioManager(uid: string): Promise<PortfolioManager> {
  try {
    const response = await fetch(`https://portfoliomanager-getportfoliomanager-zncz3ts4ka-uc.a.run.app/?uid=${uid}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data as PortfolioManager
  } catch (error) {
    console.error("Failed to fetch portfolio manager:", error)
    throw error
  }
}

