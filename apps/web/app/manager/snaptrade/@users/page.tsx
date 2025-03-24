import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import Link from "next/link";
import { SNAPTRADE } from "@/constants/functionNames";
import { callFirebaseFunction } from "@/lib/firebase-functions";
import { verifySessionAndGetUser } from "@/lib/server-auth-utils";

// Define interface for user data
interface SnapTradeUser {
  id: string;
  displayName: string;
  createdAt: string;
  // Add other properties as needed once we know the actual data structure
}

// Function to fetch SnapTrade users
async function fetchSnapTradeUsers({ idToken, portfolioManagerId }: { idToken: string, portfolioManagerId: string }): Promise<SnapTradeUser[]> {
  try {
    const data = await callFirebaseFunction<{ data: { snapTradeUsers: SnapTradeUser[] } }>({
      idToken,
      functionName: SNAPTRADE.USERS.LIST_FOR_PORTFOLIO_MANAGER,
      queryParams: { portfolioManagerId },
      options: {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'GET',
        revalidate: 0 // Don't cache this data
      }
    });
    return data?.data?.snapTradeUsers || [];
  } catch (error) {
    console.error("Error fetching SnapTrade users:", error);
    throw new Error(error instanceof Error ? error.message : String(error));
  }
}

// Component to display the users table
function UsersTable({ users }: { users: SnapTradeUser[] }) {
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
              <TableCell>
                <Link
                  href={`/manager/snaptrade/${user.id}`}
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  View Details
                </Link>
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

// Main page component for the parallel route
export default async function SnaptradeUsersPage() {
  const user = await verifySessionAndGetUser();

  if (!user) {
    return <div>Unauthorized</div>
  }

  // Fetch SnapTrade users with error handling
  const users = await fetchSnapTradeUsers({ idToken: user?.token || '', portfolioManagerId: user?.decodedClaims.uid })
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden mt-6">
      <h2 className="text-xl font-semibold mb-4 px-4 pt-4">SnapTrade Users</h2>
      <UsersTable users={users} />
    </div>
  )
}
