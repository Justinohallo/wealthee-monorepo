"use server"

import { revalidatePath } from "next/cache"

export async function createPortfolioManager(data: { displayName: string; email: string; password: string }) {
  try {
    const response = await fetch("https://portfoliomanager-createportfoliomanager-zncz3ts4ka-uc.a.run.app", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()

    // Revalidate the portfolio managers page to reflect the new data
    revalidatePath("/admin/portfolio-managers")

    return { success: true, data: result }
  } catch (error) {
    console.error("Failed to create portfolio manager:", error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

