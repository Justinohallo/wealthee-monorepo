'use client';

import { SnapTradeUser } from "@/services/snaptrade/users";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ResponsiveTable, type SimpleColumn, type CellContent } from "@/components/ui/responsive-table";
import Link from "next/link";
import { DeleteUserButton } from "../@users/_components/DeleteUserButton";
import { Button } from "@/components/ui/button";

interface SnapTradeUsersTableProps {
  users: SnapTradeUser[];
  idToken: string;
  portfolioManagerId: string;
}

export function SnapTradeUsersTable({
  users,
  idToken,
  portfolioManagerId
}: SnapTradeUsersTableProps) {
  const isMobile = useMediaQuery("(max-width: 767px)");

  // Pre-format cell content
  const cells: CellContent[] = users.map(user => ({
    id: user.id,
    displayName: (
      <div className="py-1">
        <div className="font-medium text-base">{user.displayName}</div>
        {isMobile && (
          <div className="text-xs text-muted-foreground truncate max-w-[180px] mt-1">{user.id}</div>
        )}
      </div>
    ),
    userId: (
      <div className="font-mono text-xs text-muted-foreground truncate">{user.id}</div>
    ),
    createdAt: (
      <div className={isMobile ? "text-sm text-muted-foreground" : "whitespace-nowrap"}>
        {new Date(user.createdAt).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })}
      </div>
    ),
    actions: isMobile ? (
      <div className="flex flex-col space-y-2 py-1">
        <Button
          variant="outline"
          size="sm"
          asChild={true}
          className="h-8 text-xs justify-center w-full"
        >
          <Link href={`/manager/snaptrade/${user.id}`}>
            View Details
          </Link>
        </Button>
        <DeleteUserButton
          idToken={idToken}
          portfolioManagerId={portfolioManagerId}
          snapTradeUserId={user.id}
          userName={user.displayName}
          buttonClassName="h-8 text-xs w-full"
        />
      </div>
    ) : (
      <div className="flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          asChild={true}
          className="h-8 px-2 text-xs"
        >
          <Link href={`/manager/snaptrade/${user.id}`}>
            View Details
          </Link>
        </Button>
        <DeleteUserButton
          idToken={idToken}
          portfolioManagerId={portfolioManagerId}
          snapTradeUserId={user.id}
          userName={user.displayName}
          buttonClassName="h-8 px-2 text-xs"
        />
      </div>
    )
  }));

  // Define columns for mobile and desktop
  const mobileColumns: SimpleColumn[] = [
    { key: "displayName", label: "Name" },
    { key: "createdAt", label: "Created" },
    { key: "actions", label: "Actions" }
  ];

  const desktopColumns: SimpleColumn[] = [
    { key: "userId", label: "User ID", className: "w-[300px] text-sm font-medium text-muted-foreground" },
    { key: "displayName", label: "Display Name", className: "font-medium" },
    { key: "createdAt", label: "Created At", className: "text-sm text-muted-foreground" },
    { key: "actions", label: "Actions", className: "text-right" }
  ];

  return (
    <div className="bg-card text-card-foreground rounded-md border shadow-sm overflow-hidden">
      <ResponsiveTable
        cells={cells}
        columns={isMobile ? mobileColumns : desktopColumns}
        emptyMessage="No SnapTrade users found"
        forceTableMode={!isMobile}
        forceCardMode={isMobile}
        className="w-full"
        cardClassName="p-4 border-0 shadow-none last:mb-0 bg-background"
      />
    </div>
  );
}
