import { AccountErrorBoundary } from "./AccountErrorBoundary";
import { AccountOrdersSkeleton } from "./AccountSkeletons";
import { AccountOrdersTable } from "./AccountOrdersTable";
import { Suspense } from "react";
import { getAccountOrders } from "@/services/snaptrade/accounts";

interface AccountOrdersProps {
  idToken: string;
  portfolioManagerId: string;
  snapTradeUserId: string;
  accountId: string;
}

async function AccountOrdersContent({ idToken, portfolioManagerId, snapTradeUserId, accountId }: AccountOrdersProps) {
  // This is a server component, so we can fetch data directly
  const orders = await getAccountOrders({
    portfolioManagerId,
    snapTradeUserId,
    accountId,
    idToken,
  });

  // Return the orders table component (client-side handling of responsive design)
  return <AccountOrdersTable orders={orders || []} />;
}

export function AccountOrders(props: AccountOrdersProps) {
  return (
    <AccountErrorBoundary title="Orders Data Error">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 h-full">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Orders</h2>
          <Suspense fallback={<AccountOrdersSkeleton />}>
            <AccountOrdersContent
              portfolioManagerId={props.portfolioManagerId}
              snapTradeUserId={props.snapTradeUserId}
              accountId={props.accountId}
              idToken={props.idToken}
            />
          </Suspense>
        </div>
      </div>
    </AccountErrorBoundary>
  );
}
