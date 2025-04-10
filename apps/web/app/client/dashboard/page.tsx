import { AccountSummary, DashboardHeader, PortfolioCard, UserInfoCard } from "./_components";
import { getUserId, verifySessionAndGetUser } from "@/lib/server-auth-utils";

import { AccountActivities } from "@/components/account/AccountActivities";
import { AccountBalances } from "@/components/account/AccountBalances";
import { AccountHoldings } from "@/components/account/AccountHoldings";
import { AccountOrders } from "@/components/account/AccountOrders";
import { getManagerPrimaryAccount } from "@/services/client/dashboard";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Dashboard | Wealthee",
  description: "View your portfolio and account information",
};

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
      <div>
        <h1>No account found</h1>
      </div>
    )
  }

  const user = {
    name: decodedClaims.name,
    email: decodedClaims.email,
  };

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
    <main className="container py-6 space-y-6">
      <DashboardHeader
        user={user}
        portfolioManagerName={portfolioManager.name}
        portfolioManagerImage={portfolioManager.image}
      />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Your Portfolio</h2>
        <PortfolioCard account={response.accountDetails} />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Account Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AccountSummary
            accountInfo={accountSummaryInfo}
            hasSubscription={hasSubscription}
          />

          <UserInfoCard
            name={decodedClaims.name}
            email={decodedClaims.email}
            role={decodedClaims.role}
            userId={userId}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Account Details</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="min-h-[350px]">
            <AccountBalances
              portfolioManagerId={response.portfolioManagerId}
              snapTradeUserId={response.snapTradeUserId}
              accountId={response.accountDetails.id}
              idToken={idToken}
            />
          </div>

          <div className="min-h-[350px]">
            <AccountHoldings
              portfolioManagerId={response.portfolioManagerId}
              snapTradeUserId={response.snapTradeUserId}
              accountId={response.accountDetails.id}
              idToken={idToken}
            />
          </div>

          <div className="min-h-[350px]">
            <AccountActivities
              portfolioManagerId={response.portfolioManagerId}
              snapTradeUserId={response.snapTradeUserId}
              accountId={response.accountDetails.id}
              idToken={idToken}
            />
          </div>

          <div className="min-h-[350px]">
            <AccountOrders
              portfolioManagerId={response.portfolioManagerId}
              snapTradeUserId={response.snapTradeUserId}
              accountId={response.accountDetails.id}
              idToken={idToken}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
