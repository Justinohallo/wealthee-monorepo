/**
 * Constants for Firebase function names
 *
 * This file centralizes all function names to:
 * - Prevent typos
 * - Make refactoring easier
 * - Provide documentation
 * - Enable auto-completion
 */

// Portfolio Manager functions
export const PORTFOLIO_MANAGER = {
  USERS: {
    CREATE: 'portfolioManager-users-createPortfolioManager',
    LIST: 'portfolioManager-users-listPortfolioManagers',
    GET: 'portfolioManager-users-getPortfolioManager',
    UPDATE: 'portfolioManager-users-updatePortfolioManager',
  },

  SNAPTRADE: {
    CHECK_USER_EXISTS: 'portfolioManager-snapTrade-checkSnapTradeUserExists',
    GET_PRIMARY_USER: 'portfolioManager-snapTrade-getPrimarySnaptradeUser',
    GET_USERS: 'portfolioManager-snapTrade-getSnaptradeUsers',
    LOGIN_USER: 'portfolioManager-snapTrade-loginSnapTradeUser',
    REGISTER_PRIMARY_USER: 'portfolioManager-snapTrade-registerPrimarySnaptradeUser',
    REGISTER_USER_WITH_DISPLAY: 'portfolioManager-snapTrade-registerSnaptradeUserWithDisplay',
  }
};

// SnapTrade functions
export const SNAPTRADE = {
  ACCOUNTS: {
    GET_DETAILS: 'snaptrade-accounts-getAccountDetails',
    LIST_USER_ACCOUNTS: 'snaptrade-accounts-listUserAccounts',
  },

  CONNECTIONS: {
    LIST_BROKERAGE_CONNECTIONS: 'snaptrade-connections-listBrokerageConnections',
    DELETE_BROKERAGE_CONNECTION: 'snaptrade-connections-deleteBrokerageConnection',
    GENERATE_CONNECTION_URL: 'snaptrade-connections-generateConnectionUrl',
  },

  USERS: {
    REGISTER: 'snaptrade-users-registerUser',
    GET: 'snaptrade-users-getUser',
    LIST_FOR_PORTFOLIO_MANAGER: 'snaptrade-users-listUsersForPortfolioManager',
    LOGIN: 'snaptrade-users-loginUser',
  },

  // Kept for backwards compatibility
  // These should be migrated to the nested structure above as needed
  LEGACY: {
    DETAIL_BROKERAGE_AUTHORIZATION: 'portfoliomanager-detailbrokerageauthorization',
    LIST_USER_ACCOUNTS: 'portfoliomanager-listsnaptradeuseraccounts',
    GET_USER_ACCOUNT_DETAILS: 'portfoliomanager-getsnaptradeuseraccountdetails',
    GET_USER_ACCOUNT_BALANCES: 'portfoliomanager-getsnaptradeuseraccountbalances',
    GET_USER_HOLDINGS: 'portfoliomanager-getsnaptradeuserholdings',
  }
};

// Client functions
export const CLIENT = {
  USERS: {
    ADD: 'client-users-addClient',
    GET: 'client-users-getClient',
    LIST: 'client-users-listClients',
    UPDATE: 'client-users-updateClient',
  }
};

// Admin functions
export const ADMIN = {
  USERS: {
    CREATE_SUPER_USER: 'admin-users-createSuperUser',
    LIST_ADMINS: 'admin-users-listAdmins',
    DISABLE_ADMIN: 'admin-users-disableAdmin',
  },

  SETTINGS: {
    UPDATE: 'admin-settings-updateSettings',
    GET: 'admin-settings-getSettings',
    RESET: 'admin-settings-resetSettings',
  }
};
