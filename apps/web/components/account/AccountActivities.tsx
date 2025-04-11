import { AccountActivitiesSkeleton } from "./AccountSkeletons";
import { AccountActivitiesTable } from "./AccountActivitiesTable";
import { AccountErrorBoundary } from "./AccountErrorBoundary";
import { Suspense } from "react";
import { getAccountActivities } from "@/services/snaptrade/accounts";

interface AccountActivitiesProps {
  idToken: string;
  portfolioManagerId: string;
  snapTradeUserId: string;
  accountId: string;
}

async function AccountActivitiesContent({ idToken, portfolioManagerId, snapTradeUserId, accountId }: AccountActivitiesProps) {
  // This is a server component, so we can fetch data directly
  const activities = await getAccountActivities({
    portfolioManagerId,
    snapTradeUserId,
    accountId,
    idToken,
  });

  // Return the activities table component (client-side handling of responsive design)
  return <AccountActivitiesTable activities={activities} />;
}

export function AccountActivities(props: AccountActivitiesProps) {
  return (
    <AccountErrorBoundary title="Activities Data Error">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 h-full">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activities</h2>
          <Suspense fallback={<AccountActivitiesSkeleton />}>
            <AccountActivitiesContent
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
