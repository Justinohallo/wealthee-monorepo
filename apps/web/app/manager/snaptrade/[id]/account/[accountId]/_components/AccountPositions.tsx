import { AccountPositionsTable } from "./AccountPositionsTable";
import { Suspense } from "react";
import { getAccountPositions } from "@/services/snaptrade/accounts";

interface AccountPositionsProps {
  idToken: string;
  portfolioManagerId: string;
  snapTradeUserId: string;
  accountId: string;
}

async function AccountPositionsContent({ idToken, portfolioManagerId, snapTradeUserId, accountId }: AccountPositionsProps) {
  // This is a server component, so we can fetch data directly
  const positions = await getAccountPositions({ portfolioManagerId, snapTradeUserId, accountId, idToken });

  // Return the positions table component (client-side handling of responsive design)
  return <AccountPositionsTable positions={positions || []} />;
}

export function AccountPositions(props: AccountPositionsProps) {
  return (
    <Suspense fallback={
      <AccountPositionsTable positions={[]} isLoading={true} />
    }>
      <AccountPositionsContent
        portfolioManagerId={props.portfolioManagerId}
        snapTradeUserId={props.snapTradeUserId}
        accountId={props.accountId}
        idToken={props.idToken}
      />
    </Suspense>
  );
}
