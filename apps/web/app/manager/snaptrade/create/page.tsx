"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type React from "react"
import { registerSnapTradeUser } from "./actions"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function CreateSnapTradeUserPage() {
  const [displayName, setDisplayName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to register a SnapTrade user.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const idToken = await user.getIdToken()
      const result = await registerSnapTradeUser({ displayName, userId: user.uid, idToken })

      if (result.success) {
        toast({
          title: "Success",
          description: "SnapTrade user registered successfully",
        })
        router.push("/manager/snaptrade")
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to register SnapTrade user",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Register SnapTrade User</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" variant="default" disabled={isLoading}>
              {isLoading ? "Registering..." : "Register"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

