import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, Home } from "lucide-react";

import ClientForm from "../_components/ClientForm";
import Link from "next/link";
import { redirect } from "next/navigation";
import { verifySessionAndGetUser } from "@/lib/server-auth-utils";

export const metadata = {
  title: "Add New Client | Wealthee",
  description: "Add a new client to your portfolio",
};

export default async function NewClientPage() {
  const session = await verifySessionAndGetUser();
  if (!session) {
    redirect("/login");
  }

  const portfolioManagerId = session.decodedClaims.uid;

  return (
    <div className="container mx-auto py-8">
      {/* Breadcrumbs - Mobile friendly with proper spacing */}
      <nav className="mb-6 flex flex-wrap items-center text-sm text-muted-foreground">
        <Link
          href="/manager/dashboard"
          className="flex items-center hover:text-primary transition-colors"
        >
          <Home className="h-4 w-4 mr-1" />
          <span className="sr-only sm:not-sr-only">Dashboard</span>
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link
          href="/manager/clients"
          className="hover:text-primary transition-colors"
        >
          Clients
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-foreground font-medium">Add New Client</span>
      </nav>

      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Add New Client</CardTitle>
          <CardDescription>
            Create a new client account. An email with login instructions will be sent to the client.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ClientForm portfolioManagerId={portfolioManagerId} idToken={session.token ?? ""} />
        </CardContent>
      </Card>
    </div>
  );
}

