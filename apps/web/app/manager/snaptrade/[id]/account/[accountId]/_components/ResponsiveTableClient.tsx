'use client';

import { ReactNode } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ResponsiveTable, type Column } from "@/components/ui/responsive-table";

interface ResponsiveTableClientProps<T = any> {
    data: T[];
    mobileColumns: Column<T>[];
    desktopColumns: Column<T>[];
    emptyMessage: ReactNode;
    keyField: string;
    rowClassName?: string;
}

/**
 * Client component for responsive tables
 * Handles switching between mobile and desktop column sets
 */
export function ResponsiveTableClient<T extends Record<string, any>>({
    data,
    mobileColumns,
    desktopColumns,
    emptyMessage,
    keyField,
    rowClassName
}: ResponsiveTableClientProps<T>) {
    const isMobile = useMediaQuery("(max-width: 767px)");

    // Use the appropriate columns based on screen size
    const columns = isMobile ? mobileColumns : desktopColumns;

    return (
        <div className="overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0">
            <ResponsiveTable
                data={data}
                columns={columns}
                emptyMessage={emptyMessage}
                keyField={keyField}
                rowClassName={rowClassName}
                forceTableMode={!isMobile}
                forceCardMode={isMobile}
            />
        </div>
    );
}
