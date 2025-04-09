import * as primaryAccountService from "../../services/portfolioManager/primaryAccount";

import { Request, Response } from "express";

import { createHttpFunction } from "../../utils/function-wrapper";
import { logger } from "../../utils/logger";
import { snaptradeSecrets } from "../../config";

// Define the basic handler context without auth
interface PrimaryAccountHandlerContext {
  req: Request;
  res: Response;
}

/**
 * Sets a specific account as the primary account for a Portfolio Manager.
 * Requires portfolioManagerId, accountId, and snapTradeUserId in the request body.
 */
export const set = createHttpFunction({
  handler: async (context: PrimaryAccountHandlerContext) => {
    const { req, res } = context;
    const { portfolioManagerId, accountId, snapTradeUserId } = req.body;

    logger.info(`Request received to set primary account to ${accountId}
      from SnapTrade user ${snapTradeUserId} for Portfolio Manager: ${portfolioManagerId}`, "SetPrimaryAccountHandler");

    await primaryAccountService.setPrimaryAccount({ portfolioManagerId, accountId, snapTradeUserId });

    res.json({
      success: true,
      data: {
        message: "Primary account updated successfully",
        portfolioManagerId,
        primaryAccount: {
          accountId,
          snapTradeUserId
        }
      },
      timestamp: new Date().toISOString(),
    });
  },
  options: {
    requireAuth: true,
    requiredParams: {
      body: ["accountId", "portfolioManagerId", "snapTradeUserId"] // All params required in body
    },
  }
});

/**
 * Gets the primary account data for a Portfolio Manager.
 * Requires portfolioManagerId in query params.
 */
export const get = createHttpFunction({
  handler: async (context: PrimaryAccountHandlerContext) => {
    const { req, res } = context;
    const { portfolioManagerId } = req.query;

    logger.info(`Request received to get primary account for Portfolio Manager: ${portfolioManagerId}`,
      "GetPrimaryAccountHandler");

    const primaryAccountData = await primaryAccountService.getPrimaryAccount(portfolioManagerId as string);

    res.json({
      success: true,
      data: {
        portfolioManagerId,
        primaryAccount: primaryAccountData // Will be null if not set
      },
      timestamp: new Date().toISOString(),
    });
  },
  options: {
    requireAuth: true,
    requiredParams: {
      query: ["portfolioManagerId"] // Required query param
    },
    secrets: snaptradeSecrets
  }
});

