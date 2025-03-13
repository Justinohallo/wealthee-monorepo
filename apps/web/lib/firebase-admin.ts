import { cert, getApps, initializeApp } from "firebase-admin/app"

import { z } from "zod"
const firebaseConfigSchema = z.object({
  projectId: z.string().min(1, "FIREBASE_PROJECT_ID is required"),
  clientEmail: z.string().min(1, "FIREBASE_CLIENT_EMAIL is required"),
  privateKey: z.string().min(1, "FIREBASE_PRIVATE_KEY is required"),
})

const firebaseConfig = firebaseConfigSchema.parse({
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
})

export const initializeFirebaseAdmin = () => {
  if (!getApps().length) {
    initializeApp({
      credential: cert(firebaseConfig),
    })

    // Connect to auth emulator in development
    // if (process.env.NODE_ENV === 'development') {
    //   process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099'
    //   console.log('Using Firebase Auth Emulator');
    // }
  }
}

initializeFirebaseAdmin()
