import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { Card } from "@/components/ui/card";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SimpleColumn {
  key: string;
  label: ReactNode;
  className?: string;
  // Simple flag for mobile visibility
  showOnMobile?: boolean;
}

export interface CellContent {
  id: string;
  [key: string]: ReactNode;
}

interface ResponsiveTableProps {
  // Pre-formatted data with ReactNodes already prepared
  cells: CellContent[];
  columns: SimpleColumn[];
  // Basic customization
  className?: string;
  cardClassName?: string;
  emptyMessage?: ReactNode;
  rowClassName?: string;
  // Display mode control
  forceTableMode?: boolean;
  forceCardMode?: boolean;
  breakpoint?: "sm" | "md" | "lg" | "xl";
}

/**
 * A responsive table component that transforms into cards on mobile screens
 *
 * @example
 * ```tsx
 * // Format your data in advance
 * const cells = data.map(item => ({
 *   id: item.id,
 *   name: <span className="font-medium">{item.name}</span>,
 *   email: item.email,
 *   status: <Badge>{item.status}</Badge>
 * }));
 *
 * const columns = [
 *   { key: 'name', label: 'Name' },
 *   { key: 'email', label: 'Email' },
 *   { key: 'status', label: 'Status' }
 * ];
 *
 * <ResponsiveTable cells={cells} columns={columns} />
 * ```
 */
export function ResponsiveTable({
  cells,
  columns,
  className,
  cardClassName,
  emptyMessage = "No data to display",
  rowClassName,
  forceTableMode = false,
  forceCardMode = false,
  breakpoint = "md"
}: ResponsiveTableProps) {
  if (!cells || cells.length === 0) {
    return (
      <div className="w-full text-center py-8 text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  // Determine the display mode based on props
  const cardMode = forceCardMode || (!forceTableMode && true); // In real usage, we'd use a media query
  const tableMode = forceTableMode || (!forceCardMode && true); // In real usage, we'd use a media query

  return (
    <div className={className}>
      {/* Desktop Table View */}
      <div className={cn(
        "w-full overflow-x-auto",
        !tableMode && "hidden",
        tableMode && !forceTableMode && `hidden ${breakpoint}:block`
      )}>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} className={column.className}>
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {cells.map((cell) => (
              <TableRow key={cell.id} className={rowClassName}>
                {columns.map((column) => (
                  <TableCell key={`${cell.id}-${column.key}`} className={column.className}>
                    {cell[column.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className={cn(
        "space-y-4",
        !cardMode && "hidden",
        cardMode && !forceCardMode && `${breakpoint}:hidden`
      )}>
        {cells.map((cell) => (
          <Card key={cell.id} className={cn("p-4", cardClassName)}>
            {columns
              .filter(col => col.showOnMobile !== false)
              .map((column) => (
                <div
                  key={`card-${cell.id}-${column.key}`}
                  className="flex justify-between py-2 border-b last:border-b-0"
                >
                  <span className="font-medium text-sm text-muted-foreground">
                    {column.label}
                  </span>
                  <span className="text-right">
                    {cell[column.key]}
                  </span>
                </div>
              ))}
          </Card>
        ))}
      </div>
    </div>
  );
}
