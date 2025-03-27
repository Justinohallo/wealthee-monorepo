import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getSnapTradeBrokerageConnectionURL, listBrokerageConnections } from "@/services/snaptrade/connections";

import AccountsList from "./_components/AccountsList";
import { BrokerageAuthorization } from "@/types/snaptrade";
import { Button } from "@/components/ui/button";
import { DeleteBrokerageConnectionButton } from "./_components/DeleteBrokerageConnectionButton";
import { DeleteSnapTradeUserButton } from "../@users/_components/DeleteUserButton";
import Image from "next/image";
import Link from "next/link";
import { verifySessionAndGetUser } from "@/lib/server-auth-utils";

// Component to display a single brokerage row
function BrokerageRow({
  brokerage,
  snapTradeUserId,
  idToken,

}: {
  brokerage: BrokerageAuthorization,
  snapTradeUserId: string,
  idToken: string,
  userId: string
}) {
  return (
    <TableRow key={brokerage.id}>
      <TableCell>{brokerage.name}</TableCell>
      <TableCell className="flex items-center">
        {brokerage.brokerage?.aws_s3_logo_url && (
          <Image
            src={brokerage.brokerage.aws_s3_logo_url}
            alt={brokerage.brokerage.name || 'Brokerage logo'}
            className="h-6 w-6 mr-2 object-contain"
            width={24}
            height={24}
          />
        )}
        {brokerage.brokerage?.display_name || brokerage.brokerage?.name}
      </TableCell>
      <TableCell>{brokerage.type}</TableCell>
      <TableCell>{new Date(brokerage.created_date || '').toLocaleDateString()}</TableCell>
      <TableCell>
        <span className={`px-2 py-1 rounded text-xs font-medium ${brokerage.disabled ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          {brokerage.disabled ? 'Disabled' : 'Active'}
        </span>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <Link href={`/manager/snaptrade/${snapTradeUserId}/brokerage/${brokerage.id}`}>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </Link>
          <DeleteBrokerageConnectionButton
            idToken={idToken}
            snapTradeUserId={snapTradeUserId}
            brokerageId={brokerage.id || ''}
            brokerageName={brokerage.brokerage?.display_name || brokerage.brokerage?.name || 'Brokerage'}
          />
        </div>
      </TableCell>
    </TableRow>
  );
}

// Component to display the brokerages table
function BrokeragesTable({
  brokerages,
  snapTradeUserId,
  idToken,
  userId
}: {
  brokerages: BrokerageAuthorization[],
  snapTradeUserId: string,
  idToken: string,
  userId: string
}) {
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
            <BrokerageRow
              key={brokerage.id}
              brokerage={brokerage}
              snapTradeUserId={snapTradeUserId}
              idToken={idToken}
              userId={userId}
            />
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
  const session = await verifySessionAndGetUser();
  if (!session || !session.token) {
    return <div>Unauthorized</div>
  }

  const idToken = session.token;
  const portfolioManagerId = session.decodedClaims.uid;

  const awaitedParams = await params;
  const snaptradeUserId = awaitedParams.id

  // Fetch brokerage authorizations
  const brokerages = await listBrokerageConnections(snaptradeUserId, idToken);

  // Get SnapTrade login URL
  const loginUrl = await getSnapTradeBrokerageConnectionURL(portfolioManagerId, snaptradeUserId, idToken);

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

        <div className="flex space-x-4 mt-4">
          {loginUrl && (
            <a href={loginUrl} target="_blank" rel="noopener noreferrer">
              <Button>Add Brokerage</Button>
            </a>
          )}

          <div className="flex-shrink-0 opacity-100">
            <DeleteSnapTradeUserButton
              idToken={idToken}
              portfolioManagerId={portfolioManagerId}
              snapTradeUserId={snaptradeUserId}
              displayName="this SnapTrade user"
              redirectUrl="/manager/snaptrade"
            />
          </div>
        </div>
      </div>

      {/* Brokerages Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Connected Brokerages ({brokerages.length})</h2>
        <BrokeragesTable brokerages={brokerages} snapTradeUserId={snaptradeUserId} idToken={idToken} userId={portfolioManagerId} />
      </div>

      <AccountsList
        idToken={idToken}
        userId={portfolioManagerId}
        snapTradeUserId={snaptradeUserId}
      />
    </div>
  );
}
