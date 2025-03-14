// 'use server'

// import { cert, getApps, initializeApp } from "firebase-admin/app"

// import { z } from "zod"

/**
 * Firebase Admin SDK Initialization
 *
 * This file uses a singleton pattern to initialize Firebase Admin SDK once globally.
 * The initialization happens at the bottom of this file and checks if any Firebase apps
 * already exist before initializing to prevent multiple initializations.
 *
 * How to use Firebase Admin in your Next.js app:
 *
 * 1. Import this file (not a function) in your server-side code:
 *    ```
 *    import '@/lib/firebase-admin'
 *    import { getFirestore } from 'firebase-admin/firestore'
 *
 *    // Now you can use Firebase Admin services
 *    const db = getFirestore()
 *    ```
 *
 * 2. Firebase Admin SDK can ONLY be used in:
 *    - Server Components
 *    - API Routes
 *    - Route Handlers
 *    - Server Actions
 *
 * 3. It CANNOT be used in:
 *    - Client Components
 *    - Middleware
 *
 * This approach is better than initializing on a function-by-function basis because:
 * - It prevents multiple initializations which can cause memory leaks
 * - It's more efficient (only initializes once)
 * - It's cleaner code (don't repeat initialization logic)
 */

// const firebaseConfigSchema = z.object({
//   projectId: z.string().min(1, "FIREBASE_PROJECT_ID is required"),
//   clientEmail: z.string().min(1, "FIREBASE_CLIENT_EMAIL is required"),
//   privateKey: z.string().min(1, "FIREBASE_PRIVATE_KEY is required"),
// })

// const firebaseConfig = firebaseConfigSchema.parse({
//   projectId: process.env.FIREBASE_PROJECT_ID,
//   clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//   privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
// })

// export const initializeFirebaseAdmin = async () => {
//   if (!getApps().length) {
//     initializeApp({
//       credential: cert(firebaseConfig),
//     })

//     // Connect to auth emulator in development
//     // if (process.env.NODE_ENV === 'development') {
//     //   process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099'
//     //   console.log('Using Firebase Auth Emulator');
//     // }
//   }
// }

// initializeFirebaseAdmin()
