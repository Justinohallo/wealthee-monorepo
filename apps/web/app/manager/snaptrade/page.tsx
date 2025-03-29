import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function SnaptradePage() {
  return (
    <div className="space-y-6">
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="px-0 pt-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">SnapTrade Integration</CardTitle>
              <CardDescription>Manage SnapTrade users and connected accounts</CardDescription>
            </div>
            <Link href="/manager/snaptrade/create">
              <Button variant="default">
                Create SnapTrade User
              </Button>
            </Link>
          </div>
        </CardHeader>
      </Card>
      {/* The SnaptradeUsers component will be rendered by the parallel route */}
    </div>
  )
}

