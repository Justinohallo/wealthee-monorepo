"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PortfolioManager {
  id: string
  name: string
  email: string
  clientCount: number
  totalAUM: number
}

export default function EditPortfolioManagerForm({ manager }: { manager: PortfolioManager }) {
  const [name, setName] = useState(manager.name)
  const [email, setEmail] = useState(manager.email)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send a request to your API to update the manager
    console.log("Updating manager:", { id: manager.id, name, email })
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    router.push("/admin/portfolio-managers")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <Button type="submit">Update Manager</Button>
    </form>
  )
}

