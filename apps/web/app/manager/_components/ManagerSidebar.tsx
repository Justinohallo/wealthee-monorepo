"use client"

import { BarChart, Home, Users } from "lucide-react"

import Sidebar from "@/components/shared/Sidebar"

// Export the navigation links for reuse
export const navigationLinks = [
  { href: "/manager", label: "Dashboard", icon: Home },
  { href: "/manager/clients", label: "Clients", icon: Users },
  { href: "/manager/snaptrade", label: "Snaptrade", icon: BarChart },
]

export function ManagerSidebar() {
  return <Sidebar title="Wealthee" links={navigationLinks} />
}
