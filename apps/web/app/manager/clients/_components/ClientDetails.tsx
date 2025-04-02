"use server"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { ClientStatusBadge } from "./ClientStatusBadge"
import { Link } from "lucide-react"
import { getClient } from "@/services/client/users"

interface ClientDetailsProps {
  id: string;
  token: string;
}
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
};
export default async function ClientDetails({ id, token }: ClientDetailsProps) {
  const client = await getClient(id, token);
  if (!client) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-xl font-semibold mb-2">Client not found</h3>
        <p className="text-muted-foreground mb-4">The client you requested does not exist or you do not have permission to view it.</p>
        <Button variant="outline" asChild>
          <Link href="/manager/clients">Back to Clients</Link>
        </Button>
      </div>
    );
  }



  return (
    <Card>
      <CardHeader>
        <CardTitle>{client.firstName} {client.lastName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold">Email</h3>
            <p>{client.email}</p>
          </div>
          <div>
            <h3 className="font-semibold">Status</h3>
            <p><ClientStatusBadge status={client.status} /></p>
          </div>
          <div>
            <h3 className="font-semibold">Created On</h3>
            <p>{formatDate(client.createdAt)}</p>
          </div>
          <div>
            <h3 className="font-semibold">Last Updated</h3>
            <p>{formatDate(client.updatedAt)}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <Button variant="outline" asChild>
            <Link href="/manager/clients">Back to Clients</Link>
          </Button>
          <Button asChild>
            <Link href={`/manager/clients/${client.id}/edit`}>Edit Client</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}



