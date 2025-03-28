import { AccountOrdersTable } from "./AccountOrdersTable";
import { Suspense } from "react";
import { getAccountOrders } from "@/services/snaptrade/accounts";

interface AccountOrdersProps {
  idToken: string;
  userId: string;
  snapTradeUserId: string;
  accountId: string;
}

async function AccountOrdersContent({ idToken, userId, snapTradeUserId, accountId }: AccountOrdersProps) {
  // This is a server component, so we can fetch data directly
  const orders = await getAccountOrders({
    userId,
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
        userId={props.userId}
        snapTradeUserId={props.snapTradeUserId}
        accountId={props.accountId}
        idToken={props.idToken}
      />
    </Suspense>
  );
}
