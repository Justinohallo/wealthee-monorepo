import { Button } from "@/components/ui/button";
import Image from "next/image";

interface User {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface DashboardHeaderProps {
  user: User;
  portfolioManagerImage?: string;
  portfolioManagerName?: string;
}

export function DashboardHeader({
  user,
  portfolioManagerImage,
  portfolioManagerName
}: DashboardHeaderProps) {
  return (
    <header className="flex flex-col-reverse md:flex-row md:justify-between md:items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user?.name || "Investor"}</h1>
        <p className="text-muted-foreground">Here&apos;s the latest on your portfolio</p>
      </div>

      {portfolioManagerName && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {portfolioManagerImage && (
              <div className="relative h-10 w-10">
                <Image
                  src={portfolioManagerImage}
                  alt={portfolioManagerName}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
            )}
            <div>
              <p className="text-sm font-medium">Your Portfolio Manager</p>
              <p className="text-sm text-muted-foreground">{portfolioManagerName}</p>
            </div>
          </div>
          <Button size="sm" variant="outline">Message</Button>
        </div>
      )}
    </header>
  );
}
