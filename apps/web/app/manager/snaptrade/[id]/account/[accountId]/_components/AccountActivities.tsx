import { AccountActivitiesTable } from "./AccountActivitiesTable";
import { Suspense } from "react";
import { getAccountActivities } from "@/services/snaptrade/accounts";

interface AccountActivitiesProps {
  idToken: string;
  userId: string;
  snapTradeUserId: string;
  accountId: string;
}

async function AccountActivitiesContent({ idToken, userId, snapTradeUserId, accountId }: AccountActivitiesProps) {
  // This is a server component, so we can fetch data directly
  const activities = await getAccountActivities({
    userId,
    snapTradeUserId,
    accountId,
    idToken,
  });

  // Return the activities table component (client-side handling of responsive design)
  return <AccountActivitiesTable activities={activities} />;
}

export function AccountActivities(props: AccountActivitiesProps) {
  return (
    <Suspense fallback={
      <AccountActivitiesTable activities={{ data: [] }} isLoading={true} />
    }>
      <AccountActivitiesContent
        userId={props.userId}
        snapTradeUserId={props.snapTradeUserId}
        accountId={props.accountId}
        idToken={props.idToken}
      />
    </Suspense>
  );
}
