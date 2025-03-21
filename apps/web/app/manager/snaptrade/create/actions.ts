"use server"

import { revalidatePath } from "next/cache"

export async function registerSnapTradeUser(displayName: string, userId: string, idToken: string) {
  try {
    const response = await fetch("https://portfoliomanager-registersnaptradeuserwithdisplay-zncz3ts4ka-uc.a.run.app", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ displayName, userId }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()

    // Revalidate the SnapTrade user page to reflect the new data
    revalidatePath("/manager/snaptrade-user")

    return { success: true, data: result }
  } catch (error) {
    console.error("Error registering SnapTrade user:", error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

