import { createHttpFunction } from "../../utils/function-wrapper";
import { getAccountDetails as getSnapTradeAccountDetails } from "../../services/snaptrade/accounts";
/**
 * SnapTrade account related Cloud Functions
 */
import { snaptradeSecrets } from "../../config/secrets";

/**
 * Gets account details for a specific SnapTrade account
 */
export const getAccountDetails = createHttpFunction({
  options:
  {
    requireAuth: true,
    requiredRole: "portfolioManager",
    secrets: snaptradeSecrets,
  },
  handler: async ({ req, res }) => {
    // Get path parameters
    const { snapTradeUserId, accountId } = req.params;


    // We need to implement getSnapTradeUser helper function
    // For now this is a placeholder
    const snapTradeUser = {
      userId: snapTradeUserId,
      userSecret: "placeholder",
    };

    // Get account details using the service
    const accountDetails = await getSnapTradeAccountDetails(
      snapTradeUser.userId,
      snapTradeUser.userSecret,
      accountId
    );

    // Return success response
    res.json({
      success: true,
      data: accountDetails,
      timestamp: new Date().toISOString(),
    });
  },
});
