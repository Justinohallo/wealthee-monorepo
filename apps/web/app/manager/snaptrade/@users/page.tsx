import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SnapTradeUser, listSnapTradeUsersForPortfolioManager } from "@/services/snaptrade/users";

import { SnapTradeUsersTable } from "../_components/SnapTradeUsersTable";
import { verifySessionAndGetUser } from "@/lib/server-auth-utils";

// Function to fetch SnapTrade users
async function fetchSnapTradeUsers({ idToken, portfolioManagerId }: { idToken: string, portfolioManagerId: string }): Promise<SnapTradeUser[]> {
  try {
    return await listSnapTradeUsersForPortfolioManager(portfolioManagerId, idToken);
  } catch (error) {
    console.error("Error fetching SnapTrade users:", error);
    throw new Error(error instanceof Error ? error.message : String(error));
  }
}

// Page component
export default async function UsersPage() {
  const sessionData = await verifySessionAndGetUser();

  if (!sessionData) {
    return <div>Unauthorized</div>;
  }

  const { decodedClaims, token } = sessionData;
  const idToken = token || '';
  const userId = decodedClaims.uid;

  // Fetch SnapTrade users for the portfolio manager
  let users: SnapTradeUser[] = [];
  let error = null;

  try {
    users = await fetchSnapTradeUsers({
      idToken,
      portfolioManagerId: userId,
    });
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
    console.error("Error in UsersPage:", error);
  }

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-2xl font-bold">SnapTrade Users</CardTitle>
          <CardDescription>
            Manage your SnapTrade users here
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0 pt-2">
          {error ? (
            <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded-md">
              Error: {error}
            </div>
          ) : (
            <SnapTradeUsersTable
              users={users}
              idToken={idToken}
              portfolioManagerId={userId}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
