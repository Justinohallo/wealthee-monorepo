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
  // Flag to render this column as a footer in card view
  isCardFooter?: boolean;
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
 *   { key: 'status', label: 'Status' },
 *   { key: 'actions', label: 'Actions', isCardFooter: true }
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
  const cardMode = forceCardMode || (!forceTableMode && true);
  const tableMode = forceTableMode || (!forceCardMode && true);

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
        "space-y-6", // Increased space between cards
        !cardMode && "hidden",
        cardMode && !forceCardMode && `${breakpoint}:hidden`
      )}>
        {cells.map((cell, cardIndex) => (
          <Card
            key={cell.id}
            className={cn(
              "border bg-card shadow-sm",
              cardIndex < cells.length - 1 ? "mb-4" : "",
              cardClassName
            )}
          >
            {/* Regular card content */}
            <div className="p-4">
              {columns
                .filter(col => col.showOnMobile !== false && !col.isCardFooter)
                .map((column, index, arr) => (
                  <div
                    key={`card-${cell.id}-${column.key}`}
                    className={cn(
                      "flex justify-between py-2",
                      // Only add border if not the last item
                      index < arr.length - 1 ? "border-b" : ""
                    )}
                  >
                    <span className="font-medium text-sm text-muted-foreground">
                      {column.label}
                    </span>
                    <span className="text-right">
                      {cell[column.key]}
                    </span>
                  </div>
                ))}
            </div>

            {/* Footer actions if any columns are marked as isCardFooter */}
            {columns.some(col => col.isCardFooter) && (
              <div className="px-4 pt-2 pb-4 border-t">
                {columns
                  .filter(col => col.isCardFooter)
                  .map((column) => (
                    <div key={`footer-${cell.id}-${column.key}`} className="w-full">
                      {cell[column.key]}
                    </div>
                  ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
