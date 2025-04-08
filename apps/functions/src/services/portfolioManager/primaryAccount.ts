import { db } from "../../config/firebase"; // Assuming Realtime DB based on previous service
import { logger } from "../../utils/logger";

interface SetPrimaryAccountParams {
  portfolioManagerId: string;
  accountId: string;
  snapTradeUserId: string;
}

interface PrimaryAccountData {
  accountId: string;
  snapTradeUserId: string;
  updatedAt: string;
}

/**
 * Sets the specified account as the primary account for a Portfolio Manager.
 * Stores both the accountId and snapTradeUserId to facilitate fetching account details.
 */
export async function setPrimaryAccount({
  portfolioManagerId,
  accountId,
  snapTradeUserId }: SetPrimaryAccountParams): Promise<void> {
  if (!portfolioManagerId) {
    throw new Error("Portfolio Manager ID is required");
  }

  if (!accountId) {
    throw new Error("Account ID is required");
  }

  if (!snapTradeUserId) {
    throw new Error("SnapTrade User ID is required");
  }

  const managerRef = db.ref(`portfolioManagers/${portfolioManagerId}`); // Using RTDB ref

  logger.info(`Setting primary account ${accountId} from SnapTrade user
    ${snapTradeUserId} for Portfolio Manager: ${portfolioManagerId}`, "PortfolioManagerPrimaryAccount");

  try {
    const primaryAccountData: PrimaryAccountData = {
      accountId,
      snapTradeUserId,
      updatedAt: new Date().toISOString()
    };

    await managerRef.update({
      primaryAccount: primaryAccountData,
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
 * Gets the primary account data for a Portfolio Manager.
 * Returns both the accountId and snapTradeUserId to simplify fetching account details.
 */
export async function getPrimaryAccount(portfolioManagerId: string): Promise<PrimaryAccountData | null> {
  if (!portfolioManagerId) {
    throw new Error("Portfolio Manager ID is required");
  }

  const managerRef = db.ref(`portfolioManagers/${portfolioManagerId}`); // Using RTDB ref
  logger.info(`Fetching primary account for
  Portfolio Manager: ${portfolioManagerId}`, "PortfolioManagerPrimaryAccount");

  try {
    const snapshot = await managerRef.once("value");
    if (!snapshot.exists()) {
      logger.warn(`Portfolio Manager with ID ${portfolioManagerId} not found.`);
      return null;
    }

    const managerData = snapshot.val();
    // Check if the new structure exist
    logger.info(`Found primary account ID ${managerData.primaryAccount.accountId}
       with SnapTrade user ${managerData.primaryAccount.snapTradeUserId} for ${portfolioManagerId}.`);

    return managerData.primaryAccount;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`Failed to fetch primary account for ${portfolioManagerId}:`, errorMessage);
    throw new Error(`Database error getting primary account: ${errorMessage}`);
  }
}
