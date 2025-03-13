"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface PortfolioManager {
  id: string
  name: string
  email: string
  clientCount: number
  totalAUM: number
}

export default function DeletePortfolioManagerForm({ manager }: { manager: PortfolioManager }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setIsDeleting(true)
    // Here you would typically send a request to your API to delete the manager
    console.log("Deleting manager:", manager.id)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    router.push("/admin/portfolio-managers")
  }

  return (
    <div>
      <p className="mb-4">Are you sure you want to delete the portfolio manager {manager.name}?</p>
      <Button onClick={handleDelete} disabled={isDeleting} variant="destructive">
        {isDeleting ? "Deleting..." : "Confirm Delete"}
      </Button>
    </div>
  )
}

