'use client';

import { ReactNode } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ResponsiveTable, type SimpleColumn, type CellContent } from "@/components/ui/responsive-table";

interface ResponsiveTableClientProps<T = Record<string, unknown>> {
  data: T[];
  mobileColumns: SimpleColumn[];
  desktopColumns: SimpleColumn[];
  emptyMessage: ReactNode;
  keyField: string;
  rowClassName?: string;
}

/**
 * Client component for responsive tables
 * Handles switching between mobile and desktop column sets
 */
export function ResponsiveTableClient<T extends Record<string, unknown>>({
  data,
  mobileColumns,
  desktopColumns,
  emptyMessage,
  keyField,
  rowClassName
}: ResponsiveTableClientProps<T>) {
  const isMobile = useMediaQuery("(max-width: 767px)");

  // Transform data into cell content format - with proper type casting
  const cells: CellContent[] = data.map(item => {
    const cell: Record<string, ReactNode> = {
      id: String(item[keyField] || Math.random().toString())
    };

    // Add all properties that appear in our columns
    const allColumns = [...mobileColumns, ...desktopColumns];
    allColumns.forEach(column => {
      if (item[column.key] !== undefined) {
        cell[column.key] = item[column.key] as ReactNode;
      }
    });

    return cell as CellContent;
  });

  return (
    <div className="overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0">
      <ResponsiveTable
        cells={cells}
        columns={isMobile ? mobileColumns : desktopColumns}
        emptyMessage={emptyMessage}
        rowClassName={rowClassName}
        forceTableMode={!isMobile}
        forceCardMode={isMobile}
      />
    </div>
  );
}
