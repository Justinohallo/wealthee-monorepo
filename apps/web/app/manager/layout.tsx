import ManagerSidebar from "./_components/ManagerSidebar"
import type React from "react"

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      <ManagerSidebar />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  )
}

