import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatCurrency } from "@/lib/format-currency";

interface AccountSummaryProps {
    accountInfo?: {
        id: string;
        name: string;
        balance?: {
            total?: {
                amount: number;
                currency: string;
            } | null;
        } | null;
    };
    hasSubscription: boolean;
}

export function AccountSummary({ accountInfo, hasSubscription }: AccountSummaryProps) {
    if (!accountInfo) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Account Overview</CardTitle>
                    <CardDescription>No active account found</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="mb-4">You currently don't have an active investment account.</p>
                    {hasSubscription ? (
                        <Button asChild>
                            <Link href="/client/settings">Set up your account</Link>
                        </Button>
                    ) : (
                        <Button asChild>
                            <Link href="/client/subscribe">Subscribe to get started</Link>
                        </Button>
                    )}
                </CardContent>
            </Card>
        );
    }

    const totalAmount = accountInfo.balance?.total?.amount || 0;
    const currency = accountInfo.balance?.total?.currency || "USD";

    return (
        <Card>
            <CardHeader>
                <CardTitle>Account Overview</CardTitle>
                <CardDescription>{accountInfo.name}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Balance</h3>
                    <p className="text-2xl font-bold">
                        {formatCurrency(totalAmount, currency)} {currency}
                    </p>
                </div>

                <Button asChild>
                    <Link href={`/client/account/${accountInfo.id}`}>View Details</Link>
                </Button>
            </CardContent>
        </Card>
    );
}
