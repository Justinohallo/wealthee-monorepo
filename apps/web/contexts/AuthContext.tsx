"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { type User, onAuthStateChanged, getIdTokenResult } from "firebase/auth"
import { auth } from "../lib/firebase"

export type UserRole = "admin" | "portfolioManager" | "client" | null

type AuthContextType = {
  user: User | null
  loading: boolean
  userRole: UserRole
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, userRole: null })

export const useAuth = () => useContext(AuthContext)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<UserRole>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      if (user) {
        try {
          const idTokenResult = await getIdTokenResult(user, true)
          const role = idTokenResult.claims.role as UserRole
          setUserRole(role)
        } catch (error) {
          console.error("Error fetching user role:", error)
          setUserRole(null)
        }
      } else {
        setUserRole(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return <AuthContext.Provider value={{ user, loading, userRole }}>{children}</AuthContext.Provider>
}

