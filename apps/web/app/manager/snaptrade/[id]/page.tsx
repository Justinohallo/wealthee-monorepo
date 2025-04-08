import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getSnapTradeBrokerageConnectionURL, listBrokerageConnections } from "@/services/snaptrade/connections";

import AccountsList from "./_components/AccountsList";
import { BrokerageAuthorization } from "@/types/snaptrade";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { DeleteBrokerageConnectionButton } from "./_components/DeleteBrokerageConnectionButton";
import { DeleteUserButton } from "../@users/_components/DeleteUserButton";
import Image from "next/image";
import Link from "next/link";
import { getPrimaryAccount } from "@/services/portfolioManager/primaryAccount";
import { verifySessionAndGetUser } from "@/lib/server-auth-utils";

// Create a responsive version of the brokerages table
function ResponsiveBrokeragesTable({
  brokerages,
  snapTradeUserId,
  idToken,
}: {
  brokerages: BrokerageAuthorization[],
  snapTradeUserId: string,
  idToken: string,
}) {
  if (brokerages.length === 0) {
    return (
      <div className="text-center py-6 px-4 bg-muted/20 rounded-md">
        <p className="text-muted-foreground">No brokerage connections found</p>
      </div>
    );
  }

  return (
    <div>
      {/* Mobile view - Card layout */}
      <div className="md:hidden space-y-4">
        {brokerages.map((brokerage) => (
          <Card key={brokerage.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-4 border-b bg-muted/10 flex items-center gap-2">
                {brokerage.brokerage?.aws_s3_logo_url && (
                  <Image
                    src={brokerage.brokerage.aws_s3_logo_url}
                    alt={brokerage.brokerage.name || 'Brokerage logo'}
                    className="h-6 w-6 object-contain"
                    width={24}
                    height={24}
                  />
                )}
                <div className="flex-1">
                  <div className="font-medium">{brokerage.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {brokerage.brokerage?.display_name || brokerage.brokerage?.name}
                  </div>
                </div>
                <div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${brokerage.disabled ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {brokerage.disabled ? 'Disabled' : 'Active'}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Type</span>
                  <span>{brokerage.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Created</span>
                  <span>{new Date(brokerage.created_date || '').toLocaleDateString()}</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mt-4 pt-3 border-t">
                  <Link href={`/manager/snaptrade/${snapTradeUserId}/brokerage/${brokerage.id}`} className="w-full sm:w-auto">
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </Link>
                  <div className="w-full sm:w-auto">
                    <DeleteBrokerageConnectionButton
                      idToken={idToken}
                      snapTradeUserId={snapTradeUserId}
                      brokerageId={brokerage.id || ''}
                      brokerageName={brokerage.brokerage?.display_name || brokerage.brokerage?.name || 'Brokerage'}
                      buttonClassName="w-full h-9"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop view - Table layout */}
      <div className="hidden md:block overflow-x-auto">
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
            {brokerages.map((brokerage) => (
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
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
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
  const brokeragesPromise = listBrokerageConnections(snaptradeUserId, idToken);

  // Get SnapTrade login URL
  const loginUrlPromise = getSnapTradeBrokerageConnectionURL(portfolioManagerId, snaptradeUserId, idToken);

  // Fetch the primary account data for the portfolio manager
  const primaryAccountPromise = getPrimaryAccount(portfolioManagerId, idToken);

  // Wait for all fetches to complete
  const [brokerages, loginUrl, primaryAccount] = await Promise.all([
    brokeragesPromise,
    loginUrlPromise,
    primaryAccountPromise,
  ]);

  return (
    <div className="space-y-6">
      {/* Header with breadcrumb and title */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Link href="/manager/snaptrade" className="inline-flex items-center text-sm font-medium text-primary hover:underline">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to SnapTrade
            </Link>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">SnapTrade User Details</h1>
        </div>
      </div>

      {/* User ID card with buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">User ID</h2>
            <p className="text-sm font-mono text-muted-foreground p-3 bg-muted/30 rounded-md break-all">{snaptradeUserId}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            {loginUrl && (
              <a href={loginUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto">Add Brokerage</Button>
              </a>
            )}

            <div className="w-full sm:w-auto">
              <DeleteUserButton
                idToken={idToken}
                portfolioManagerId={portfolioManagerId}
                snapTradeUserId={snaptradeUserId}
                userName="SnapTrade User"
                buttonClassName="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Brokerages Card */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Brokerages ({brokerages.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveBrokeragesTable
            brokerages={brokerages}
            snapTradeUserId={snaptradeUserId}
            idToken={idToken}
          />
        </CardContent>
      </Card>

      {/* Accounts List - handled by the AccountsList component */}
      <AccountsList
        idToken={idToken}
        snapTradeUserId={snaptradeUserId}
        primaryAccount={primaryAccount}
        portfolioManagerId={portfolioManagerId}
      />
    </div>
  );
}
