"use client";

import { cn } from "@/lib/utils";

interface ClientStatusBadgeProps {
    status: string;
    className?: string;
}

export function ClientStatusBadge({ status, className }: ClientStatusBadgeProps) {
    const getStatusClasses = (status: string) => {
        switch (status) {
            case "active":
                return "bg-green-100 text-green-800";
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "inactive":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const displayStatus = status.charAt(0).toUpperCase() + status.slice(1);

    return (
        <span
            className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                getStatusClasses(status),
                className
            )}
        >
            {displayStatus}
        </span>
    );
}
