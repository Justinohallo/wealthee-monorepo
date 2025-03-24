"use server"

import { SNAPTRADE } from "@/constants/functionNames"
import { callFirebaseFunction } from "@/lib/firebase-functions"
import { revalidatePath } from "next/cache"

export async function registerSnapTradeUser({
  displayName,
  userId,
  idToken
}: {
  displayName: string;
  userId: string;
  idToken: string;
}) {
  try {
    // Make a call to the new SnapTrade user registration function
    const result = await callFirebaseFunction({
      idToken,
      functionName: SNAPTRADE.USERS.REGISTER,
      options: {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          displayName,
          portfolioManagerId: userId,
        }),
      }
    })

    // Revalidate the SnapTrade users page
    revalidatePath("/manager/snaptrade")

    return { success: true, data: result }
  } catch (error) {
    console.error("Failed to register SnapTrade user:", error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

