"use client";

import { LayoutDashboard, Settings } from "lucide-react";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function ClientBottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Dashboard",
      href: "/client/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Settings",
      href: "/client/settings",
      icon: Settings,
    },
  ];

  return (
    <nav className="flex items-center justify-around py-2">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex flex-col items-center justify-center p-2 rounded-md w-16 h-16",
            pathname === item.href
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <item.icon className="h-5 w-5 mb-1" />
          <span className="text-xs">{item.name}</span>
        </Link>
      ))}
    </nav>
  );
}
