import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function ClientsPage() {
  try {

    return (
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Client Management</h1>
          <Link href="/manager/clients/new">
            <Button>Add New Client</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        </div>
      </div>
    )
  } catch (error) {
    console.error("Error loading clients:", error)
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error loading clients</h1>
        <p className="text-gray-700 mb-4">
          We encountered an issue while trying to load the client data. Please try again later.
        </p>
        <p className="text-sm text-gray-500">Error details: {error instanceof Error ? error.message : String(error)}</p>
      </div>
    )
  }
}

