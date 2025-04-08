"use client";

import { LayoutDashboard, LogOut, Settings, User } from "lucide-react";

import { Button } from "@/components/ui/button";
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
    },
  ];

  return (
    <div className="w-64 h-screen p-4 border-r flex flex-col">
      <div className="flex items-center gap-2 py-4 px-2">
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
          <User className="h-4 w-4" />
        </div>
        <div>
          <h2 className="font-medium text-sm">Client Portal</h2>
          <p className="text-xs text-muted-foreground">View your portfolio</p>
        </div>
      </div>

      <nav className="mt-8 flex-1">
        <ul className="space-y-2">
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
        </ul>
      </nav>

      <div className="mt-auto pt-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-sm"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </div>
  );
}
