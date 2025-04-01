"use client";

import { Button } from "@/components/ui/button";
import { EyeIcon } from "lucide-react";
import Link from "next/link";

interface ViewClientButtonProps {
  clientId: string;
}

export function ViewClientButton({ clientId }: ViewClientButtonProps) {
  return (
    <Link href={`/manager/clients/${clientId}`}>
      <Button variant="ghost" size="icon">
        <EyeIcon className="h-4 w-4" />
        <span className="sr-only">View Client</span>
      </Button>
    </Link>
  );
}
