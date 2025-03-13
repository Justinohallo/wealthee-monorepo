import { type UserRole } from "@/types/user"

/**
 * Returns the appropriate dashboard URL based on user role
 * @param role The user's role
 * @returns The dashboard URL for the given role
 */
export const getDashboardUrl = (role: UserRole): string => {
  switch (role) {
    case "admin":
      return "/admin"
    case "portfolioManager":
      return "/manager"
    case "client":
      return "/client"
    default:
      console.warn("Unknown user role:", role)
      return "/client" // Default fallback
  }
}

/**
 * Checks if the user has access to a specific route based on their role
 * @param role The user's role
 * @param path The current path
 * @returns Boolean indicating if the user has access
 */
export const hasRouteAccess = (role: UserRole, path: string): boolean => {
  if (!role) return false

  // Admin has access to all routes
  if (role === "admin") return true

  // Portfolio Manager has access to /manager routes
  if (role === "portfolioManager" && path.startsWith("/manager")) return true

  // Client has access to /client routes
  if (role === "client" && path.startsWith("/client")) return true

  // Public routes that everyone has access to
  const publicRoutes = ["/", "/login", "/contact", "/pricing", "/forgot-password"]
  if (publicRoutes.includes(path)) return true

  return false
}
