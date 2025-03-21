"use client"

import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"

export default function SnaptradeError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Snaptrade error:", error)
    }, [error])

    return (
        <div className="p-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                    <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
                    <h2 className="text-xl font-semibold text-red-800">
                        Something went wrong with the Snaptrade page
                    </h2>
                </div>

                <p className="text-red-700 mb-6">
                    {error.message || "An unexpected error occurred while loading the Snaptrade integration."}
                </p>

                <div className="flex gap-4">
                    <Button
                        onClick={reset}
                        variant="outline"
                        className="bg-white hover:bg-gray-50"
                    >
                        Try again
                    </Button>

                    <Button
                        onClick={() => window.location.href = "/manager"}
                        variant="ghost"
                    >
                        Return to dashboard
                    </Button>
                </div>
            </div>
        </div>
    )
}
