import { Card, CardContent } from "@/components/ui/card";

import { ServerAccountLayout } from "./_components/ServerAccountLayout";
import { Suspense } from "react";
import { fetchAccountDetails } from "@/services/snaptrade/accounts";
import { getPrimaryAccount } from "@/services/portfolioManager/primaryAccount";
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
  const portfolioManagerId = session.decodedClaims.uid;

  // Fetch the account details and primary account ID concurrently
  const accountDetailsPromise = fetchAccountDetails({
    userId: portfolioManagerId,
    snapTradeUserId,
    accountId,
    idToken
  });
  const primaryAccountPromise = getPrimaryAccount(portfolioManagerId, idToken);

  const [account, primaryAccount] = await Promise.all([
    accountDetailsPromise,
    primaryAccountPromise,
  ]);

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

  // Check if this account is the primary account
  const isPrimary = primaryAccount !== null &&
    accountId === primaryAccount.accountId

  // Using our server-side layout component that handles data fetching in nested components
  return (
    <Suspense fallback={<div>Loading account details...</div>}>
      <ServerAccountLayout
        account={account}
        idToken={idToken}
        userId={portfolioManagerId}
        snapTradeUserId={snapTradeUserId}
        accountId={accountId}
        isPrimary={isPrimary}
        portfolioManagerId={portfolioManagerId}
      />
    </Suspense>
  );
}
