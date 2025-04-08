import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { redirect } from "next/navigation";
import { verifySessionAndGetUser } from "@/lib/server-auth-utils";

export const metadata = {
    title: "Client Settings | Wealthee",
    description: "Manage your account settings",
};

export default async function ClientSettingsPage() {
    const session = await verifySessionAndGetUser();

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold mb-2">Settings</h1>
            <p className="text-muted-foreground mb-6">Manage your account settings and preferences</p>

            <div className="grid grid-cols-1 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Account Information</CardTitle>
                        <CardDescription>
                            View and manage your account details
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                                <p>{session.decodedClaims.email}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                                <p>{session.decodedClaims.name || "Not specified"}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">User ID</h3>
                                <p className="text-sm font-mono bg-muted p-2 rounded">{session.decodedClaims.uid}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Communication Preferences</CardTitle>
                        <CardDescription>
                            Manage how we communicate with you
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            Communication preferences are managed by your portfolio manager.
                            Please contact them to update your preferences.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
