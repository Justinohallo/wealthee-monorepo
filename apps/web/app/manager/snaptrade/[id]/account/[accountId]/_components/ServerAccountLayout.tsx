import { Account } from "@/types/snaptrade";
import { AccountActivities } from "./AccountActivities";
import { AccountOrders } from "./AccountOrders";
import { AccountPositions } from "./AccountPositions";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { ResponsiveAccountSummary } from "@/components/account/responsive-account-summary";
import { ResponsiveContainer } from "@/components/ui/responsive-container";
import { ResponsiveTabsClient } from "./ResponsiveTabsClient";
import { SetPrimaryAccountButton } from "@/components/snaptrade/SetPrimaryAccountButton";

interface ServerAccountLayoutProps {
  account: Account;
  idToken: string;
  snapTradeUserId: string;
  accountId: string;
  isPrimary: boolean;
  portfolioManagerId: string;
}

/**
 * Server component that handles the account page layout
 * This component is responsible for:
 * - Defining the overall page structure
 * - Using client components for responsive behavior
 * - Providing data for child components
 */
export function ServerAccountLayout({
  account,
  idToken,
  snapTradeUserId,
  accountId,
  isPrimary,
  portfolioManagerId,
}: ServerAccountLayoutProps) {
  // Transform account data to match the format expected by ResponsiveAccountSummary
  const accountData = {
    id: account.id,
    name: account.name || "Account", // Provide default for name if null
    number: account.number,
    institution_name: account.institution_name,
    status: "Open", // Assuming account is open if we're viewing it
    meta: {
      type: account.type,
      status: "open" as "open" | "closed"
    },
    balance: {
      totalValue: account.total_value?.amount,
      cash: account.cash?.amount,
      investments: account.total_value?.amount
        ? (account.total_value.amount - (account.cash?.amount || 0))
        : undefined,
      buyingPower: account.buying_power?.amount
    },
    currency: account.total_value?.currency
  };

  // Create the content for each section
  const positionsContent = (
    <AccountPositions
      portfolioManagerId={portfolioManagerId}
      snapTradeUserId={snapTradeUserId}
      accountId={accountId}
      idToken={idToken}
    />
  );

  const activitiesContent = (
    <AccountActivities
      portfolioManagerId={portfolioManagerId}
      snapTradeUserId={snapTradeUserId}
      accountId={accountId}
      idToken={idToken}
    />
  );

  const ordersContent = (
    <AccountOrders
      portfolioManagerId={portfolioManagerId}
      snapTradeUserId={snapTradeUserId}
      accountId={accountId}
      idToken={idToken}
    />
  );

  return (
    <ResponsiveContainer>
      {/* Back button and Set Primary Button (aligned) */}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Link href={`/manager/snaptrade/${snapTradeUserId}`}>
          <Button variant="outline" size="sm" className="flex items-center gap-1 min-h-[44px] sm:min-h-[32px]">
            <ChevronLeft className="h-4 w-4" />
            Back to Accounts
          </Button>
        </Link>
        <SetPrimaryAccountButton
          snapTradeUserId={snapTradeUserId}
          accountId={accountId}
          accountName={account.name || "Account"}
          isPrimary={isPrimary}
          idToken={idToken}
          portfolioManagerId={portfolioManagerId}
        />
      </div>

      {/* Account Summary */}
      <div className="mb-4 sm:mb-6">
        <ResponsiveAccountSummary
          account={accountData}
        />
      </div>

      {/* Content Sections using client component for responsive layout */}
      <ResponsiveTabsClient
        positionsContent={positionsContent}
        activitiesContent={activitiesContent}
        ordersContent={ordersContent}
      />
    </ResponsiveContainer>
  );
}
