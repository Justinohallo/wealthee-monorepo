import Link from "next/link"
import { Button } from "@/components/ui/button"
import PortfolioManagerList from "./_components/PortfolioManagerList"
import { fetchPortfolioManagers } from "./actions"

export default async function PortfolioManagersPage() {
  const managers = await fetchPortfolioManagers()

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

