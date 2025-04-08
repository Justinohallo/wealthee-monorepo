import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AccountDisplaySkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-6 w-[80px]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <Card className="p-4">
          <Skeleton className="h-4 w-[100px] mb-2" />
          <Skeleton className="h-6 w-[120px]" />
        </Card>

        <Card className="p-4">
          <Skeleton className="h-4 w-[100px] mb-2" />
          <Skeleton className="h-6 w-[120px]" />
        </Card>

        <Card className="p-4">
          <Skeleton className="h-4 w-[100px] mb-2" />
          <Skeleton className="h-6 w-[120px]" />
        </Card>
      </div>

      <Skeleton className="h-[200px] w-full mt-4" />
    </div>
  );
}
