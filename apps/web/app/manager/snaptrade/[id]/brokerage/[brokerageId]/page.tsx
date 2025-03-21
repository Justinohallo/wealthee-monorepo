import { Button } from "@/components/ui/button";
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

// Function to fetch specific brokerage authorization
async function fetchBrokerageAuthorization({
  idToken,
  userId,
  brokerageId,
  snapTradeUserId
}: {
  idToken: string,
  userId: string,
  brokerageId: string,
  snapTradeUserId: string
}): Promise<BrokerageAuthorization | null> {
  try {
    const response = await fetch(`https://portfoliomanager-detailbrokerageauthorization-zncz3ts4ka-uc.a.run.app
?userId=${userId}&authorizationId=${brokerageId}&snapTradeUserId=${snapTradeUserId}`, {
      headers: {
        'Authorization': `Bearer ${idToken}`
      }
    });

    if (!response.ok) {
      console.log(await response.json());
      console.error(`HTTP error! status: ${response.status}`);
      return null;
    }

    const data = await response.json();
    console.log(data);
    const brokerage = data.brokerageAuthorization

    // Find the specific brokerage by ID

    return brokerage || null;
  } catch (error) {
    console.error("Error fetching brokerage authorization:", error);
    return null;
  }
}

export default async function BrokerageDetailPage({
  params
}: {
  params: { id: string; brokerageId: string }
}) {
  const user = await verifySessionAndGetUser();
  if (!user) {
    return <div>Unauthorized</div>
  }
  const awaitedParams = await params;
  const snapTradeUserId = awaitedParams.id;
  const brokerageId = awaitedParams.brokerageId;

  // Fetch brokerage details
  const brokerage = await fetchBrokerageAuthorization({
    idToken: user?.token || '',
    userId: user.decodedClaims.uid,
    brokerageId,
    snapTradeUserId: snapTradeUserId
  });

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
    <div className="p-8">
      <div className="flex items-center mb-6">
        <Link href={`/manager/snaptrade/${snapTradeUserId}`}>
          <Button variant="outline" size="sm" className="mr-4">
            Back to User
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Brokerage Details</h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden p-6 mb-6">
        <div className="flex items-center mb-6">
          {brokerage.brokerage.aws_s3_logo_url && (
            <img
              src={brokerage.brokerage.aws_s3_logo_url}
              alt={brokerage.brokerage.name}
              className="h-12 w-12 mr-4 object-contain"
            />
          )}
          <div>
            <h2 className="text-2xl font-bold">
              {brokerage.name}
            </h2>
            <p className="text-gray-500">
              {brokerage.brokerage.display_name || brokerage.brokerage.name}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Brokerage ID</h3>
            <p className="text-gray-900">{brokerage.id}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Type</h3>
            <p className="text-gray-900">{brokerage.type}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Created Date</h3>
            <p className="text-gray-900">{new Date(brokerage.created_date).toLocaleDateString()}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Last Updated</h3>
            <p className="text-gray-900">{new Date(brokerage.updated_date).toLocaleDateString()}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
            <span className={`px-2 py-1 rounded text-xs font-medium ${brokerage.disabled ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
              {brokerage.disabled ? 'Disabled' : 'Active'}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden p-6">
        <h2 className="text-xl font-semibold mb-4">Brokerage Information</h2>

        {brokerage.brokerage.description && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
            <p className="text-gray-700">{brokerage.brokerage.description}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Brokerage ID</h3>
            <p className="text-gray-900">{brokerage.brokerage.id}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Slug</h3>
            <p className="text-gray-900">{brokerage.brokerage.slug}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
