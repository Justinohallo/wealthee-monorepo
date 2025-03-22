"use server"

import { PORTFOLIO_MANAGER } from "@/constants/functionNames"
import { callFirebaseFunction } from "@/lib/firebase-functions"
import { revalidatePath } from "next/cache"
export async function registerSnapTradeUser({ displayName, userId, idToken }: { displayName: string, userId: string, idToken: string }) {
  try {
    const result = await callFirebaseFunction({
      idToken,
      functionName: PORTFOLIO_MANAGER.SNAPTRADE.REGISTER_USER_WITH_DISPLAY,
      options: {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ displayName, userId }),
      }
    })

    // Revalidate the SnapTrade user page to reflect the new data
    revalidatePath("/manager/snaptrade-user")

    return { success: true, data: result }
  } catch (error) {
    console.error("Error registering SnapTrade user:", error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

