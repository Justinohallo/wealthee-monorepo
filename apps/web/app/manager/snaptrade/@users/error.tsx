"use client"

import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"

export default function SnaptradeUsersError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("SnapTrade users error:", error)
    }, [error])

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden mt-6">
            <div className="bg-red-50 border-b border-red-100 p-4">
                <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                    <h2 className="text-lg font-medium text-red-800">
                        Error loading SnapTrade users
                    </h2>
                </div>
            </div>

            <div className="p-4">
                <p className="text-sm text-red-700 mb-4">
                    {error.message || "Failed to load SnapTrade users data."}
                </p>

                <Button
                    onClick={reset}
                    size="sm"
                    variant="outline"
                    className="bg-white hover:bg-gray-50"
                >
                    Try again
                </Button>
            </div>
        </div>
    )
}
