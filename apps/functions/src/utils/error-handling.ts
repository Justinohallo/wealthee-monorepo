/**
 * Error handling utilities for Firebase Functions
 */
import * as logger from "firebase-functions/logger";

import { Response } from "express";

/**
 * Custom application error class with status code and context
 */
export class AppError extends Error {
  statusCode: number;
  context: string;

  constructor(message: string, statusCode = 500, context = "") {
    super(message);
    this.statusCode = statusCode;
    this.context = context;
    this.name = this.constructor.name;

    // Maintains proper stack trace for where error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error for authentication failures
 */
export class AuthError extends AppError {
  constructor(message = "Authentication failed", context = "") {
    super(message, 401, context);
    this.name = "AuthError";
  }
}

/**
 * Error for permission/authorization issues
 */
export class ForbiddenError extends AppError {
  constructor(message = "Permission denied", context = "") {
    super(message, 403, context);
    this.name = "ForbiddenError";
  }
}

/**
 * Error for resources not found
 */
export class NotFoundError extends AppError {
  constructor(message = "Resource not found", context = "") {
    super(message, 404, context);
    this.name = "NotFoundError";
  }
}

/**
 * Error for bad request validation failures
 */
export class ValidationError extends AppError {
  constructor(message = "Validation failed", context = "") {
    super(message, 400, context);
    this.name = "ValidationError";
  }
}

/**
 * Centralized error handler for HTTP responses
 */
export const handleError = ({
  res,
  error,
  context,
}: {
  res: Response;
  error: unknown;
  context: string;
}) => {
  // Determine if it's one of our custom errors
  const isAppError = error instanceof AppError;

  // Get status code and error message
  const statusCode = isAppError ? error.statusCode : 500;
  const errorMessage = error instanceof Error ?
    error.message :
    "Unknown error occurred";

  // Log with appropriate level based on status code
  if (statusCode >= 500) {
    logger.error(`[${context}] ${errorMessage}`, error);
  } else if (statusCode >= 400) {
    logger.warn(`[${context}] ${errorMessage}`, error);
  } else {
    logger.error(`[${context}] Unhandled error`, error);
  }

  // Format the error response
  res.status(statusCode).json({
    error: errorMessage,
    code: statusCode,
    timestamp: new Date().toISOString(),
  });
};
