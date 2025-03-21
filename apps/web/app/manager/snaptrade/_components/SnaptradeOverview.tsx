import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SnaptradeData {
    accounts: number
    totalValue: number
    positions: number
}

export function SnaptradeOverview({ data }: { data: SnaptradeData }) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.accounts}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${data.totalValue.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Positions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.positions}</div>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Snaptrade Integration Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-green-600">Successfully connected to Snaptrade API</p>
                    <p className="text-sm text-gray-600 mt-2">Last updated: {new Date().toLocaleString()}</p>
                </CardContent>
            </Card>
        </div>
    )
}
