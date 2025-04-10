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
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 h-full flex flex-col items-center justify-center p-8">
            <div className="text-red-500 mb-4">
                <RefreshCw className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
            <p className="text-base text-gray-600 text-center mb-6 max-w-md">
                We couldn't load this data. This might be a temporary issue.
            </p>
            <button
                onClick={() => window.location.reload()}
                className="px-5 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors font-medium"
            >
                Refresh
            </button>
        </div>
    );

    return <ErrorBoundary fallback={fallback}>{children}</ErrorBoundary>;
}
