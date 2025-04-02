import { Card, CardContent, CardHeader } from "@/components/ui/card"

import ClientDetails from "../_components/ClientDetails"
import { Skeleton } from "@/components/ui/skeleton"
import { Suspense } from "react"
import { redirect } from "next/navigation"
import { verifySessionAndGetUser } from "@/lib/server-auth-utils"

export function ClientDetailsSkeleton() {
  'use client'
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-[200px]" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, index) => (
            <div key={index}>
              <Skeleton className="h-4 w-[100px] mb-2" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <Skeleton className="h-10 w-[120px]" />
          <Skeleton className="h-10 w-[120px]" />
        </div>
      </CardContent>
    </Card>
  );
}

export default async function ClientPage({ params }: { params: { id: string } }) {
  const session = await verifySessionAndGetUser()
  if (!session) {
    redirect("/login")
  }
  const id = await params.id
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Client Details</h1>
      <Suspense fallback={<ClientDetailsSkeleton />}>
        <ClientDetails id={id} token={session.token ?? ""} />
      </Suspense>
    </div>
  )
}

