import { Request, Response } from "express";
import { getPrimaryAccount, setPrimaryAccount } from "../../services/portfolioManager/primaryAccount";

import { createHttpFunction } from "../../utils/function-wrapper";
import { logger } from "../../utils/logger";

// Define the basic handler context without auth
interface PrimaryAccountHandlerContext {
  req: Request;
  res: Response;
}

/**
 * Sets a specific account as the primary account for a Portfolio Manager.
 * Requires portfolioManagerId and accountId in the request body.
 */
export const setPrimaryAccountHandler = createHttpFunction({
  handler: async (context: PrimaryAccountHandlerContext) => {
    const { req, res } = context;
    const { portfolioManagerId, accountId } = req.body;

    logger.info(`Request received to set primary account to ${accountId || "NULL"}
      for Portfolio Manager: ${portfolioManagerId}`, "SetPrimaryAccountHandler");

    await setPrimaryAccount({ portfolioManagerId, accountId });

    res.json({
      success: true,
      data: {
        message: "Primary account updated successfully",
        portfolioManagerId,
        primaryAccountId: accountId || null
      },
      timestamp: new Date().toISOString(),
    });
  },
  options: {
    requireAuth: true,
    requiredParams: {
      body: ["accountId", "portfolioManagerId",] // Both params required in body
    },
  }
});

/**
 * Gets the primary account ID for a Portfolio Manager.
 * Requires portfolioManagerId in query params.
 */
export const getPrimaryAccountHandler = createHttpFunction({
  handler: async (context: PrimaryAccountHandlerContext) => {
    const { req, res } = context;
    const { portfolioManagerId } = req.query;

    logger.info(`Request received to get primary account for Portfolio Manager: ${portfolioManagerId}`,
      "GetPrimaryAccountHandler");

    const primaryAccountId = await getPrimaryAccount(portfolioManagerId as string);

    res.json({
      success: true,
      data: {
        portfolioManagerId,
        primaryAccountId: primaryAccountId // Will be null if not set
      },
      timestamp: new Date().toISOString(),
    });
  },
  options: {
    requireAuth: true,
    requiredParams: {
      query: ["portfolioManagerId"] // Required query param
    },
  }
});
