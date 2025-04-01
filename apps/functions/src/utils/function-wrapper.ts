import { AuthError, ForbiddenError, ValidationError, handleError } from "./error-handling";
/**
 * Function wrapper for standardizing Cloud Function implementation
 */
import { Request, Response } from "express";

import { DecodedIdToken } from "firebase-admin/auth";
import { auth } from "../config/firebase";
import { defineSecret } from "firebase-functions/params";
import { onRequest } from "firebase-functions/v2/https";

/**
 * Options for creating an HTTP function
 */
interface HttpFunctionOptions {
  /** Array of required secrets */
  secrets?: ReturnType<typeof defineSecret>[];
  /** Whether authentication is required */
  requireAuth?: boolean;
  /** Required user role if auth is required */
  requiredRole?: string;
  /** Required parameters in the request */
  requiredParams?: {
    body?: string[];
    query?: string[];
  };
}

/**
 * Function handler context
 */
interface HandlerContext {
  /** Express request object */
  req: Request;
  /** Express response object */
  res: Response;
  /** Firebase Auth decoded token (if authenticated) */
  auth?: DecodedIdToken;
}

/**
 * Authenticates the request using Firebase Auth
 */
async function authenticateRequest(
  req: Request,
  requiredRole?: string
): Promise<DecodedIdToken> {
  // Check for Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AuthError("Missing or invalid authorization header");
  }

  // Extract the token
  const idToken = authHeader.split("Bearer ")[1];

  try {
    // Verify the token
    const decodedToken = await auth.verifyIdToken(idToken);

    // Check for required role if specified
    if (requiredRole && (!decodedToken.role || decodedToken.role !== requiredRole)) {
      throw new ForbiddenError(
        `Required role '${requiredRole}' not found`
      );
    }

    return decodedToken;
  } catch (error) {
    // If it's already our custom error, re-throw it
    if (error instanceof AuthError || error instanceof ForbiddenError) {
      throw error;
    }
    // Otherwise, wrap it in an AuthError
    throw new AuthError(
      `Authentication failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Validates required parameters in the request
 */
function validateRequestParams(
  req: Request,
  requiredParams: HttpFunctionOptions["requiredParams"]
): void {
  if (!requiredParams) return;
  // Validate body parameters
  if (requiredParams.body && requiredParams.body.length > 0) {
    for (const param of requiredParams.body) {
      if (req.body[param] === undefined) {
        throw new ValidationError(`Required body parameter '${param}' is missing`);
      }
    }
  }

  // Validate query parameters
  if (requiredParams.query && requiredParams.query.length > 0) {
    for (const param of requiredParams.query) {
      if (req.query[param] === undefined) {
        throw new ValidationError(`Required query parameter '${param}' is missing`);
      }
    }
  }
}

/**
 * Creates a standardized HTTP function with built-in error handling and validation
 *
 * @param handler - Function handler implementation
 * @param options - Function configuration options
 * @return Configured Firebase HTTP function
 */
export function createHttpFunction(
  {
    handler,
    options = {},
  }: {
    handler: (context: HandlerContext) => Promise<void>;
    options?: HttpFunctionOptions;
  }
) {
  return onRequest({ secrets: options.secrets || [] }, async (req, res) => {
    try {
      // Authenticate if required
      let authToken;
      if (options.requireAuth) {
        authToken = await authenticateRequest(req, options.requiredRole);
      }

      // Validate required parameters
      if (options.requiredParams) {
        validateRequestParams(req, options.requiredParams);
      }

      // Execute the handler
      await handler({ req, res, auth: authToken });
    } catch (error) {
      // Handle any errors with our central error handler
      handleError({
        res,
        error,
        context: req.path,
      });
    }
  });
}
