import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SnaptradeOverview } from "./_components/SnaptradeOverview"
import { verifySessionAndGetUser } from "@/lib/server-auth-utils"

async function getSnaptradeData() {
  try {

    const response = await fetch("https://snaptrade-getaccountdetail-zncz3ts4ka-uc.a.run.app")

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    return {
      accounts: 1, // Since we're getting data for a single account
      totalValue: Number.parseFloat(data.balance.total.amount.toFixed(2)),
      positions: 0, // We don't have position data in this response
    }
  } catch (error) {
    console.error("Error fetching Snaptrade data:", error)
    throw new Error("Failed to fetch Snaptrade data")
  }
}

export default async function SnaptradePage() {
  const user = await verifySessionAndGetUser();
  const data = await getSnaptradeData()

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Snaptrade Integration</h1>
        <Link href="/manager/snaptrade/create">
          <Button className="bg-blue-600 hover:bg-blue-700">
            Create SnapTrade User
          </Button>
        </Link>
      </div>
      <SnaptradeOverview data={data} />
      {/* The SnaptradeUsers component will be rendered by the parallel route */}
    </div>
  )
}

