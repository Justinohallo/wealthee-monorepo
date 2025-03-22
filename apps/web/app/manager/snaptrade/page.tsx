import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function SnaptradePage() {

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Snaptrade Integration</h1>
        <Link href="/manager/snaptrade/create">
          <Button variant="default">
            Create SnapTrade User
          </Button>
        </Link>
      </div>
      {/* The SnaptradeUsers component will be rendered by the parallel route */}
    </div>
  )
}

