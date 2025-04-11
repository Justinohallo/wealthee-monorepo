import { Clock } from "lucide-react";
import { UserCircle } from "lucide-react";

export function DataCacheAlert() {
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

export function UserInfoCard({ name, email, role, userId }: { name: string; email: string; role: string; userId: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Information</h2>
        <div className="flex items-start gap-4">
          <div className="bg-blue-100 rounded-full p-3">
            <UserCircle className="h-10 w-10 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-800">{name}</h3>
            <p className="text-gray-600">{email}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                {role}
              </span>
              <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                ID: {userId.substring(0, 8)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AccountSummary({
  accountInfo,
  hasSubscription
}: {
  accountInfo?: {
    id: string;
    name: string;
    balance: {
      total: {
        amount: number;
        currency: string;
      } | null;
    };
  };
  hasSubscription: boolean;
}) {
  if (!accountInfo) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Summary</h2>
        <div className="flex flex-col">
          <div className="mb-6">
            <p className="text-sm text-gray-500">Account Balance</p>
            <p className="text-3xl font-bold text-gray-900">
              {accountInfo.balance?.total
                ? `${accountInfo.balance.total.currency}$${accountInfo.balance.total.amount.toFixed(2)}`
                : '$0.00'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Account</p>
              <p className="font-medium">{accountInfo.name}</p>
              <p className="text-xs text-gray-500 mt-1">ID: {accountInfo.id.substring(0, 8)}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Subscription Status</p>
              <div className="flex items-center mt-1">
                <div className={`h-3 w-3 rounded-full ${hasSubscription ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                <p className="font-medium">{hasSubscription ? 'Active' : 'Inactive'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PortfolioCard({ account }: {
  account: {
    type: string;
    institution_name: string;
  }
}) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <p className="text-sm text-gray-500">Account Type</p>
          <p className="text-lg font-medium">{account.type || "Investment"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Institution</p>
          <p className="text-lg font-medium">{account.institution_name || "Brokerage"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Status</p>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
            <p className="text-lg font-medium">Connected</p>
          </div>
        </div>
      </div>
    </div>
  );
}
