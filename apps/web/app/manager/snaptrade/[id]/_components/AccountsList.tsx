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

// Define interfaces for the account data
interface AccountBalance {
  total: {
    amount: number;
    currency: string;
  };
}

interface AccountSyncStatus {
  holdings: {
    last_successful_sync: string;
    initial_sync_completed: boolean;
  };
  transactions: {
    last_successful_sync: string;
    first_transaction_date: string | null;
    initial_sync_completed: boolean;
  };
}

interface AccountMeta {
  type: string;
  status: "open" | "closed";
  institution_name: string;
  unifiedAccountType: string;
  linked_account_id?: string;
}

export interface SnapTradeAccount {
  id: string;
  brokerage_authorization: string;
  portfolio_group: string;
  name: string;
  number: string;
  institution_name: string;
  meta: AccountMeta;
  cash_restrictions: unknown[];
  created_date: string;
  sync_status: AccountSyncStatus;
  balance: AccountBalance;
  raw_data: unknown;
  raw_type: string;
}

// Function to fetch accounts data
async function fetchSnapTradeAccounts({
  idToken,
  userId,
  snapTradeUserId,
}: {
  idToken: string;
  userId: string;
  snapTradeUserId: string;
}): Promise<SnapTradeAccount[]> {
  try {
    const response = await fetch(
      `https://portfoliomanager-listsnaptradeuseraccounts-zncz3ts4ka-uc.a.run.app?userId=${userId}&snapTradeUserId=${snapTradeUserId}`,
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    );

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return [];
    }

    const data = await response.json();
    return data.accounts || [];
  } catch (error) {
    console.error("Error fetching SnapTrade accounts:", error);
    return [];
  }
}

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
                <TableCell>{account.meta.unifiedAccountType.replace(/_/g, " ")}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${account.meta.status === "open"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                      }`}
                  >
                    {account.meta.status}
                  </span>
                </TableCell>
                <TableCell>
                  {formatCurrency(
                    account.balance.total.amount,
                    account.balance.total.currency
                  )}
                </TableCell>
                <TableCell>
                  {new Date(
                    account.sync_status.holdings.last_successful_sync
                  ).toLocaleDateString()}
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
  const accounts = await fetchSnapTradeAccounts({
    idToken,
    userId,
    snapTradeUserId,
  });

  return <AccountsDisplay accounts={accounts} snapTradeUserId={snapTradeUserId} />;
}
