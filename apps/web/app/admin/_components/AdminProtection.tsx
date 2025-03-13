"use client"

import type React from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminProtection({ children }: { children: React.ReactNode }) {
    const { user, loading, userRole } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push("/login")
            } else if (userRole !== "admin") {
                router.push("/")
            }
        }
    }, [user, loading, userRole, router])

    if (loading) {
        return <div>Loading...</div>
    }

    if (!user || userRole !== "admin") {
        return null
    }

    return <>{children}</>
}
