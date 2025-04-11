"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function AccountTableSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="w-full overflow-hidden">
      {/* Header row */}
      <div className="flex items-center w-full gap-6 pb-4 border-b border-gray-100">
        <Skeleton className="h-5 w-1/5 rounded-md" />
        <Skeleton className="h-5 w-1/5 rounded-md" />
        <Skeleton className="h-5 w-1/5 rounded-md ml-auto" />
      </div>

      {/* Data rows */}
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex items-center w-full gap-6 py-4 border-b border-gray-100">
          <Skeleton className="h-4 w-1/5 rounded-md" />
          <Skeleton className="h-4 w-1/5 rounded-md" />
          <Skeleton className="h-4 w-1/5 rounded-md ml-auto" />
        </div>
      ))}
    </div>
  );
}

export function AccountHoldingsSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 h-full">
      <div className="p-6">
        <Skeleton className="h-8 w-48 mb-6 rounded-md" />
        <div className="space-y-8">
          {/* Stock Positions */}
          <div>
            <Skeleton className="h-6 w-40 mb-4 rounded-md" />
            <AccountTableSkeleton rows={3} />
          </div>

          {/* Account Summary */}
          <div>
            <Skeleton className="h-6 w-40 mb-4 rounded-md" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <Skeleton className="h-5 w-36 mb-4 rounded-md" />
                <Skeleton className="h-8 w-28 rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AccountBalancesSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 h-full">
      <div className="p-6">
        <Skeleton className="h-8 w-48 mb-6 rounded-md" />
        <AccountTableSkeleton rows={2} />
      </div>
    </div>
  );
}

export function AccountPositionsSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 h-full">
      <div className="p-6">
        <Skeleton className="h-8 w-48 mb-6 rounded-md" />
        <div className="mb-4">
          <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-5 w-32 rounded-md" />
            <Skeleton className="h-5 w-20 rounded-md" />
          </div>
        </div>
        <AccountTableSkeleton rows={4} />
      </div>
    </div>
  );
}

export function AccountActivitiesSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 h-full">
      <div className="p-6">
        <Skeleton className="h-8 w-48 mb-6 rounded-md" />
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-5 w-32 rounded-md" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-20 rounded-md" />
            <Skeleton className="h-5 w-20 rounded-md" />
          </div>
        </div>
        <AccountTableSkeleton rows={3} />
      </div>
    </div>
  );
}

export function AccountOrdersSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 h-full">
      <div className="p-6">
        <Skeleton className="h-8 w-48 mb-6 rounded-md" />
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-5 w-32 rounded-md" />
          <Skeleton className="h-5 w-20 rounded-md" />
        </div>
        <AccountTableSkeleton rows={3} />
      </div>
    </div>
  );
}
