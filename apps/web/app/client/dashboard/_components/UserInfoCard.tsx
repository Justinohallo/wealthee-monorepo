import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UserInfoCardProps {
    name: string | null | undefined;
    email: string | null | undefined;
    role: string | null | undefined;
    userId: string | null | undefined;
}

export function UserInfoCard({ name, email, role, userId }: UserInfoCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Information</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <div className="flex justify-between items-center border-b pb-2">
                        <span className="text-sm font-medium text-muted-foreground">Name</span>
                        <span>{name || "Not provided"}</span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-2">
                        <span className="text-sm font-medium text-muted-foreground">Email</span>
                        <span>{email || "Not provided"}</span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-2">
                        <span className="text-sm font-medium text-muted-foreground">Account Type</span>
                        <span>{role || "Client"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-muted-foreground">User ID</span>
                        <span className="font-mono text-xs">{userId}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
