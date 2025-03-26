import "@/lib/firebase-admin"
import { cookies } from "next/headers"
import { type UserRole } from "@/types/user"
import { redirect } from "next/navigation"
import { getDashboardUrl } from "./auth-utils"
import { getAuth } from "firebase-admin/auth"

export const verifySessionAndGetUser = async () => {
  const cookieStore = await cookies()
  const sessionCookie = await cookieStore.get("__session")?.value
  const token = await cookieStore.get("idToken")?.value
  if (!sessionCookie) {
    console.log("No session cookie found")
    return null
  }

  try {
    const decodedClaims = await getAuth().verifySessionCookie(sessionCookie, true)
    return { decodedClaims, token }
  } catch (error) {
    console.error("Session verification error:", error)
    return null
  }
}

/**
 * Gets the user role from cookies in server components
 * @returns The user role from cookies
 */
export const getUserRole = async (): Promise<UserRole | null> => {
  const cookieStore = await cookies()
  const role = cookieStore.get("userRole")?.value as UserRole
  return role || null
}

/**
 * Gets the user ID from cookies in server components
 * @returns The user ID from cookies
 */
export const getUserId = async (): Promise<string | null> => {
  const cookieStore = await cookies()
  const userId = cookieStore.get("userId")?.value
  return userId || null
}

/**
 * Checks if the user is authenticated in server components
 * @returns Boolean indicating if the user is authenticated
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const cookieStore = await cookies()
  return !!cookieStore.get("__session")?.value
}

/**
 * Checks if the user has access to a specific route based on their role
 * @param allowedRoles Array of roles that have access to the route
 * @returns Boolean indicating if the user has access
 */
export const requireRole = async (allowedRoles: UserRole[]): Promise<void> => {
  const role = await getUserRole()

  // If not authenticated, redirect to login
  if (!(await isAuthenticated())) {
    redirect("/login")
  }

  // If role is not in allowed roles, redirect to appropriate dashboard
  if (!role || !allowedRoles.includes(role)) {
    redirect(getDashboardUrl(role))
  }
}

/**
 * Redirects to the appropriate dashboard based on user role
 * Use this in pages that should redirect to the dashboard if the user is already logged in
 */
export const redirectToDashboardIfAuthenticated = async (): Promise<void> => {
  if (await isAuthenticated()) {
    const role = await getUserRole()
    redirect(getDashboardUrl(role))
  }
}
