import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SetPrimaryAccountButton } from "@/components/snaptrade/SetPrimaryAccountButton";
import { fetchSnapTradeAccounts } from "@/services/snaptrade/accounts";
import { formatCurrency } from "@/lib/utils";

// Define props interface
interface AccountsListProps {
  idToken: string;
  snapTradeUserId: string;
  userId: string;
  primaryAccountId: string | null;
  portfolioManagerId: string;
}

// The main component that fetches data
export default async function AccountsList({
  idToken,
  snapTradeUserId,
  userId,
  primaryAccountId,
  portfolioManagerId,
}: AccountsListProps) {
  const accounts = await fetchSnapTradeAccounts({ snapTradeUserId, idToken });
  if (!accounts.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-muted/20 rounded-md text-center">
            <p className="text-muted-foreground">No accounts found for this user.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Accounts ({accounts.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Mobile view - Cards */}
        <div className="md:hidden space-y-4">
          {accounts.map((account) => (
            <Card key={account.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4 border-b bg-muted/10">
                  <div className="font-medium">{account.name}</div>
                  <div className="text-sm text-muted-foreground">{account.number}</div>
                  <div className="mt-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${account.meta?.status === "open"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                        }`}
                    >
                      {account.meta?.status || "unknown"}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Type</span>
                    <span>{account.meta?.unifiedAccountType?.replace(/_/g, " ") || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Balance</span>
                    <span>
                      {account.balance?.total
                        ? formatCurrency(
                          account.balance.total.amount ?? 0,
                          account.balance.total.currency ?? ''
                        )
                        : "N/A"
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Last Sync</span>
                    <span>
                      {account.sync_status?.holdings?.last_successful_sync
                        ? new Date(
                          account.sync_status.holdings.last_successful_sync
                        ).toLocaleDateString()
                        : "Never"
                      }
                    </span>
                  </div>

                  <div className="pt-3 mt-3 border-t flex flex-col gap-2 sm:flex-row">
                    <Link
                      href={`/manager/snaptrade/${snapTradeUserId}/account/${account.id}`}
                      className="w-full sm:w-auto flex-1"
                    >
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </Link>
                    <div className="w-full sm:w-auto flex-1">
                      <SetPrimaryAccountButton
                        snapTradeUserId={snapTradeUserId}
                        accountId={account.id!}
                        accountName={account.name || "Account"}
                        isPrimary={account.id === primaryAccountId}
                        idToken={idToken}
                        portfolioManagerId={portfolioManagerId}
                        variant="secondary"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Desktop view - Table */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Account Number</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Last Sync</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="font-medium">{account.name}</TableCell>
                  <TableCell>{account.number}</TableCell>
                  <TableCell>{account.meta?.unifiedAccountType?.replace(/_/g, " ") || "N/A"}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${account.meta?.status === "open"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                        }`}
                    >
                      {account.meta?.status || "unknown"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {account.balance?.total
                      ? formatCurrency(
                        account.balance.total.amount ?? 0,
                        account.balance.total.currency ?? ''
                      )
                      : "N/A"
                    }
                  </TableCell>
                  <TableCell>
                    {account.sync_status?.holdings?.last_successful_sync
                      ? new Date(
                        account.sync_status.holdings.last_successful_sync
                      ).toLocaleDateString()
                      : "Never"
                    }
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/manager/snaptrade/${snapTradeUserId}/account/${account.id}`}
                      >
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                      <SetPrimaryAccountButton
                        snapTradeUserId={snapTradeUserId}
                        accountId={account.id!}
                        accountName={account.name || "Account"}
                        isPrimary={account.id === primaryAccountId}
                        idToken={idToken}
                        portfolioManagerId={portfolioManagerId}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
