import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import AccountsList from "./_components/AccountsList";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { verifySessionAndGetUser } from "@/lib/server-auth-utils";

// Define interface for brokerage data
interface BrokerageAuthorization {
  id: string;
  created_date: string;
  updated_date: string;
  name: string;
  type: string;
  disabled: boolean;
  brokerage: {
    id: string;
    name: string;
    description: string;
    slug: string;
    display_name: string;
    aws_s3_logo_url: string;
  };
}

// Function to fetch brokerage authorizations
async function fetchBrokerageAuthorizations({ idToken, userId }: { idToken: string, userId: string }): Promise<BrokerageAuthorization[]> {
  try {
    const response = await fetch(`https://portfoliomanager-listbrokerageauthorizations-zncz3ts4ka-uc.a.run.app?userId=${userId}`, {
      headers: {
        'Authorization': `Bearer ${idToken}`
      }
    });

    if (response.status === 401) {
      console.error('Unauthorized: Please check your authentication credentials');
      return [];
    }

    if (response.status === 404) {
      console.error('Resource not found');
      console.log(response)
      return [];
    }


    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return [];
    }

    const data = await response.json();
    return data.brokerageAuthorizations || [];
  } catch (error) {
    console.error("Error fetching brokerage authorizations:", error);
    return [];
  }
}

// Function to get SnapTrade login URL
async function getSnapTradeLoginUrl({ idToken, userId, snapTradeUserId }: { idToken: string, userId: string, snapTradeUserId: string }): Promise<string | null> {
  console.log({ idToken, userId, snapTradeUserId })
  try {
    const response = await fetch(`https://portfoliomanager-loginsnaptradeuser-zncz3ts4ka-uc.a.run.app?userId=${userId}&snapTradeUserId=${snapTradeUserId}`, {
      headers: {
        'Authorization': `Bearer ${idToken}`
      }
    });

    if (response.status === 401) {
      console.error('Unauthorized: Please check your authentication credentials');
      return null;
    }

    if (!response.ok) {
      const result = await response.json();
      console.log(result)
      console.error(`HTTP error! status: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data.loginResponse.redirectURI || null;
  } catch (error) {
    console.error("Error fetching SnapTrade login URL:", error);
    return null;
  }
}

// Component to display the brokerages table
function BrokeragesTable({ brokerages, snapTradeUserId }: { brokerages: BrokerageAuthorization[], snapTradeUserId: string }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Brokerage</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Created Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {brokerages.length > 0 ? (
          brokerages.map((brokerage) => (
            <TableRow key={brokerage.id}>
              <TableCell>{brokerage.name}</TableCell>
              <TableCell className="flex items-center">
                {brokerage.brokerage.aws_s3_logo_url && (
                  <Image
                    src={brokerage.brokerage.aws_s3_logo_url}
                    alt={brokerage.brokerage.name}
                    width={24}
                    height={24}
                    className="h-6 w-6 mr-2 object-contain"
                  />
                )}
                {brokerage.brokerage.display_name || brokerage.brokerage.name}
              </TableCell>
              <TableCell>{brokerage.type}</TableCell>
              <TableCell>{new Date(brokerage.created_date).toLocaleDateString()}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded text-xs font-medium ${brokerage.disabled ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                  {brokerage.disabled ? 'Disabled' : 'Active'}
                </span>
              </TableCell>
              <TableCell>
                <Link href={`/manager/snaptrade/${snapTradeUserId}/brokerage/${brokerage.id}`}>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-4">
              No brokerage connections found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default async function SnaptradeUserPage({ params }: { params: { id: string } }) {
  const user = await verifySessionAndGetUser();
  if (!user) {
    return <div>Unauthorized</div>
  }
  const awaitedParams = await params;
  const snaptradeUserId = awaitedParams.id

  // Fetch brokerage authorizations
  const brokerages = await fetchBrokerageAuthorizations({
    idToken: user?.token || '',
    userId: snaptradeUserId
  });
  // Get SnapTrade login URL
  const loginUrl = await getSnapTradeLoginUrl({
    idToken: user?.token || '',
    userId: user?.decodedClaims.uid,
    snapTradeUserId: snaptradeUserId
  });

  return (
    <div className="p-8">
      <div className="flex items-center mb-6">
        <Link href="/manager/snaptrade">
          <Button variant="outline" size="sm" className="mr-4">
            Back to SnapTrade
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">SnapTrade User Details</h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden p-6 mb-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">User ID</h2>
          <p className="text-gray-700 p-3 bg-gray-50 rounded-md">{snaptradeUserId}</p>
        </div>

        {loginUrl && (
          <div className="mt-4">
            <a href={loginUrl} target="_blank" rel="noopener noreferrer">
              <Button>Login to SnapTrade</Button>
            </a>
          </div>
        )}
      </div>

      {/* Brokerages Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Connected Brokerages ({brokerages.length})</h2>
        <BrokeragesTable brokerages={brokerages} snapTradeUserId={snaptradeUserId} />
      </div>

      <AccountsList
        idToken={user?.token || ''}
        userId={user?.decodedClaims.uid}
        snapTradeUserId={snaptradeUserId}
      />
    </div>
  );
}
