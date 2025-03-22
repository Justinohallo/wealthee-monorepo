"use server"

import { PORTFOLIO_MANAGER } from "../../../../constants/functionNames";
import { callFirebaseFunction } from "@/lib/firebase-functions"
import { revalidatePath } from "next/cache"

export async function createPortfolioManager(data: { displayName: string; email: string; password: string }, idToken: string) {
  try {
    const result = await callFirebaseFunction({
      idToken,
      functionName: PORTFOLIO_MANAGER.USERS.CREATE,
      options: {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    })

    // Revalidate the portfolio managers page to reflect the new data
    revalidatePath("/admin/portfolio-managers")

    return { success: true, data: result }
  } catch (error) {
    console.error("Failed to create portfolio manager:", error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

