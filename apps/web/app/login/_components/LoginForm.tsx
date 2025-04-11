"use client"

import Link from "next/link"
import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { auth } from "@/lib/firebase"
import { getDashboardUrl } from "@/lib/auth-utils"
import { signInWithEmailAndPassword, signOut } from "firebase/auth"
import { type UserRole } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"

export const LoginForm = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const idToken = await userCredential.user.getIdToken()
      const idTokenResult = await userCredential.user.getIdTokenResult()
      const customClaims = idTokenResult.claims
      console.log({ idToken, idTokenResult, customClaims })
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      })
      // Interesting Edge Case - If our Endpoint is a failure, we cannot proceed.
      // Technically the user will be logged in through Firebase.
      // However, we need them to have a session via out endpoint.
      // We may want to use a custom login system via an endpoint to handle this
      // rather than using Firebase's auth.
      if (!response.ok) {
        await signOut(auth)
        toast({
          title: "Error",
          description: "Login failed. Please check your credentials and try again.",
          variant: "destructive",
        })
      }

      if (response.ok) {
        const data = await response.json()

        // Store user role in localStorage for easy access if needed
        const userRole = data.user?.role || customClaims?.role as UserRole
        if (userRole) {
          localStorage.setItem("userRole", userRole)
        }

        toast({
          title: "Success",
          description: "You have successfully logged in.",
          variant: "default",
        })

        // Redirect based on user role using the utility function
        const dashboardUrl = getDashboardUrl(userRole)
        router.push(dashboardUrl)
      }
    } catch (error) {
      console.error("Login failed:", error)
      toast({
        title: "Error",
        description: "Login failed. Please check your credentials and try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl text-center">Welcome back</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email address
            </Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                <Mail className="h-4 w-4" />
              </div>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-11 bg-white"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Link href="/forgot-password" className="text-xs font-medium text-blue-600 hover:text-blue-800">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                <Lock className="h-4 w-4" />
              </div>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 h-11 bg-white"
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center">
            <Input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
            />
            <Label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Remember me
            </Label>
          </div>
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-blue-600 hover:bg-blue-700"
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

