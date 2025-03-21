import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export default function BrokerageDetailLoading() {
    return (
        <div className="p-8">
            <div className="flex items-center mb-6">
                <Button variant="outline" size="sm" className="mr-4" disabled>
                    Back to User
                </Button>
                <Skeleton className="h-10 w-64" />
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden p-6 mb-6">
                <div className="mb-4">
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-12 w-full" />
                </div>

                <div className="mt-4">
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>

            {/* Skeleton for brokerage details */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b">
                    <Skeleton className="h-6 w-48" />
                </div>
                <div className="p-4">
                    {/* Details skeleton */}
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="mb-4">
                            <Skeleton className="h-4 w-32 mb-2" />
                            <Skeleton className="h-8 w-full" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
