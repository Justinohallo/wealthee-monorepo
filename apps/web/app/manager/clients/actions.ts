"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

const ClientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  initialInvestment: z.string().min(1, "Initial investment is required"),
})

export async function createClient(formData: FormData) {
  try {
    // Validate the form data
    ClientSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      initialInvestment: formData.get("initialInvestment"),
    })

    // Here you would typically save to your database
    // For example: await db.client.create({ data: validatedFields })

    // Simulate database operation
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Revalidate the clients page
    revalidatePath("/clients")

    return { status: "success", message: "Client created successfully" }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: "error", message: error.errors[0]?.message }
    }
    return { status: "error", message: "Failed to create client" }
  }
}

