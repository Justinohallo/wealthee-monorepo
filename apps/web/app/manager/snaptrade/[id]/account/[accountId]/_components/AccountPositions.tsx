import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Suspense } from "react";
import { formatCurrency } from "@/lib/utils";
import { getAccountPositions } from "@/services/snaptrade/accounts";

interface AccountPositionsProps {
    idToken: string;
    userId: string;
    snapTradeUserId: string;
    accountId: string;
}

async function AccountPositionsContent({ idToken, userId, snapTradeUserId, accountId }: AccountPositionsProps) {
    const positions = await getAccountPositions({ userId, snapTradeUserId, accountId, idToken });

    if (!positions || positions.length === 0) {
        return (
            <div className="p-4 bg-gray-50 rounded-md text-center">
                <p className="text-gray-700">
                    No position information available for this account.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Symbol</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Market Price</TableHead>
                        <TableHead className="text-right">Market Value</TableHead>
                        <TableHead className="text-right">P/L</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {positions.map((position) => (
                        <TableRow key={`${position.symbol?.symbol?.symbol}-${position.units}`}>
                            <TableCell className="font-medium">
                                {position.symbol?.symbol?.symbol}
                            </TableCell>
                            <TableCell className="text-right">
                                {position.units ? position.units.toFixed(2) : 'N/A'}
                            </TableCell>
                            <TableCell className="text-right">
                                {position.price ? formatCurrency(position.price, position.currency?.code || 'USD') : 'N/A'}
                            </TableCell>
                            <TableCell className="text-right">
                                {formatCurrency((position.price || 0) * (position.units || 0), position.currency?.code || 'USD')}
                            </TableCell>
                            <TableCell className={`text-right ${position.open_pnl && position.open_pnl > 0 ? 'text-green-600' : position.open_pnl && position.open_pnl < 0 ? 'text-red-600' : ''}`}>
                                {typeof position.open_pnl === 'number' ? formatCurrency(position.open_pnl, position.currency?.code || 'USD') : 'N/A'}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export function AccountPositions(props: AccountPositionsProps) {
    return (
        <div className="bg-white rounded-lg shadow overflow-hidden p-6">
            <h2 className="text-xl font-semibold mb-4">Account Positions</h2>
            <Suspense fallback={<div>Loading positions...</div>}>
                <AccountPositionsContent {...props} />
            </Suspense>
        </div>
    );
}
