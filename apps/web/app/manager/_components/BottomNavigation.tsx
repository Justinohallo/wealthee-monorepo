'use client';

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface BottomNavigationProps {
  links: {
    href: string;
    label: string;
    icon: LucideIcon;
  }[];
}

export function BottomNavigation({ links }: BottomNavigationProps) {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 backdrop-blur-sm bg-background/90 border-t border-border shadow-lg">
      <div className="flex items-center justify-around h-16 pb-safe">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full px-2 py-1 relative",
                "transition-colors duration-200",
                isActive
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-label={link.label}
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
              )}
              <link.icon className={cn(
                "h-6 w-6 mb-1",
                isActive ? "fill-primary stroke-primary" : "fill-none"
              )} />
              <span className="text-xs">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
