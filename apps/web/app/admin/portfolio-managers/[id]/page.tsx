import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { fetchPortfolioManager } from "./actions"
import { notFound } from "next/navigation"

export default async function PortfolioManagerPage({ params }: { params: { id: string } }) {
  const { id } = await params
  const manager = await fetchPortfolioManager(id)

  if (!manager) {
    notFound()
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Portfolio Manager Details</h1>
        <Link href="/admin/portfolio-managers">
          <Button variant="outline">Back to List</Button>
        </Link>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="font-semibold">Name</dt>
              <dd>{manager.displayName}</dd>
            </div>
            <div>
              <dt className="font-semibold">Email</dt>
              <dd>{manager.email}</dd>
            </div>
            <div>
              <dt className="font-semibold">Email Verified</dt>
              <dd>{manager.emailVerified ? "Yes" : "No"}</dd>
            </div>
            <div>
              <dt className="font-semibold">Account Status</dt>
              <dd>{manager.disabled ? "Disabled" : "Active"}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Metadata</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="font-semibold">Creation Time</dt>
              <dd>{new Date(manager.metadata.creationTime).toLocaleString()}</dd>
            </div>
            <div>
              <dt className="font-semibold">Last Sign In</dt>
              <dd>
                {manager.metadata.lastSignInTime ? new Date(manager.metadata.lastSignInTime).toLocaleString() : "Never"}
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Last Refresh</dt>
              <dd>
                {manager.metadata.lastRefreshTime
                  ? new Date(manager.metadata.lastRefreshTime).toLocaleString()
                  : "Never"}
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Tokens Valid After</dt>
              <dd>{new Date(manager.tokensValidAfterTime).toLocaleString()}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Custom Claims</CardTitle>
        </CardHeader>
        <CardContent>
          <dl>
            <dt className="font-semibold">Role</dt>
            <dd>{manager.customClaims.role}</dd>
          </dl>
        </CardContent>
      </Card>

      <div className="mt-6 space-x-4">
        <Button>Edit Manager</Button>
        <Button variant="destructive">Delete Manager</Button>
      </div>
    </div>
  )
}

