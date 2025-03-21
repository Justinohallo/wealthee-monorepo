import { NotFoundError } from "../../utils/error-handling";
/**
 * SnapTrade account related Cloud Functions
 */
import { createHttpFunction } from "../../utils/function-wrapper";
import { snapTradeAccountService } from "../../services/snaptrade";
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
  handler: async ({ req, res, auth }) => {
    // Get path parameters
    const { snapTradeUserId, accountId } = req.params;

    if (!snapTradeUserId || !accountId) {
      throw new NotFoundError("Missing snapTradeUserId or accountId in path");
    }

    if (!auth) {
      throw new Error("Authentication required");
    }

    // We need to implement getSnapTradeUser helper function
    // For now this is a placeholder
    const snapTradeUser = {
      userId: snapTradeUserId,
      userSecret: "placeholder",
    };

    // Get account details using the service
    const accountDetails = await snapTradeAccountService.getAccountDetails(
      snapTradeUser.userId,
      snapTradeUser.userSecret,
      accountId
    );

    res.json({
      success: true,
      data: accountDetails,
      timestamp: new Date().toISOString(),
    });
  },

});
