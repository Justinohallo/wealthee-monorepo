import { AccountErrorBoundary } from "./AccountErrorBoundary";
import { AccountPositionsSkeleton } from "./AccountSkeletons";
import { AccountPositionsTable } from "./AccountPositionsTable";
import { Suspense } from "react";
import { getAccountPositions } from "@/services/snaptrade/accounts";

interface AccountPositionsProps {
  idToken: string;
  portfolioManagerId: string;
  snapTradeUserId: string;
  accountId: string;
}

async function AccountPositionsContent({
  idToken,
  portfolioManagerId,
  snapTradeUserId,
  accountId
}: AccountPositionsProps) {
  // This is a server component, so we can fetch data directly
  const positions = await getAccountPositions({ portfolioManagerId, snapTradeUserId, accountId, idToken });

  // Return the positions table component (client-side handling of responsive design)
  return <AccountPositionsTable positions={positions || []} />;
}

export function AccountPositions(props: AccountPositionsProps) {
  return (
    <AccountErrorBoundary title="Positions Data Error">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 h-full">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Positions</h2>
          <Suspense fallback={<AccountPositionsSkeleton />}>
            <AccountPositionsContent
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
