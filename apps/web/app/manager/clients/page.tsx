import { Button } from "@/components/ui/button";
import ClientList from "./_components/ClientList";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
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

      <ClientList
        portfolioManagerId={session.decodedClaims.uid}
        token={session.token ?? ''}
      />
    </div>
  );
}

