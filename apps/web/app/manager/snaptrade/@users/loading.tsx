import { Skeleton } from "@/components/ui/skeleton"

export default function SnaptradeUsersLoading() {
    return (
        <div className="bg-white rounded-lg shadow overflow-hidden mt-6">
            <div className="p-4">
                <Skeleton className="h-6 w-48 mb-4" />
            </div>
            <div className="px-4 pb-4">
                <Skeleton className="h-10 w-full mb-2" />
                <Skeleton className="h-10 w-full mb-2" />
                <Skeleton className="h-10 w-full mb-2" />
                <Skeleton className="h-10 w-full" />
            </div>
        </div>
    )
}
