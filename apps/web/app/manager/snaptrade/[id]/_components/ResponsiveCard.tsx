'use client';

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface DataItem {
    label: string;
    value: ReactNode;
    className?: string;
}

interface ResponsiveCardProps {
    items: DataItem[];
    className?: string;
}

export default function ResponsiveCard({ items, className }: ResponsiveCardProps) {
    return (
        <div className={cn(
            "border rounded-lg shadow-sm bg-card text-card-foreground overflow-hidden mb-3 last:mb-0",
            className
        )}>
            {items.map((item, index) => (
                <div
                    key={index}
                    className={cn(
                        "flex justify-between items-start border-b last:border-0 p-3",
                        item.className
                    )}
                >
                    <span className="text-sm font-medium text-muted-foreground">{item.label}</span>
                    <div className="text-right max-w-[60%] flex-shrink-0">{item.value}</div>
                </div>
            ))}
        </div>
    );
}
