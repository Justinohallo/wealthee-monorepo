/**
 * HTTP request and response type definitions
 */

/**
 * Base response interface with common properties
 */
export interface BaseResponse {
  success: boolean;
  timestamp: string;
}

/**
 * Error response with details
 */
export interface ErrorResponse extends BaseResponse {
  success: false;
  error: {
    message: string;
    code: number;
  };
}

/**
 * Success response with data
 */
export interface SuccessResponse<T> extends BaseResponse {
  success: true;
  data: T;
}

/**
 * Union type for all response types
 */
export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

/**
 * Portfolio manager creation request
 */
export interface CreatePortfolioManagerRequest {
  email: string;
  password: string;
  displayName?: string;
}

/**
 * Client creation request
 */
export interface CreateClientRequest {
  email: string;
  firstName: string;
  lastName: string;
  portfolioManagerId: string;
}

/**
 * SnapTrade registration request
 */
export interface RegisterSnapTradeRequest {
  userId: string;
}

/**
 * Account details request
 */
export interface GetAccountDetailsRequest {
  snapTradeUserId: string;
  accountId: string;
}
