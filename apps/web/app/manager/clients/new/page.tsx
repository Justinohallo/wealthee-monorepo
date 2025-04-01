import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { AddClientFormData } from "@/types/client";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { addClient } from "@/services/client/users";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { verifySessionAndGetUser } from "@/lib/server-auth-utils";

export const metadata = {
  title: "Add Client | Wealthee",
  description: "Add a new client to your portfolio",
};

async function createClient(formData: FormData) {
  "use server";

  const session = await verifySessionAndGetUser();
  if (!session || !session.token) {
    throw new Error("No authentication token available");
  }

  const portfolioManagerId = session.decodedClaims.uid;

  const clientData: AddClientFormData = {
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    email: formData.get("email") as string,
  };

  try {
    await addClient(clientData, session.token, portfolioManagerId);
    revalidatePath("/manager/clients");
    return { success: true };
  } catch (error) {
    console.error("Error creating client:", error);
    return { success: false, error: (error as Error).message };
  }
}

export default async function AddClientPage() {
  const session = await verifySessionAndGetUser();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-6">
        <Link href="/manager/clients" className="mr-4">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Clients
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Add New Client</h1>
      </div>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
          <CardDescription>
            Enter the details of your new client. They will receive an email with login information.
          </CardDescription>
        </CardHeader>
        <form action={async (formData) => {
          const result = await createClient(formData);
          if (result.success) {
            redirect("/manager/clients");
          }
        }}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="John"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john.doe@example.com"
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Add Client
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
