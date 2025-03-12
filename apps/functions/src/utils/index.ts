import {Response} from "express";
import * as logger from "firebase-functions/logger";

// Add a helper for consistent error handling.
export const handleFirebaseFunctionError =
  (res: Response, context: string, error: unknown) => {
    logger.error(`${context} Error`, error);
    res.status(500).json({error: `Failed to ${context}`});
  };
