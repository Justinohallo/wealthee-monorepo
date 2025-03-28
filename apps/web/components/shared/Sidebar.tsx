"use client"

import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
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
        <div className={cn(
            "bg-card text-card-foreground shadow-md h-screen hidden md:block w-64",
            className
        )}>
            <div className="p-4">
                <h1 className="text-2xl font-bold">{title}</h1>
            </div>
            <nav className="mt-6 space-y-1 px-2">
                {links.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            "flex items-center py-3 px-4 rounded-md transition-colors",
                            pathname === link.href || pathname.startsWith(`${link.href}/`)
                                ? "bg-primary/10 text-primary"
                                : "hover:bg-muted"
                        )}
                    >
                        <link.icon className="mr-3 h-5 w-5" />
                        {link.label}
                    </Link>
                ))}
            </nav>
        </div>
    )
}
