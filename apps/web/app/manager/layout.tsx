import { ManagerSidebar, navigationLinks } from "./_components/ManagerSidebar"

import { BottomNavigation } from "./_components/BottomNavigation"
import type React from "react"

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode
}) {
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

