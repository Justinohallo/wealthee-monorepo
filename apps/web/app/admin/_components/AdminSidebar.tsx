"use client"

import { Home, UserPlus, Users } from "lucide-react"

import Sidebar from "@/components/shared/Sidebar"

const links = [
  { href: "/admin", label: "Dashboard", icon: Home },
  { href: "/admin/portfolio-managers", label: "Portfolio Managers", icon: Users },
  { href: "/admin/portfolio-managers/create", label: "Create Manager", icon: UserPlus },
]

export default function AdminSidebar() {
  return <Sidebar title="Admin Panel" links={links} />
}

