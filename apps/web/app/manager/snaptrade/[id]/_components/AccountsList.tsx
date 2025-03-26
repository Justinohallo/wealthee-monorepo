import { SnapTradeAccount, fetchSnapTradeAccounts } from "@/services/snaptrade/accounts";
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
import { formatCurrency } from "@/lib/utils";

// Component to display accounts
function AccountsDisplay({ accounts, snapTradeUserId }: { accounts: SnapTradeAccount[], snapTradeUserId: string }) {
  if (!accounts.length) {
    return (
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Accounts</h2>
        <div className="p-4 bg-gray-50 rounded-md text-center">
          No accounts found for this user.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Accounts ({accounts.length})</h2>
      <div className="overflow-x-auto">
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
                      account.balance.total.amount,
                      account.balance.total.currency
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
                  <Link
                    href={`/manager/snaptrade/${snapTradeUserId}/account/${account.id}`}
                  >
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// The main component that fetches data
export default async function AccountsList({
  idToken,
  userId,
  snapTradeUserId,
}: {
  idToken: string;
  userId: string;
  snapTradeUserId: string;
}) {
  const accounts = await fetchSnapTradeAccounts(userId, snapTradeUserId, idToken);
  return <AccountsDisplay accounts={accounts} snapTradeUserId={snapTradeUserId} />;
}
