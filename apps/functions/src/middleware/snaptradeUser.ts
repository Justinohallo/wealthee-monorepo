/**
 * SnapTrade User Middleware
 *
 * Provides middleware functions for SnapTrade user operations.
 * These middleware functions process requests, validate access, and forward to the next handler.
 */

import { NextFunction, Request, Response } from "express";
import { getSnapTradeUser, verifyPortfolioManagerAccess } from "../services/snaptrade/users";

/**
 * Middleware to fetch and attach a SnapTrade user to the request
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const attachSnapTradeUser = async (
  req: Request & { snapTradeUser?: any },
  res: Response,
  next: NextFunction
) => {
  const { snapTradeUserId } = req.params || req.query || {};

  if (!snapTradeUserId) {
    res.status(400).json({
      error: "SnapTrade user ID is required",
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Get the SnapTrade user from the service
  const snapTradeUser = await getSnapTradeUser(snapTradeUserId as string);

  if (!snapTradeUser) {
    res.status(404).json({
      error: "SnapTrade user not found",
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Attach the user to the request for use in subsequent handlers
  req.snapTradeUser = snapTradeUser;
  next();
};

/**
 * Middleware to verify a portfolio manager has access to a SnapTrade user
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const validatePortfolioManagerAccess = async (
  req: Request & { auth?: any },
  res: Response,
  next: NextFunction
) => {
  const { portfolioManagerId } = req.params || req.query || req.body || {};
  const { snapTradeUserId } = req.params || req.query || {};

  if (!portfolioManagerId || !snapTradeUserId) {
    res.status(400).json({
      error: "Portfolio manager ID and SnapTrade user ID are required",
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Verify portfolio manager has access to the SnapTrade user
  const hasAccess = await verifyPortfolioManagerAccess(
    portfolioManagerId as string,
    snapTradeUserId as string
  );

  if (!hasAccess) {
    res.status(403).json({
      error: "Portfolio manager does not have access to this SnapTrade user",
      timestamp: new Date().toISOString(),
    });
    return;
  }

  next();
};
