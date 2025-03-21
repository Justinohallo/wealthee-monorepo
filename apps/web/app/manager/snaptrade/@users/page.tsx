import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import Link from "next/link";
import { verifySessionAndGetUser } from "@/lib/server-auth-utils";

// Define interface for user data
interface SnapTradeUser {
  id: string;
  displayName: string;
  createdAt: number;
  // Add other properties as needed once we know the actual data structure
}

// Function to fetch SnapTrade users from HTTP endpoint
async function fetchSnapTradeUsers({ idToken, userId }: { idToken: string, userId: string }): Promise<SnapTradeUser[]> {
  try {
    // This is a placeholder - we'll replace with the actual endpoint later
    const response = await fetch(`https://portfoliomanager-getsnaptradeusers-zncz3ts4ka-uc.a.run.app?userId=${userId}`, {
      headers: {
        'Authorization': `Bearer ${idToken}`
      }
    })


    if (response.status === 401) {
      throw new Error('Unauthorized: Please check your authentication credentials')
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }


    const { snapTradeUsers } = await response.json()
    return snapTradeUsers as SnapTradeUser[]
  } catch (error) {
    throw new Error(error as string)

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
  const users = await fetchSnapTradeUsers({ idToken: user?.token || '', userId: user?.decodedClaims.uid })
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden mt-6">
      <h2 className="text-xl font-semibold mb-4 px-4 pt-4">SnapTrade Users</h2>
      <UsersTable users={users} />
    </div>
  )
}
