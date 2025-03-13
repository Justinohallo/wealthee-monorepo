"use client"

import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { usePathname } from "next/navigation"

interface SidebarLink {
    href: string
    label: string
    icon: LucideIcon
}

interface SidebarProps {
    title: string
    links: SidebarLink[]
}

export default function Sidebar({ title, links, className }: SidebarProps & { className?: string }) {
    const pathname = usePathname()

    return (
        <div className={`bg-white shadow-md ${className}`}>
            <div className="p-4">
                <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
            </div>
            <nav className="mt-6">
                {links.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center py-2 px-4 ${pathname === link.href ? "bg-gray-200" : ""}`}
                    >
                        <link.icon className="mr-3 h-5 w-5" />
                        {link.label}
                    </Link>
                ))}
            </nav>
        </div>
    )
}
