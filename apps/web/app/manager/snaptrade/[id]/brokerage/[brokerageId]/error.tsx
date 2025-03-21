"use client"

import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect } from "react"
import { useParams } from "next/navigation"

export default function BrokerageDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const params = useParams();
  const snapTradeUserId = params.id as string;

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Brokerage detail error:", error)
  }, [error])

  return (
    <div className="p-8">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
          <h2 className="text-xl font-semibold text-red-800">
            Error loading brokerage details
          </h2>
        </div>

        <p className="text-red-700 mb-6">
          {error.message || "An unexpected error occurred while loading the brokerage details."}
        </p>

        <div className="flex gap-4">
          <Button
            onClick={reset}
            variant="outline"
            className="bg-white hover:bg-gray-50"
          >
            Try again
          </Button>

          <Link href={`/manager/snaptrade/${snapTradeUserId}`}>
            <Button variant="ghost">
              Return to user details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
