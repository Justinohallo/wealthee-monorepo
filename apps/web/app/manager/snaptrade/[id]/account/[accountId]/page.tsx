import { AccountActivities } from "./_components/AccountActivities";
import { AccountBalances } from "./_components/AccountBalances";
import { AccountHoldings } from "./_components/AccountHoldings";
import { AccountOrders } from "./_components/AccountOrders";
import { AccountPositions } from "./_components/AccountPositions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";
import { fetchAccountDetails } from "@/services/snaptrade/accounts";
import { formatCurrency } from "@/lib/utils";
import { verifySessionAndGetUser } from "@/lib/server-auth-utils";

// Format date to a readable string
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export default async function AccountDetailsPage({
  params,
}: {
  params: { id: string; accountId: string };
}) {
  // Ensure params are properly awaited in Next.js
  const awaitedParams = await params;
  const snapTradeUserId = awaitedParams.id;
  const accountId = awaitedParams.accountId;

  const session = await verifySessionAndGetUser();
  if (!session) {
    return <div>Unauthorized</div>;
  }

  const idToken = session.token || '';
  const userId = session.decodedClaims.uid;

  // Fetch the account details
  const account = await fetchAccountDetails(
    {
      userId,
      snapTradeUserId,
      accountId,
      idToken
    }
  );
  return (
    <div className="p-8">
      <div className="flex items-center mb-6">
        <Link href={`/manager/snaptrade/${snapTradeUserId}`}>
          <Button variant="outline" size="sm" className="mr-4">
            Back to User
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Account Details</h1>
      </div>

      {!account ? (
        <div className="bg-white rounded-lg shadow overflow-hidden p-6 mb-6">
          <div className="p-4 bg-yellow-50 rounded-md text-center">
            <p className="text-yellow-700">
              Account details could not be loaded. The account may not exist or you may not have permission to view it.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Account Overview */}
          <div className="bg-white rounded-lg shadow overflow-hidden p-6">
            <h2 className="text-xl font-semibold mb-4">Account Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Account Name</h3>
                  <p className="text-lg font-semibold">{account.name}</p>
                </div>
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Account Number</h3>
                  <p className="text-lg">{account.number}</p>
                </div>
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Institution</h3>
                  <p className="text-lg">{account.institution_name}</p>
                </div>
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Type</h3>
                  <p className="text-lg">{account.meta?.unifiedAccountType?.replace(/_/g, " ") || "N/A"}</p>
                </div>
              </div>
              <div>
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${account.meta?.status === "open"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                      }`}
                  >
                    {account.meta?.status || "unknown"}
                  </span>
                </div>
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Created Date</h3>
                  <p className="text-lg">{account.created_date ? formatDate(account.created_date) : "N/A"}</p>
                </div>
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Balance</h3>
                  <p className="text-2xl font-bold text-green-600">
                    {account.balance?.total
                      ? formatCurrency(account.balance.total.amount || 0, account.balance.total.currency || 'CAD')
                      : "N/A"
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Balances */}
          <AccountBalances
            idToken={idToken}
            userId={userId}
            snapTradeUserId={snapTradeUserId}
            accountId={accountId}
          />

          {/* Account Positions */}
          <AccountPositions
            idToken={idToken}
            userId={userId}
            snapTradeUserId={snapTradeUserId}
            accountId={accountId}
          />

          {/* Account Orders */}
          <AccountOrders
            idToken={idToken}
            userId={userId}
            snapTradeUserId={snapTradeUserId}
            accountId={accountId}
          />

          {/* Account Activities */}
          <AccountActivities
            idToken={idToken}
            userId={userId}
            snapTradeUserId={snapTradeUserId}
            accountId={accountId}
          />

          {/* Sync Status */}
          {account.sync_status && (
            <div className="bg-white rounded-lg shadow overflow-hidden p-6">
              <h2 className="text-xl font-semibold mb-4">Sync Status</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {account.sync_status.holdings && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Holdings</h3>
                    <div className="p-4 bg-gray-50 rounded-md">
                      <div className="mb-2">
                        <span className="text-sm font-medium text-gray-500">Last Successful Sync:</span>
                        <span className="ml-2">{account.sync_status.holdings.last_successful_sync ? formatDate(account.sync_status.holdings.last_successful_sync) : "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Initial Sync Completed:</span>
                        <span className="ml-2">{account.sync_status.holdings.initial_sync_completed ? "Yes" : "No"}</span>
                      </div>
                    </div>
                  </div>
                )}
                {account.sync_status.transactions && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Transactions</h3>
                    <div className="p-4 bg-gray-50 rounded-md">
                      <div className="mb-2">
                        <span className="text-sm font-medium text-gray-500">Last Successful Sync:</span>
                        <span className="ml-2">{account.sync_status.transactions.last_successful_sync}</span>
                      </div>
                      {account.sync_status.transactions.first_transaction_date && (
                        <div className="mb-2">
                          <span className="text-sm font-medium text-gray-500">First Transaction Date:</span>
                          <span className="ml-2">{account.sync_status.transactions.first_transaction_date}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-sm font-medium text-gray-500">Initial Sync Completed:</span>
                        <span className="ml-2">{account.sync_status.transactions.initial_sync_completed ? "Yes" : "No"}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Technical Details */}
          <div className="bg-white rounded-lg shadow overflow-hidden p-6">
            <h2 className="text-xl font-semibold mb-4">Technical Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500">Account ID</h3>
                <p className="text-sm font-mono p-2 bg-gray-50 rounded-md overflow-x-auto">{account.id}</p>
              </div>
              {account.brokerage_authorization && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Brokerage Authorization ID</h3>
                  <Link href={`/manager/snaptrade/${snapTradeUserId}/brokerage/${account.brokerage_authorization}`} className="block">
                    <p className="text-sm font-mono p-2 bg-gray-50 rounded-md overflow-x-auto hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer">
                      {account.brokerage_authorization}
                    </p>
                  </Link>
                </div>
              )}
              {account.raw_type && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Raw Type</h3>
                  <p className="text-sm p-2 bg-gray-50 rounded-md">{account.raw_type}</p>
                </div>
              )}
            </div>
          </div>

          {/* Account Holdings */}
          <Suspense fallback={
            <div className="bg-white rounded-lg shadow overflow-hidden p-6">
              <h2 className="text-xl font-semibold mb-4">Holdings</h2>
              <div className="p-4 bg-gray-100 rounded-md text-center">
                <p className="text-gray-700">Loading account holdings...</p>
              </div>
            </div>
          }>
            <AccountHoldings
              idToken={idToken}
              userId={userId}
              snapTradeUserId={snapTradeUserId}
              accountId={accountId}
            />
          </Suspense>
        </div>
      )}
    </div>
  );
}
