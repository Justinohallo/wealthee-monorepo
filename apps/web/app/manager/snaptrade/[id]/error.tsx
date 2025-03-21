"use client"

import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect } from "react"

export default function SnaptradeUserError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("SnapTrade user error:", error)
  }, [error])

  // Check if the error is related to brokerage fetching
  const isBrokerageError = error.message?.includes('brokerage') ||
    error.message?.toLowerCase().includes('authorization') ||
    error.message?.includes('401') ||
    error.message?.includes('403')

  return (
    <div className="p-8">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
          <h2 className="text-xl font-semibold text-red-800">
            {isBrokerageError
              ? "Error loading brokerage connections"
              : "Error loading SnapTrade user details"}
          </h2>
        </div>

        <p className="text-red-700 mb-6">
          {error.message || "An unexpected error occurred while loading the user details."}
          {isBrokerageError && " Please check your connection and permissions."}
        </p>

        <div className="flex gap-4">
          <Button
            onClick={reset}
            variant="outline"
            className="bg-white hover:bg-gray-50"
          >
            Try again
          </Button>

          <Link href="/manager/snaptrade">
            <Button variant="ghost">
              Return to SnapTrade
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
