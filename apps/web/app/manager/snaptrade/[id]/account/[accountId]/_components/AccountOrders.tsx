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
    <Suspense fallback={
      <AccountOrdersTable orders={[]} isLoading={true} />
    }>
      <AccountOrdersContent
        portfolioManagerId={props.portfolioManagerId}
        snapTradeUserId={props.snapTradeUserId}
        accountId={props.accountId}
        idToken={props.idToken}
      />
    </Suspense>
  );
}
