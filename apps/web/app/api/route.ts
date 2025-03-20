import { NextResponse } from 'next/server';
import { z } from 'zod';

// Define schema for environment variables
const envSchema = z.object({
  API_ROUTE_TEST: z.string().min(1, "API_ROUTE_TEST is required"),
});


// Validate environment variables
const validateEnv = () => {
  try {
    return envSchema.parse({
      API_ROUTE_TEST: process.env.API_ROUTE_TEST,
    });
  } catch (error) {
    console.error('Environment validation error:', error);
    return { API_ROUTE_TEST: undefined };
  }
};

const env = validateEnv();

export async function GET() {
  // Get the value from .env.local

  const apiRouteTest = env.API_ROUTE_TEST;

  // Return the value as JSON with a 5 second delay
  return NextResponse.json({
    message: "API route is working!",
    envValue: apiRouteTest || JSON.stringify(process.env)
  });
}
