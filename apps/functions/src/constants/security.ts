/**
 * Security configuration constants
 */

// Firebase Functions doesn't reliably expose NODE_ENV
// Check for explicit environment variables set in your firebase config instead
const isDevelopment = process.env.FUNCTIONS_EMULATOR === "true";

export const ALLOWED_ORIGINS = [
  "https://wealthee-monorepo-web.vercel.app",
  // For local development
  ...(isDevelopment ? ["http://localhost:3000", "http://127.0.0.1:3000"] : [])
].filter(Boolean) as string[];

export const ALLOWED_METHODS = ["GET", "POST", "PUT", "DELETE", "OPTIONS"] as const;

export const ALLOWED_HEADERS = [
  "Authorization",
  "Content-Type",
  "Accept",
  "Origin",
  "X-Requested-With",
] as const;

export const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Content-Security-Policy": "default-src 'self'; script-src 'self'",
} as const;

export const CORS_OPTIONS = {
  origin: ALLOWED_ORIGINS,
  methods: ALLOWED_METHODS,
  allowedHeaders: ALLOWED_HEADERS,
  maxAge: 86400, // 24 hours cache for preflight requests
  credentials: true,
} as const;
