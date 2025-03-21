import { Skeleton } from "@/components/ui/skeleton"

export default function SnaptradeLoading() {
  return (
    <div className="p-8">
      <Skeleton className="h-10 w-64 mb-6" />

      {/* Skeleton for SnaptradeOverview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Skeleton className="h-32 rounded-lg" />
        <Skeleton className="h-32 rounded-lg" />
        <Skeleton className="h-32 rounded-lg" />
      </div>

      {/* Skeleton for SnaptradeUsers */}
      <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
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
    </div>
  )
}
