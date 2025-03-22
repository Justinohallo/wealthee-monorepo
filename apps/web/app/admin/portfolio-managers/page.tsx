import { Button } from "@/components/ui/button"
import Link from "next/link"
import PortfolioManagerList from "./_components/PortfolioManagerList"
import { listPortfolioManagers } from "../../../services/portfolioManager"
import { verifySessionAndGetUser } from "@/lib/server-auth-utils"

interface PortfolioManager {
  uid: string
  email: string
  displayName: string
  disabled: boolean
  metadata: {
    creationTime: string
    lastSignInTime: string | null
  }
}

export default async function PortfolioManagersPage() {
  const user = await verifySessionAndGetUser();
  if (!user) {
    return <div>Unauthorized</div>
  }
  const rawManagers = await listPortfolioManagers(user.token || '')
  // This mapping is necessary to ensure consistent data structure
  // The API might return different field names or missing fields
  const managers: PortfolioManager[] = rawManagers.map(manager => ({
    uid: manager.id || manager.uid || 'unknown',
    email: manager.email,
    displayName: manager.displayName || '',
    disabled: manager.disabled || false,
    metadata: {
      creationTime: manager.createdAt || manager.metadata?.creationTime || new Date().toISOString(),
      lastSignInTime: manager.metadata?.lastSignInTime || null
    }
  }))

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Portfolio Managers</h1>
        <Link href="/admin/portfolio-managers/create">
          <Button>Add New Manager</Button>
        </Link>
      </div>
      <PortfolioManagerList managers={managers} />
    </div>
  )
}

