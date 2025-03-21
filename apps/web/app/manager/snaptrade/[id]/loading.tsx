import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export default function SnaptradeUserLoading() {
    return (
        <div className="p-8">
            <div className="flex items-center mb-6">
                <Button variant="outline" size="sm" className="mr-4" disabled>
                    Back to SnapTrade
                </Button>
                <Skeleton className="h-10 w-64" />
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden p-6 mb-6">
                <div className="mb-4">
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-12 w-full" />
                </div>

                {/* Skeleton for login button */}
                <div className="mt-4">
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-4 w-full mt-2" />
                </div>
            </div>

            {/* Skeleton for brokerages table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b">
                    <Skeleton className="h-6 w-48" />
                </div>
                <div className="p-4">
                    {/* Table header skeleton */}
                    <div className="flex border-b pb-2 mb-4">
                        <Skeleton className="h-4 w-1/5 mr-2" />
                        <Skeleton className="h-4 w-1/5 mr-2" />
                        <Skeleton className="h-4 w-1/5 mr-2" />
                        <Skeleton className="h-4 w-1/5 mr-2" />
                        <Skeleton className="h-4 w-1/5" />
                    </div>

                    {/* Table rows skeleton */}
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex py-3 border-b">
                            <Skeleton className="h-6 w-1/5 mr-2" />
                            <Skeleton className="h-6 w-1/5 mr-2" />
                            <Skeleton className="h-6 w-1/5 mr-2" />
                            <Skeleton className="h-6 w-1/5 mr-2" />
                            <Skeleton className="h-6 w-1/5" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
