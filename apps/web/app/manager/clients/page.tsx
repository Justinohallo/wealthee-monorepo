import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusIcon, UsersIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { listClients } from "@/services/client/users";
import { redirect } from "next/navigation";
import { verifySessionAndGetUser } from "@/lib/server-auth-utils";

export const metadata = {
  title: "Clients | Wealthee",
  description: "Manage your clients",
};

export default async function ClientsPage() {
  const session = await verifySessionAndGetUser();
  if (!session) {
    redirect("/login");
  }

  const clients = await listClients(session.decodedClaims.uid, session.token ?? '');

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Clients</h1>
          <p className="text-muted-foreground">Manage your clients</p>
        </div>
        <Link href="/manager/clients/create">
          <Button>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        </Link>
      </div>

      {clients.length === 0 ? (
        <Card className="border border-dashed">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <UsersIcon className="h-12 w-12 text-muted-foreground" />
            </div>
            <CardTitle>No clients yet</CardTitle>
            <CardDescription>
              You have not added any clients to your portfolio yet.
              Get started by adding your first client.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Link href="/manager/clients/create">
              <Button>
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Your First Client
              </Button>
            </Link>
          </CardContent>
          <CardFooter className="text-center text-sm text-muted-foreground">
            Adding clients lets you manage their portfolios and track their investments.
          </CardFooter>
        </Card>
      ) : (
        <div className="rounded-md border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Email</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Created At</th>
                  <th className="p-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id} className="border-b">
                    <td className="p-2">{`${client.firstName} ${client.lastName}`}</td>
                    <td className="p-2">{client.email}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${client.status === "active" ? "bg-green-100 text-green-800" :
                        client.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        }`}>
                        {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-2">{new Date(client.createdAt).toLocaleDateString()}</td>
                    <td className="p-2 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/manager/clients/${client.id}`}>
                          <Button variant="ghost" size="sm">View</Button>
                        </Link>
                        <Link href={`/manager/clients/${client.id}/edit`}>
                          <Button variant="ghost" size="sm">Edit</Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

