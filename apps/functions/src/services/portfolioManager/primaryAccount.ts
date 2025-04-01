import { db } from "../../config/firebase"; // Assuming Realtime DB based on previous service
import { logger } from "../../utils/logger";

interface SetPrimaryAccountParams {
  portfolioManagerId: string;
  accountId: string;
}

/**
 * Sets the specified account as the primary account for a Portfolio Manager.
 * Stores the accountId directly on the portfolioManager object.
 */
export async function setPrimaryAccount({ portfolioManagerId, accountId }: SetPrimaryAccountParams): Promise<void> {
  if (!portfolioManagerId) {
    throw new Error("Portfolio Manager ID is required");
  }

  const managerRef = db.ref(`portfolioManagers/${portfolioManagerId}`); // Using RTDB ref

  logger.info(`Setting primary account to ${accountId || "NULL"} for Portfolio Manager: ${portfolioManagerId}`, "PortfolioManagerPrimaryAccount");

  try {
    await managerRef.update({
      primaryAccountId: accountId || null, // Set to null if accountId is empty/falsy
      updatedAt: new Date().toISOString()
    });
    logger.info(`Successfully updated primary account for ${portfolioManagerId}.`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`Failed to update primary account for ${portfolioManagerId}:`, errorMessage);
    throw new Error(`Database error setting primary account: ${errorMessage}`);
  }
}

/**
 * Gets the primary account ID for a Portfolio Manager.
 */
export async function getPrimaryAccount(portfolioManagerId: string): Promise<string | null> {
  if (!portfolioManagerId) {
    throw new Error("Portfolio Manager ID is required");
  }

  const managerRef = db.ref(`portfolioManagers/${portfolioManagerId}`); // Using RTDB ref
  logger.info(`Fetching primary account for Portfolio Manager: ${portfolioManagerId}`, "PortfolioManagerPrimaryAccount");

  try {
    const snapshot = await managerRef.once("value");
    if (!snapshot.exists()) {
      logger.warn(`Portfolio Manager with ID ${portfolioManagerId} not found.`);
      return null; // Or throw? Returning null seems safer.
    }

    const managerData = snapshot.val();
    const primaryAccountId = managerData?.primaryAccountId || null;
    logger.info(`Found primary account ID ${primaryAccountId} for ${portfolioManagerId}.`);
    return primaryAccountId;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`Failed to fetch primary account for ${portfolioManagerId}:`, errorMessage);
    throw new Error(`Database error getting primary account: ${errorMessage}`);
  }
}
