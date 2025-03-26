import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { fetchBrokerageAuthorization } from "@/services/snaptrade/connections";
import { verifySessionAndGetUser } from "@/lib/server-auth-utils";

export default async function BrokerageDetailPage({
  params
}: {
  params: { id: string; brokerageId: string }
}) {
  const session = await verifySessionAndGetUser();
  if (!session) {
    return <div>Unauthorized</div>
  }

  const idToken = session.token || '';
  const userId = session.decodedClaims.uid;

  const awaitedParams = await params;
  const snapTradeUserId = awaitedParams.id;
  const brokerageId = awaitedParams.brokerageId;

  // Fetch brokerage details
  const brokerage = await fetchBrokerageAuthorization(
    {
      userId,
      brokerageId,
      snapTradeUserId,
      idToken
    }
  );

  if (!brokerage) {
    return (
      <div className="p-8">
        <div className="flex items-center mb-6">
          <Link href={`/manager/snaptrade/${snapTradeUserId}`}>
            <Button variant="outline" size="sm" className="mr-4">
              Back to User
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Brokerage Not Found</h1>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="text-yellow-700">
            The requested brokerage could not be found. It may have been deleted or you may not have permission to view it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center">
          <Link href={`/manager/snaptrade/${snapTradeUserId}`}>
            <Button variant="outline" size="sm" className="mr-4">
              Back to User
            </Button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold">Brokerage Details</h1>
        </div>
        <div>
          <Badge
            variant={brokerage.disabled ? "destructive" : "outline"}
            className="text-xs px-3 py-1 rounded-full"
          >
            {brokerage.disabled ? 'Disabled' : 'Active'}
          </Badge>
        </div>
      </div>

      {/* Brokerage Header */}
      <div className="bg-white rounded-lg shadow overflow-hidden p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
          <div className="flex-shrink-0">
            {brokerage.brokerage?.aws_s3_logo_url && (
              <Image
                src={brokerage.brokerage.aws_s3_logo_url}
                alt={brokerage.brokerage?.name || ''}
                width={64}
                height={64}
                className="h-16 w-16 object-contain rounded-md bg-gray-50 p-2"
              />
            )}
          </div>
          <div className="flex-grow">
            <h2 className="text-2xl font-bold">{brokerage.name}</h2>
            <p className="text-gray-500">
              {brokerage.brokerage?.display_name || brokerage.brokerage?.name}
            </p>
            {brokerage.brokerage?.url && (
              <a
                href={brokerage.brokerage.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm mt-1 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Visit Website
              </a>
            )}
          </div>
        </div>

        {brokerage.brokerage?.description && (
          <div className="mb-6 p-4 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
            <p className="text-gray-600 text-sm">{brokerage.brokerage.description}</p>
          </div>
        )}

        {/* Key Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Connection ID</h3>
            <p className="text-gray-900 font-mono text-sm mt-1">{brokerage.id}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Connection Type</h3>
            <p className="text-gray-900 mt-1">{brokerage.type}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Created Date</h3>
            <p className="text-gray-900 mt-1">{brokerage.created_date ? new Date(brokerage.created_date).toLocaleDateString() : 'N/A'}</p>
          </div>

        </div>
      </div>

      {/* Brokerage Details */}
      <div className="bg-white rounded-lg shadow overflow-hidden p-6">
        <h2 className="text-xl font-semibold mb-4">Brokerage Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Brokerage ID</h3>
            <p className="text-gray-900 font-mono text-sm mt-1">{brokerage.brokerage?.id || 'N/A'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Slug</h3>
            <p className="text-gray-900 mt-1">{brokerage.brokerage?.slug || 'N/A'}</p>
          </div>

          {brokerage.brokerage?.allows_trading !== undefined && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Trading Support</h3>
              <p className="text-gray-900 mt-1">{brokerage.brokerage.allows_trading ? 'Supported' : 'Not Supported'}</p>
            </div>
          )}

          {brokerage.brokerage?.maintenance_mode !== undefined && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Maintenance Mode</h3>
              <p className="text-gray-900 mt-1">{brokerage.brokerage.maintenance_mode ? 'Yes' : 'No'}</p>
            </div>
          )}
        </div>

        {brokerage.brokerage?.brokerage_type && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Brokerage Type</h3>
            <div className="p-3 bg-gray-50 rounded-md">
              <p className="text-gray-900">Name: {brokerage.brokerage.brokerage_type.name}</p>
              <p className="text-gray-900 font-mono text-xs mt-1">ID: {brokerage.brokerage.brokerage_type.id}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
