import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function AccountDetailsLoading() {
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

                <div className="mt-6">
                    <Skeleton className="h-24 w-full" />
                </div>
            </div>
        </div>
    );
}
