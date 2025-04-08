import { ManagerSidebar, navigationLinks } from "./_components/ManagerSidebar"

import { BottomNavigation } from "./_components/BottomNavigation"
import type React from "react"
import { redirect } from "next/navigation"
import { verifySessionAndGetUser } from "@/lib/server-auth-utils"

export default async function ManagerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await verifySessionAndGetUser();

  // Redirect to login if no session
  if (!session) {
    redirect("/login");
  }

  // Verify user is a portfolio manager
  if (session.decodedClaims.role !== "portfolioManager" && session.decodedClaims.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Desktop sidebar */}
      <ManagerSidebar />

      {/* Main content */}
      <div className="flex-1 overflow-auto pb-20 md:pb-0">
        <main className="p-4 md:p-6 lg:p-8 max-w-screen-2xl mx-auto">{children}</main>
      </div>

      {/* Mobile bottom navigation */}
      <BottomNavigation links={navigationLinks} />
    </div>
  )
}

