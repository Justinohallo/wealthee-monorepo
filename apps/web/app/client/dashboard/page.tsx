import { AccountSummary, PortfolioCard, UserInfoCard } from "./_components";
import { Clock, Info } from "lucide-react";
import { getUserId, verifySessionAndGetUser } from "@/lib/server-auth-utils";

import { AccountActivities } from "@/components/account/AccountActivities";
import { AccountBalances } from "@/components/account/AccountBalances";
import { AccountHoldings } from "@/components/account/AccountHoldings";
import { AccountOrders } from "@/components/account/AccountOrders";
import { AccountPositions } from "@/components/account/AccountPositions";
import { getManagerPrimaryAccount } from "@/services/client/dashboard";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Dashboard | Wealthee",
  description: "View your portfolio and account information",
};

// Data Cache Alert component
function DataCacheAlert() {
  // Get yesterday's date formatted nicely (e.g., "May 15, 2023")
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const formattedDate = yesterday.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
      <div className="flex items-center gap-2 text-amber-800 text-sm">
        <Clock className="h-4 w-4 flex-shrink-0" />
        <span>Account data shown is cached as of market close on {formattedDate}. Market data is delayed by at least 15 minutes.</span>
      </div>
    </div>
  );
}

export default async function ClientDashboardPage() {
  // Verify the session
  const session = await verifySessionAndGetUser();
  if (!session) {
    redirect("/login");
  }

  // Get user ID and token from cookies
  const userId = await getUserId();
  const idToken = session.token;
  if (!userId || !idToken) {
    redirect("/login");
  }

  // Get claim data
  const { decodedClaims } = session;

  // Fetch the portfolio manager's primary account
  const response = await getManagerPrimaryAccount(decodedClaims.uid, idToken);

  if (!response) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">No account found</h1>
        <p className="text-gray-600">Please contact your administrator to set up your account.</p>
      </div>
    )
  }

  // For demo purposes - in a real app, this would come from the portfolio manager info
  const portfolioManager = {
    name: "Portfolio Manager",
    // This would be the actual image URL if available
    image: decodedClaims.picture || undefined,
  };

  const hasSubscription = true; // This would be fetched from actual subscription data

  // Create a properly typed account info for the AccountSummary component
  const accountSummaryInfo = response ? {
    id: response.accountDetails.id,
    name: response.accountDetails.name || "Account",
    balance: {
      total: response.accountDetails.balance?.total ? {
        amount: Number(response.accountDetails.balance.total.amount) || 0,
        currency: response.accountDetails.balance.total.currency || "USD"
      } : null
    }
  } : undefined;

  return (
    <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-7xl">
      <div className="space-y-8">
        {/* Enhanced Header Section */}
        <section className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Welcome, {decodedClaims.name}</h1>
                <p className="text-gray-500">Account: <span className="font-medium">{response.accountDetails.name}</span></p>
              </div>

              {/* Portfolio Quick Stats */}
              <div className="flex flex-wrap gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-500">Total Value</p>
                  <p className="text-xl font-bold text-gray-900">
                    {response.accountDetails.balance?.total
                      ? `${response.accountDetails.balance.total.currency}$${Number(response.accountDetails.balance.total.amount).toFixed(2)}`
                      : '$0.00'}
                  </p>
                </div>

                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-sm text-gray-500">Portfolio Manager</p>
                  <p className="text-md font-medium">{portfolioManager.name}</p>
                  <button className="text-blue-600 text-sm mt-1 hover:underline">Request Meeting</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Top Row: User Information and Portfolio Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Information */}
          <UserInfoCard
            name={decodedClaims.name}
            email={decodedClaims.email || ""}
            role={decodedClaims.role}
            userId={userId}
          />

          {/* Account Summary */}
          <AccountSummary
            accountInfo={accountSummaryInfo}
            hasSubscription={hasSubscription}
          />
        </div>

        {/* Portfolio Overview */}
        <section className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Portfolio Overview</h2>
            <PortfolioCard account={{
              type: response.accountDetails.type,
              institution_name: response.accountDetails.institution_name
            }} />
          </div>
        </section>

        {/* Account Details Section */}
        <h2 className="text-2xl font-semibold text-gray-800 px-1">Account Details</h2>

        {/* Data Cache Alert */}
        <DataCacheAlert />

        {/* Holdings and Balances */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AccountBalances
            portfolioManagerId={response.portfolioManagerId}
            snapTradeUserId={response.snapTradeUserId}
            accountId={response.accountDetails.id}
            idToken={idToken}
          />

          <AccountHoldings
            portfolioManagerId={response.portfolioManagerId}
            snapTradeUserId={response.snapTradeUserId}
            accountId={response.accountDetails.id}
            idToken={idToken}
          />
        </div>

        {/* Positions */}
        <AccountPositions
          portfolioManagerId={response.portfolioManagerId}
          snapTradeUserId={response.snapTradeUserId}
          accountId={response.accountDetails.id}
          idToken={idToken}
        />

        {/* Activities and Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AccountActivities
            portfolioManagerId={response.portfolioManagerId}
            snapTradeUserId={response.snapTradeUserId}
            accountId={response.accountDetails.id}
            idToken={idToken}
          />

          <AccountOrders
            portfolioManagerId={response.portfolioManagerId}
            snapTradeUserId={response.snapTradeUserId}
            accountId={response.accountDetails.id}
            idToken={idToken}
          />
        </div>

        {/* Portfolio Manager Insights */}
        <section className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Portfolio Manager Insights</h2>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 rounded-full p-3 shrink-0">
                  <Info className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Latest Update: Portfolio Strategy</h3>
                  <p className="text-gray-600 mt-1">
                    We're maintaining a cautious approach given market volatility.
                    Your portfolio is currently weighted towards stable tech stocks with strong fundamentals.
                    We'll look for opportunities to diversify in the coming weeks.
                  </p>
                  <p className="text-sm text-gray-500 mt-3">Updated: {new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
