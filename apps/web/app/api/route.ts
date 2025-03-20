import { NextResponse } from 'next/server';
import { z } from 'zod';

// Define schema for environment variables
const envSchema = z.object({
  PROJECT_ID: z.string().min(1, "FIREBASE_PRIVATE_KEY is required"),
});


// Validate environment variables
const validateEnv = () => {
  try {

    return envSchema.parse({
      PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    });
  } catch (error) {
    console.error('Environment validation error:', error);
    return { PROJECT_ID: undefined };
  }
};

const env = validateEnv();

export async function GET() {
  // Get the value from .env.local

  const projectId = env.PROJECT_ID;

  // Return the value as JSON
  return NextResponse.json({
    message: "API route is working!",
    envValue: projectId || JSON.stringify(process.env)
  });
}
