"use client";

import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { ReactNode } from "react";
import { RefreshCw } from "lucide-react";

interface AccountErrorBoundaryProps {
    children: ReactNode;
    title?: string;
}

export function AccountErrorBoundary({
    children,
    title = "Account Data Error",
}: AccountErrorBoundaryProps) {
    const fallback = (
        <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg border border-gray-200 min-h-[200px]">
            <div className="text-red-500 mb-3">
                <RefreshCw className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
            <p className="text-sm text-gray-600 text-center mb-4">
                We couldn't load this data. This might be a temporary issue.
            </p>
            <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
            >
                Refresh
            </button>
        </div>
    );

    return <ErrorBoundary fallback={fallback}>{children}</ErrorBoundary>;
}
