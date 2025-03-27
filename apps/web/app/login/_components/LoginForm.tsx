"use client"


import Link from "next/link"
import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { auth } from "@/lib/firebase"
import { getDashboardUrl } from "@/lib/auth-utils"
import { signInWithEmailAndPassword, signOut } from "firebase/auth"
import { theme } from "@/styles/theme"
import { type UserRole } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useToast } from '@/hooks/use-toast'

export const LoginForm = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
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
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div>
          <Label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
            Email address
          </Label>
          <div className="mt-2">
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-lg border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-textBlue sm:text-sm sm:leading-6"
              placeholder="Enter your email"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
            Password
          </Label>
          <div className="mt-2">
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-lg border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-textBlue sm:text-sm sm:leading-6"
              placeholder="Enter your password"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-textBlue focus:ring-textBlue"
            />
            <Label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
              Remember me
            </Label>
          </div>

          <div className="text-sm">
            <Link href="/forgot-password" className="font-medium hover:opacity-80" style={{ color: theme.textBlue }}>
              Forgot your password?
            </Link>
          </div>
        </div>

        <div>
          <Button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: theme.textBlue }}
            className="flex w-full justify-center rounded-lg px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-textBlue"
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </div>
      </div>
    </form>
  )
}

