/**
 * Utility functions for calling Firebase Cloud Functions
 */

import { apiMonitor } from './api-monitor';

type FetchOptions = {
  revalidate?: number;
  headers?: HeadersInit;
  method?: string;
  body?: string | FormData;
};

/**
 * Custom error class for Firebase function errors
 */
export class FirebaseFunctionError extends Error {
  public functionName: string;
  public responseData?: unknown;
  public statusCode?: number;
  public originalError?: unknown;

  constructor(
    message: string,
    options: {
      functionName: string,
      originalError?: unknown,
      statusCode?: number,
      responseData?: unknown
    }
  ) {
    super(message);
    this.name = 'FirebaseFunctionError';
    this.functionName = options.functionName;
    this.statusCode = options.statusCode;
    this.responseData = options.responseData;
    this.originalError = options.originalError;
  }
}

/**
 * Build the URL for a Firebase function based on environment
 *
 * @param functionName - The name of the Firebase function
 * @param queryParams - Optional query parameters object
 * @returns The complete URL for the function
 */
function buildFunctionUrl(functionName: string, queryParams?: Record<string, string>): string {
  const isProduction = process.env.NODE_ENV === 'production';
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  // Convert query params object to query string if present
  let queryString = '';
  if (queryParams && Object.keys(queryParams).length > 0) {
    const searchParams = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      searchParams.append(key, value);
    });
    queryString = `?${searchParams.toString()}`;
  }

  // Base URL for local environment
  const devUrl = `http://127.0.0.1:5001/${projectId}/us-central1/${functionName}${queryString}`;

  // Build the function URL for production
  const functionHash = 'zncz3ts4ka-uc';
  const productionUrl = `https://${functionName}-${functionHash}.a.run.app/${queryString}`;

  return isProduction ? productionUrl : devUrl;
}

/**
 * Handle HTTP error responses from Firebase functions
 */
async function handleErrorResponse(response: Response, functionName: string): Promise<never> {
  const errorText = await response.text();
  let error: Error;

  switch (response.status) {
    case 400:
      error = new Error(`Bad request: ${errorText}`);
      break;
    case 401:
      error = new Error(`Unauthorized: Authentication required`);
      break;
    case 403:
      error = new Error(`Forbidden: You don't have permission to access this function`);
      break;
    case 404:
      error = new Error(`Function '${functionName}' not found`);
      break;
    case 429:
      error = new Error(`Too many requests: Rate limit exceeded`);
      break;
    case 500:
      error = new Error(`Server error: The function encountered an internal error`);
      break;
    case 503:
      error = new Error(`Service unavailable: The function is currently unavailable`);
      break;
    default:
      error = new Error(`Error ${response.status}: ${errorText}`);
      break;
  }

  // Add response details to the error object
  const customError = error as Error & { status?: number; functionName?: string };
  customError.status = response.status;
  customError.functionName = functionName;

  throw customError;
}

/**
 * Log Firebase function errors with detailed context
 */
function logFunctionError(error: unknown, functionName: string): void {
  const isProduction = process.env.NODE_ENV === 'production';
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : 'No stack trace available';

  console.error(`
    Firebase Function Error:
    - Function: ${functionName}
    - Environment: ${isProduction ? 'Production' : 'Development'}
    - Message: ${errorMessage}
    - Stack: ${errorStack}
  `);
}

/**
 * Call a Firebase function with proper error handling and retry capability
 *
 * @param idToken - The ID token for the user (optional for admin-only functions)
 * @param functionName - The name of the Firebase function to call
 * @param queryParams - Optional query parameters object
 * @param options - Optional fetch configuration
 * @param retries - Number of retries for transient errors (default: 1)
 * @returns The response from the Firebase function
 */
export async function callFirebaseFunction<T = unknown>({
  idToken,
  functionName,
  queryParams,
  options = {},
  retries = 1
}: {
  idToken?: string,
  functionName: string,
  queryParams?: Record<string, string>,
  options?: FetchOptions,
  retries?: number
}): Promise<{ data: T, } | null> {
  const functionUrl = buildFunctionUrl(functionName, queryParams);
  console.log(`Calling Firebase function '${functionName}' at: ${functionUrl}`);

  // Start monitoring the API call
  apiMonitor.startCall(functionName);

  let lastError: unknown;
  let attempt = 0;
  const maxAttempts = retries + 1;

  while (attempt < maxAttempts) {
    try {
      attempt++;

      if (attempt > 1) {
        console.log(`Retry attempt ${attempt - 1} for function '${functionName}'`);
        // Add exponential backoff
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt - 2)));
      }

      // Default revalidation to 60 seconds if not specified
      const revalidate = options.revalidate ?? 60;

      const fetchOptions: RequestInit & { next?: { revalidate: number } } = {
        method: options.method || 'GET',
        headers: {
          ...options.headers,
        },
        body: options.body,
        next: { revalidate }
      };

      // Only add Authorization header if idToken is provided
      if (idToken) {
        fetchOptions.headers = {
          ...fetchOptions.headers,
          'Authorization': `Bearer ${idToken}`
        };
      }

      const response = await fetch(functionUrl, fetchOptions);

      // Handle error responses
      if (!response.ok) {
        // Only retry on 5xx errors (server errors) and 429 (rate limiting)
        if ((response.status >= 500 || response.status === 429) && attempt < maxAttempts) {
          lastError = new FirebaseFunctionError(
            `Server error ${response.status} on attempt ${attempt}/${maxAttempts}`,
            { functionName, statusCode: response.status }
          );
          continue; // Retry
        }

        const error = await handleErrorResponse(response, functionName);
        apiMonitor.endCallError(functionName, error);
        throw error;
      }

      // Parse JSON response
      const result = await response.json();

      // End monitoring with success
      apiMonitor.endCallSuccess(functionName);

      return result;

    } catch (error) {
      lastError = error;

      // If it's not a network error or it's our last attempt, don't retry
      if (!(error instanceof TypeError) || attempt >= maxAttempts) {
        // Log the error with context
        logFunctionError(error, functionName);

        // Mark the API call as failed in the monitor
        apiMonitor.endCallError(functionName, {
          message: error instanceof Error ? error.message : String(error),
          statusCode: error instanceof FirebaseFunctionError ? error.statusCode : undefined,
          responseData: error instanceof FirebaseFunctionError ? error.responseData : undefined,
          functionName
        });

        // Re-throw with a Firebase-specific error class
        throw new FirebaseFunctionError(
          `Failed to call Firebase function '${functionName}': ${error instanceof Error ? error.message : String(error)}`,
          {
            functionName,
            originalError: error,
            statusCode: error instanceof FirebaseFunctionError ? error.statusCode : undefined,
            responseData: error instanceof FirebaseFunctionError ? error.responseData : undefined
          }
        );
      }
    }
  }

  // If we get here, we've exhausted our retries
  logFunctionError(lastError!, functionName);

  // Mark the API call as failed in the monitor
  apiMonitor.endCallError(functionName, {
    message: lastError instanceof Error ? lastError.message : String(lastError),
    statusCode: lastError instanceof FirebaseFunctionError ? lastError.statusCode : undefined,
    responseData: lastError instanceof FirebaseFunctionError ? lastError.responseData : undefined,
    functionName
  });

  throw new FirebaseFunctionError(
    `Failed to call Firebase function '${functionName}' after ${maxAttempts} attempts: ${lastError instanceof Error ? lastError.message : String(lastError)}`,
    {
      functionName,
      originalError: lastError
    }
  );
}
