import { connectAuthEmulator, getAuth } from "firebase/auth"
import { connectDatabaseEmulator, getDatabase } from "firebase/database"
import { connectFunctionsEmulator, getFunctions } from "firebase/functions"
import { getApp, getApps, initializeApp } from "firebase/app"

import { z } from "zod"

export const firebaseConfigSchema = z.object({
  apiKey: z.string().min(1, "NEXT_PUBLIC_FIREBASE_API_KEY is required"),
  authDomain: z.string().min(1, "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN is required"),
  projectId: z.string().min(1, "NEXT_PUBLIC_FIREBASE_PROJECT_ID is required"),
  storageBucket: z.string().min(1, "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET is required"),
  messagingSenderId: z.string().min(1, "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID is required"),
  appId: z.string().min(1, "NEXT_PUBLIC_FIREBASE_APP_ID is required"),
})

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}
// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
const auth = getAuth(app)

// Initialize Realtime Database
const db = getDatabase(app)

// Initialize Cloud Functions
const functions = getFunctions(app)

// Connect to emulators in development
if (process.env.NODE_ENV === "development") {
  connectDatabaseEmulator(db, "localhost", 9000)
  connectFunctionsEmulator(functions, "localhost", 5001)
  connectAuthEmulator(auth, 'http://localhost:9099')
}


export { auth }

