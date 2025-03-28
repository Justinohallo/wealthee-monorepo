import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface Column<T = any> {
  key: string;
  label: React.ReactNode;
  // Optional render function to customize how the value is displayed
  render?: (value: any, row: T) => React.ReactNode;
  // Whether to show this column on mobile cards (defaults to true)
  showOnMobile?: boolean;
  // Custom class for this column
  className?: string;
}

interface ResponsiveTableProps<T = any> {
  data: T[];
  columns: Column<T>[];
  className?: string;
  // Optional settings
  cardClassName?: string;
  emptyMessage?: React.ReactNode;
  keyField?: string | ((row: T) => string);
  rowClassName?: string;
  // Option to force table or card mode
  forceTableMode?: boolean;
  forceCardMode?: boolean;
  // Breakpoint where we switch from cards to table (default: md)
  breakpoint?: "sm" | "md" | "lg" | "xl";
}

/**
 * A responsive table component that transforms into cards on mobile screens
 *
 * @example
 * ```tsx
 * const columns = [
 *   { key: 'name', label: 'Name' },
 *   { key: 'email', label: 'Email' },
 *   {
 *     key: 'status',
 *     label: 'Status',
 *     render: (value) => <Badge>{value}</Badge>
 *   }
 * ];
 *
 * <ResponsiveTable data={users} columns={columns} />
 * ```
 */
export function ResponsiveTable<T extends Record<string, any>>({
  data,
  columns,
  className,
  cardClassName,
  emptyMessage = "No data to display",
  keyField = "id",
  rowClassName,
  forceTableMode = false,
  forceCardMode = false,
  breakpoint = "md"
}: ResponsiveTableProps<T>) {

  if (!data || data.length === 0) {
    return (
      <div className="w-full text-center py-8 text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  // Determine the display mode based on props
  const cardMode = forceCardMode || (!forceTableMode && true); // In real usage, we'd use a media query
  const tableMode = forceTableMode || (!forceCardMode && true); // In real usage, we'd use a media query

  const getRowKey = (row: T, index: number): string => {
    if (typeof keyField === 'function') {
      return keyField(row);
    }
    if (row[keyField]) {
      return String(row[keyField]);
    }
    return `row-${index}`;
  };

  const getColumnValue = (row: T, column: Column<T>) => {
    const value = row[column.key];
    return column.render ? column.render(value, row) : value;
  };

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
                <TableHead key={column.key.toString()} className={column.className}>
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow key={getRowKey(row, rowIndex)} className={rowClassName}>
                {columns.map((column) => (
                  <TableCell key={`${getRowKey(row, rowIndex)}-${column.key}`} className={column.className}>
                    {getColumnValue(row, column)}
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
        {data.map((row, rowIndex) => (
          <Card key={getRowKey(row, rowIndex)} className={cn("p-4", cardClassName)}>
            {columns
              .filter(col => col.showOnMobile !== false)
              .map((column) => (
                <div
                  key={`card-${getRowKey(row, rowIndex)}-${column.key}`}
                  className="flex justify-between py-2 border-b last:border-b-0"
                >
                  <span className="font-medium text-sm text-muted-foreground">
                    {column.label}
                  </span>
                  <span className="text-right">
                    {getColumnValue(row, column)}
                  </span>
                </div>
              ))}
          </Card>
        ))}
      </div>
    </div>
  );
}
