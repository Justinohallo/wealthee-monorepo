"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface Client {
  id: string
  name: string
  email: string
  aum: string
  lastContact: string
  portfolioPerformance: string
}

export default function ClientDetails({ id }: { id: string }) {
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchClient = async () => {
      setLoading(true)
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/clients/${id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch client data")
        }
        const data = await response.json()
        setClient(data)
      } catch (error) {
        console.error("Error fetching client:", error)
        toast({
          title: "Error",
          description: "Failed to load client data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchClient()
  }, [id, toast])

  if (loading) {
    return <ClientDetailsSkeleton />
  }

  if (!client) {
    return <div>Client not found</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{client.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold">Email</h3>
            <p>{client.email}</p>
          </div>
          <div>
            <h3 className="font-semibold">Assets Under Management</h3>
            <p>{client.aum}</p>
          </div>
          <div>
            <h3 className="font-semibold">Last Contact</h3>
            <p>{client.lastContact}</p>
          </div>
          <div>
            <h3 className="font-semibold">Portfolio Performance</h3>
            <p>{client.portfolioPerformance}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <Button variant="outline" onClick={() => router.push("/manager/clients")}>
            Back to Clients
          </Button>
          <Button>Edit Client</Button>
        </div>
      </CardContent>
    </Card>
  )
}

function ClientDetailsSkeleton() {
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
  )
}

