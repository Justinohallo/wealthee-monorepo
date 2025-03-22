import { AuthError, ForbiddenError } from "../utils/error-handling";
/**
 * Authentication middleware
 */
import { Request, Response } from "express";

import { DecodedIdToken } from "firebase-admin/auth";
import { auth } from "../config/firebase";

/**
 * Authenticates the request and verifies the user has the portfolio manager role
 *
 * @param req - Express request object
 * @param res - Express response object
 * @return Decoded Firebase ID token or null if authentication fails
 */
export async function authenticatePortfolioManager(
  req: Request,
  res: Response
): Promise<DecodedIdToken | null> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AuthError("Missing or invalid authorization header");
    }

    // Extract the token
    const idToken = authHeader.split("Bearer ")[1];

    // Verify the token
    const decodedToken = await auth.verifyIdToken(idToken);

    // Check if user has the portfolioManager role
    if (!decodedToken.role || decodedToken.role !== "portfolioManager") {
      throw new ForbiddenError("Insufficient permissions - Portfolio Manager role required");
    }

    return decodedToken;
  } catch (error) {
    if (error instanceof AuthError || error instanceof ForbiddenError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(401).json({
        error: `Authentication failed: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
    return null;
  }
}

/**
 * Authenticates the request for any authenticated user
 *
 * @param req - Express request object
 * @param res - Express response object
 * @return Decoded Firebase ID token or null if authentication fails
 */
export async function authenticateUser(
  req: Request,
  res: Response
): Promise<DecodedIdToken | null> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AuthError("Missing or invalid authorization header");
    }

    // Extract the token
    const idToken = authHeader.split("Bearer ")[1];

    // Verify the token
    const decodedToken = await auth.verifyIdToken(idToken);

    return decodedToken;
  } catch (error) {
    if (error instanceof AuthError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(401).json({
        error: `Authentication failed: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
    return null;
  }
}
