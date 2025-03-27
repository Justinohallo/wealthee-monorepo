import { AccountActivitiesList } from "./AccountActivitiesList";
import { Suspense } from "react";
import { getAccountActivities } from "@/services/snaptrade/accounts";

interface AccountActivitiesProps {
  idToken: string;
  userId: string;
  snapTradeUserId: string;
  accountId: string;
}

async function AccountActivitiesContent({ idToken, userId, snapTradeUserId, accountId }: AccountActivitiesProps) {
  // Get activities from the last 30 days
  const activities = await getAccountActivities({
    userId,
    snapTradeUserId,
    accountId,
    idToken,
  });
  console.log(activities);
  return <AccountActivitiesList activities={activities} />;
}

export function AccountActivities(props: AccountActivitiesProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden p-6">
      <h2 className="text-xl font-semibold mb-4">Account Activities</h2>
      <Suspense fallback={
        <div className="p-4 bg-gray-50 rounded-md text-center">
          <p className="text-gray-700">Loading account activities...</p>
        </div>
      }>
        <AccountActivitiesContent
          userId={props.userId}
          snapTradeUserId={props.snapTradeUserId}
          accountId={props.accountId}
          idToken={props.idToken}
        />
      </Suspense>
    </div>
  );
}
