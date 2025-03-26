import { SnapTradeUser, listSnapTradeUsersForPortfolioManager } from "@/services/snaptrade/users";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { DeleteSnapTradeUserButton } from "./_components/DeleteUserButton";
import Link from "next/link";
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

// Component to display the users table
function UsersTable({ users, idToken, portfolioManagerId }: { users: SnapTradeUser[], idToken: string, portfolioManagerId: string }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User ID</TableHead>
          <TableHead>Display Name</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length > 0 ? (
          users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.displayName}</TableCell>
              <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
              <TableCell className="opacity-100">
                <div className="flex space-x-2 opacity-100">
                  <Link
                    href={`/manager/snaptrade/${user.id}`}
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    View Details
                  </Link>
                  <DeleteSnapTradeUserButton
                    idToken={idToken}
                    portfolioManagerId={portfolioManagerId}
                    snapTradeUserId={user.id}
                    displayName={user.displayName}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-4">
              No SnapTrade users found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
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
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">SnapTrade Users</h1>
        <p className="text-muted-foreground">
          Manage your SnapTrade users here
        </p>
      </div>

      {error ? (
        <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded-md">
          Error: {error}
        </div>
      ) : (
        <UsersTable users={users} idToken={idToken} portfolioManagerId={userId} />
      )}
    </div>
  );
}
