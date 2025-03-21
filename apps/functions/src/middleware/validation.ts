/**
 * Request validation middleware
 */
import {Request, Response} from "express";

import {ValidationError} from "../utils/error-handling";

/**
 * Validates that all required parameters are present in the request
 *
 * @param req - Express request object
 * @param params - Array of parameter names that must be present
 * @param source - Source of parameters (query or body)
 * @param res - Express response object
 * @return boolean indicating if validation passed
 */
export function validateRequiredParams(
  req: Request,
  params: string[],
  source: "query" | "body",
  res: Response
): boolean {
  try {
    const paramsSource = source === "query" ? req.query : req.body;

    for (const param of params) {
      if (!paramsSource[param]) {
        throw new ValidationError(`Required parameter '${param}' is missing`);
      }
    }

    return true;
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(error.statusCode).json({error: error.message});
    } else {
      res.status(400).json({
        error: `Validation failed: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
    return false;
  }
}

/**
 * Object-based version of validateRequiredParams for use with the function wrapper
 *
 * @param options - Validation options
 * @return boolean indicating if validation passed
 */
export function validateParams({
  req,
  params,
  source,
  res,
}: {
    req: Request;
    params: string[];
    source: "query" | "body";
    res: Response;
}): boolean {
  return validateRequiredParams(req, params, source, res);
}
