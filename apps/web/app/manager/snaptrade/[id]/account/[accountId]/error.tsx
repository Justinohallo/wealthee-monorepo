"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function AccountDetailsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams();
  const snapTradeUserId = Array.isArray(params.id) ? params.id[0] : params.id as string;

  return (
    <div className="p-8">
      <div className="flex items-center mb-6">
        <Link href={`/manager/snaptrade/${snapTradeUserId}`}>
          <Button variant="outline" size="sm" className="mr-4">
            Back to User
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Error Loading Account</h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden p-6 mb-6">
        <div className="mb-4 text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-4">
            Something went wrong!
          </h2>
          <p className="text-gray-700 mb-6">
            {error.message || "Failed to load account details."}
          </p>
          <Button onClick={reset}>Try Again</Button>
        </div>
      </div>
    </div>
  );
}
