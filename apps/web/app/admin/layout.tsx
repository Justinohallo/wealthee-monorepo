import AdminProtection from "./_components/AdminProtection"
import AdminSidebar from "./_components/AdminSidebar"
import type React from "react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminProtection>
      <div className="flex h-screen bg-gray-100">
        <div className="fixed top-0 left-0 h-full">
          <AdminSidebar />
        </div>
        <div className="flex-1 overflow-auto p-6 pt-20 ml-64">{children}</div>
      </div>
    </AdminProtection>
  )
}

