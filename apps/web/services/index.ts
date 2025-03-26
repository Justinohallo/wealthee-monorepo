/**
 * Wealthee Service Layer
 *
 * This is the main entry point for all service functions that interact with Firebase Functions.
 * Services are organized by domain to match the backend functions structure.
 */

export * from './admin';
// Temporary fix: clients directory doesn't exist yet, will be implemented later
// export * from './clients';

// Use explicit exports to prevent conflicts between portfolio-manager and snapTrade
// Portfolio manager exports
export type { PortfolioManager, CreatePortfolioManagerParams } from './portfolio-manager/users';
export {
    createPortfolioManager,
    listPortfolioManagers,
    getPortfolioManager,
    updatePortfolioManager,
} from './portfolio-manager/users';

// SnapTrade-specific exports from portfolio-manager
export type {
    SnapTradeLoginResponse as PMSnapTradeLoginResponse,
    RegisterSnapTradeUserParams as PMRegisterSnapTradeUserParams
} from './portfolio-manager/snapTrade';
export {
    checkSnapTradeUserExists,
    getPrimarySnapTradeUser,
    getSnapTradeUsers as getPMSnapTradeUsers,
    loginSnapTradeUser as loginPMSnapTradeUser,
    registerPrimarySnapTradeUser,
    registerSnapTradeUserWithDisplay as registerPMSnapTradeUserWithDisplay,
} from './portfolio-manager/snapTrade';

// Direct SnapTrade exports
export * from './snapTrade';
