import { AccountBalances } from "./AccountBalances";
import { Suspense } from "react";

export function AccountBalancesWrapper({
    idToken,
    userId,
    snapTradeUserId,
    accountId,
}: {
    idToken: string;
    userId: string;
    snapTradeUserId: string;
    accountId: string;
}) {
    return (
        <Suspense fallback={<div>Loading balances...</div>}>
            <AccountBalances
                idToken={idToken}
                userId={userId}
                snapTradeUserId={snapTradeUserId}
                accountId={accountId}
            />
        </Suspense>
    );
}
