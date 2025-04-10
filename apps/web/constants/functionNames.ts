/**
 * Constants for Firebase function names
 *
 * This file centralizes all function names to:
 * - Prevent typos
 * - Make refactoring easier
 * - Provide documentation
 * - Enable auto-completion
 *
 * Naming convention: domain-subdomain-action
 * Example: snaptrade-accounts-list
 */

// Portfolio Manager functions
export const PORTFOLIO_MANAGER = {
  USERS: {
    CREATE: 'portfolioManager-users-create',
    LIST: 'portfolioManager-users-list',
    GET: 'portfolioManager-users-get',
    UPDATE: 'portfolioManager-users-update',
  },

  SNAPTRADE: {
    CHECK_USER_EXISTS: 'portfolioManager-snapTrade-checkUser',
    GET_PRIMARY_USER: 'portfolioManager-snapTrade-getPrimary',
    GET_USERS: 'portfolioManager-snapTrade-getUsers',
    LOGIN_USER: 'portfolioManager-snapTrade-login',
    REGISTER_PRIMARY_USER: 'portfolioManager-snapTrade-regPrimary',
    REGISTER_USER_WITH_DISPLAY: 'portfolioManager-snapTrade-regWithDisplay',
  },

  PRIMARY_ACCOUNT: {
    SET: "portfolioManager-primaryAccount-set",
    GET: "portfolioManager-primaryAccount-get",
  }
};

// SnapTrade functions
export const SNAPTRADE = {
  ACCOUNTS: {
    /**
     * 'snaptrade-accounts-getDetails'
     */
    GET_DETAILS: 'snaptrade-accounts-getDetails',
    /**
     * 'snaptrade-accounts-list'
     */
    LIST_USER_ACCOUNTS: 'snaptrade-accounts-list',
    /**
     * 'snaptrade-accounts-getBalances'
     */
    GET_ACCOUNT_BALANCES: 'snaptrade-accounts-getBalances',
    /**
     * 'snaptrade-accounts-getHoldings'
     */
    GET_ACCOUNT_HOLDINGS: 'snaptrade-accounts-getHoldings',
    /**
     * 'snaptrade-accounts-getPositions'
     */
    GET_ACCOUNT_POSITIONS: 'snaptrade-accounts-getPositions',
    /**
     * 'snaptrade-accounts-getOrders'
     */
    GET_ACCOUNT_ORDERS: 'snaptrade-accounts-getOrders',
    /**
     * 'snaptrade-accounts-getActivities'
     */
    GET_ACCOUNT_ACTIVITIES: 'snaptrade-accounts-getActivities',
  },

  CONNECTIONS: {
    /**
     * 'snaptrade-connections-getBrokerAuth'
     */
    GET: 'snaptrade-connections-get',
    /**
     * 'snaptrade-connections-list'
     */
    LIST_BROKERAGE_CONNECTIONS: 'snaptrade-connections-list',
    /**
     * 'snaptrade-connections-remove'
     */
    DELETE_BROKERAGE_CONNECTION: 'snaptrade-connections-remove',
    /**
     * 'snaptrade-connections-getUrl'
     */
    GENERATE_CONNECTION_URL: 'snaptrade-connections-getUrl',
  },

  USERS: {
    REGISTER: 'snaptrade-users-register',
    GET: 'snaptrade-users-get',
    LIST_FOR_PORTFOLIO_MANAGER: 'snaptrade-users-listForPortfolioManager',
    LOGIN: 'snaptrade-users-login',
    DELETE: 'snaptrade-users-remove',
  },

};

// Client functions
export const CLIENT = {
  USERS: {
    ADD: 'client-users-add',
    GET: 'client-users-get',
    LIST: 'client-users-list',
    UPDATE: 'client-users-update',
  },

  DASHBOARD: {
    GET_MANAGER_PRIMARY_ACCOUNT: 'client-dashboard-getManagerPrimaryAccount'
  }
};

// Admin functions
export const ADMIN = {
  USERS: {
    CREATE_SUPER_USER: 'admin-users-createSuper',
    LIST_ADMINS: 'admin-users-list',
    DISABLE_ADMIN: 'admin-users-disable',
  },

  SETTINGS: {
    UPDATE: 'admin-settings-update',
    GET: 'admin-settings-get',
    RESET: 'admin-settings-reset',
  }
};
