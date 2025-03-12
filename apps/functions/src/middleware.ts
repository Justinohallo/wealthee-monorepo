import {Response} from "express";
import * as logger from "firebase-functions/logger";
import {Request} from "firebase-functions/v2/https";
import {Snaptrade} from "snaptrade-typescript-sdk";
import admin, {db} from "./firebaseAdmin";
import {snapTradeClientId, snapTradeConsumerKey} from "./snaptrade/secrets";

/**
 * Authenticates a portfolio manager from the request
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @return {Promise<admin.auth.DecodedIdToken|null>} Decoded token or null
 */
export const authenticatePortfolioManager = async (
  req: Request,
  res: Response
) => {
  // Check if Authorization header exists
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({error: "Unauthorized - No token provided"});
    return null;
  }

  // Get the ID token
  const idToken = authHeader.split("Bearer ")[1];

  // Verify the token and get the decoded token
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Check if user has the portfolioManager role
    if (!decodedToken.role || decodedToken.role !== "portfolioManager") {
      res.status(403).json({error: "Forbidden - Insufficient permissions"});
      return null;
    }

    return decodedToken;
  } catch (error) {
    console.error({error});
    res.status(401).json({error: "Unauthorized - Invalid token"});
    return null;
  }
};

/**
 * Validates that all required parameters are present
 * @param {Request} req - The request object
 * @param {string[]} params - Parameter names to validate
 * @param {'query'|'body'} source - Source of parameters
 * @param {Response} res - The response object
 * @return {boolean} True if all parameters are present
 */
export const validateRequiredParams = ({
  req,
  params,
  source,
  res,
}: {
  req: Request,
  params: string[],
  source: "query" | "body",
  res: Response
}) => {
  const paramsSource = source === "query" ? req.query : req.body;

  for (const param of params) {
    if (!paramsSource[param]) {
      res.status(400).json({error: `${param} is required`});
      return false;
    }
  }

  return true;
};

/**
 * Retrieves SnapTrade user data from the database
 * @param {string} portfolioManagerId - Portfolio manager ID
 * @param {string} snapTradeUserId - SnapTrade user ID
 * @param {Response} res - The response object
 * @return {Promise<object|null>} SnapTrade user data or null if not found
 */
export const getSnapTradeUser = async ({
  portfolioManagerId,
  snapTradeUserId,
  res,
}: {
  portfolioManagerId: string,
  snapTradeUserId: string,
  res: Response
}) => {
  // Get reference to the specific snapTradeUser
  const userRef = db.ref(
    `portfolioManagers/${portfolioManagerId}/snapTradeUsers/${snapTradeUserId}`
  );

  // Get the snapTradeUser data
  const snapshot = await userRef.once("value");
  if (!snapshot.exists()) {
    res.status(404).json({
      error: "SnapTrade user not found",
    });
    return null;
  }

  const snapTradeUser = snapshot.val();
  if (!snapTradeUser.userSecret) {
    res.status(400).json({
      error: "User secret not found for this SnapTrade user",
    });
    return null;
  }

  return snapTradeUser;
};

/**
 * Creates a new SnapTrade client
 * @return {Snaptrade} A new SnapTrade client instance
 */
export const createSnapTradeClient = () => {
  return new Snaptrade({
    consumerKey: snapTradeConsumerKey.value(),
    clientId: snapTradeClientId.value(),
  });
};

/**
 * Handles errors in API endpoints
 * @param {Response} res - The response object
 * @param {unknown} error - The error that occurred
 * @param {string} context - Additional error context
 * @return {void} No return value
 */
export const handleError = ({
  res,
  error,
  context,
}: {
  res: Response,
  error: unknown,
  context: string
}) => {
  logger.error(`${context} Error`, error);
  res.status(500).json({
    error: `Failed to ${context}`,
    details: (error as Error).message,
  });
};
