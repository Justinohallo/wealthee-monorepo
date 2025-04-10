"use client";

import { LayoutDashboard, LogOut, Settings, User } from "lucide-react";

import Link from "next/link";
import { auth } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import { signOut } from "firebase/auth";
import { usePathname } from "next/navigation";

export function ClientSidebar() {
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut(auth);
  };

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
    }
  ];

  return (
    <aside className="w-64 fixed left-0 top-[64px] h-[calc(100vh-64px)] border-r bg-white overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-2 py-4 px-6 border-b">
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
          <User className="h-4 w-4" />
        </div>
        <div>
          <h2 className="font-medium text-sm">Client Portal</h2>
          <p className="text-xs text-muted-foreground">View your portfolio</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-2">
          {/* Regular nav items */}
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>
                <span className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  pathname === item.href
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent/50"
                )}>
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </span>
              </Link>
            </li>
          ))}

          {/* Sign out button as nav item */}
          <li>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors hover:bg-accent/50"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
