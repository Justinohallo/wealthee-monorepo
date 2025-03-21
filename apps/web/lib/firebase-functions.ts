/**
 * Utility functions for calling Firebase Cloud Functions
 */

type FetchOptions = {
  revalidate?: number;
  headers?: HeadersInit;
};

/**
 * Custom error class for Firebase function errors
 */
export class FirebaseFunctionError extends Error {
  functionName: string;
  originalError?: unknown;

  constructor(message: string, options: { functionName: string, originalError?: unknown }) {
    super(message);
    this.name = 'FirebaseFunctionError';
    this.functionName = options.functionName;
    this.originalError = options.originalError;
  }
}

/**
 * Build the URL for a Firebase function based on environment
 */
function buildFunctionUrl(functionName: string): string {
  const isProduction = process.env.NODE_ENV === 'production';
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  // Base URL for local environment
  const devUrl = `http://127.0.0.1:5001/${projectId}/us-central1/${functionName}`;

  // Build the function URL for production
  const functionHash = 'zncz3ts4ka-uc';
  const productionUrl = `https://${functionName}-${functionHash}.a.run.app/`;

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
 * Call a Firebase function with proper error handling
 *
 * @param idToken - The ID token for the user
 * @param functionName - The name of the Firebase function to call
 * @param options - Optional fetch configuration
 * @returns The response from the Firebase function
 */
export async function callFirebaseFunction<T = unknown>({
  idToken,
  functionName,
  options = {}
}: {
  idToken: string,
  functionName: string,
  options?: FetchOptions
}): Promise<T | null> {
  const functionUrl = buildFunctionUrl(functionName);
  console.log(`Calling Firebase function '${functionName}' at: ${functionUrl}`);

  try {
    // Default revalidation to 60 seconds if not specified
    const revalidate = options.revalidate ?? 60;

    const response = await fetch(functionUrl, {
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${idToken}`
      },
      next: { revalidate }
    });

    // Handle error responses
    if (!response.ok) {
      await handleErrorResponse(response, functionName);
    }

    // Parse JSON response
    return await response.json();

  } catch (error) {
    // Log the error with context
    logFunctionError(error, functionName);

    // Re-throw with a Firebase-specific error class
    throw new FirebaseFunctionError(
      `Failed to call Firebase function '${functionName}': ${error instanceof Error ? error.message : String(error)}`,
      {
        functionName,
        originalError: error
      }
    );
  }
}
