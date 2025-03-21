"use client"

import { BarChart, Home, Users } from "lucide-react"

import Sidebar from "@/components/shared/Sidebar"

const links = [
  { href: "/manager", label: "Dashboard", icon: Home },
  { href: "/manager/clients", label: "Clients", icon: Users },
  { href: "/manager/snaptrade", label: "Snaptrade", icon: BarChart },
]

export default function ManagerSidebar() {
  return <Sidebar title="Wealthee" links={links} />
}
