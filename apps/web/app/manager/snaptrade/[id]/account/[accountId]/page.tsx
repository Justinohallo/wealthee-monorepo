import { Card, CardContent } from "@/components/ui/card";

import { ServerAccountLayout } from "./_components/ServerAccountLayout";
import { Suspense } from "react";
import { fetchAccountDetails } from "@/services/snaptrade/accounts";
import { verifySessionAndGetUser } from "@/lib/server-auth-utils";

export default async function AccountDetailsPage({
  params,
}: {
  params: { id: string; accountId: string };
}) {
  // Ensure params are properly awaited in Next.js
  const awaitedParams = await params;
  const snapTradeUserId = awaitedParams.id;
  const accountId = awaitedParams.accountId;

  // Get session auth data
  const session = await verifySessionAndGetUser();
  if (!session) {
    return <div>Unauthorized</div>;
  }

  const idToken = session.token || '';
  const userId = session.decodedClaims.uid;

  // Fetch the account details
  const account = await fetchAccountDetails({
    userId,
    snapTradeUserId,
    accountId,
    idToken
  });

  if (!account) {
    return (
      <Card className="m-4">
        <CardContent className="p-4">
          <div className="p-4 bg-yellow-50 rounded-md text-center">
            <p className="text-yellow-700">
              Account details could not be loaded. The account may not exist or you may not have permission to view it.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Using our server-side layout component that handles data fetching in nested components
  return (
    <Suspense fallback={<div>Loading account details...</div>}>
      <ServerAccountLayout
        account={account}
        idToken={idToken}
        userId={userId}
        snapTradeUserId={snapTradeUserId}
        accountId={accountId}
      />
    </Suspense>
  );
}
