import * as adminFunctions from "./functions/admin";
/**
 * Main entry point for Firebase Functions
 * Exports all Cloud Functions organized by domain
 */
import * as clientFunctions from "./functions/clients";
import * as portfolioManagerFunctions from "./functions/portfolio-manager";
import * as snapTradeFunctions from "./functions/snaptrade";

// Export functions by domain
export const client = clientFunctions;
export const snaptrade = snapTradeFunctions;
export const portfolioManager = portfolioManagerFunctions;
export const admin = adminFunctions;

