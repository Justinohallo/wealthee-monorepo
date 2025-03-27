import { AccountOrdersList } from "./AccountOrdersList";
import { Suspense } from "react";
import { getAccountOrders } from "@/services/snaptrade/accounts";

interface AccountOrdersProps {
    idToken: string;
    userId: string;
    snapTradeUserId: string;
    accountId: string;
}

async function AccountOrdersContent({ idToken, userId, snapTradeUserId, accountId }: AccountOrdersProps) {
    const orders = await getAccountOrders({
        userId,
        snapTradeUserId,
        accountId,
        idToken,
        state: "all",
        days: 30
    });

    return <AccountOrdersList orders={orders} />;
}

export function AccountOrders(props: AccountOrdersProps) {
    return (
        <div className="bg-white rounded-lg shadow overflow-hidden p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
            <Suspense fallback={
                <div className="p-4 bg-gray-50 rounded-md text-center">
                    <p className="text-gray-700">Loading account orders...</p>
                </div>
            }>
                <AccountOrdersContent
                    userId={props.userId}
                    snapTradeUserId={props.snapTradeUserId}
                    accountId={props.accountId}
                    idToken={props.idToken}
                />
            </Suspense>
        </div>
    );
}
