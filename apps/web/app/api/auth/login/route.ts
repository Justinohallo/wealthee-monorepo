import { cert, getApps, initializeApp } from "firebase-admin/app"

import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getAuth } from "firebase-admin/auth"

// import { z } from "zod"

// const firebaseConfigSchema = z.object({
//   projectId: z.string().min(1, "FIREBASE_PROJECT_ID is required"),
//   clientEmail: z.string().min(1, "FIREBASE_CLIENT_EMAIL is required"),
//   privateKey: z.string().min(1, "FIREBASE_PRIVATE_KEY is required"),
// })

// // Validate environment variables
// const validateEnv = () => {
//   try {

//     return firebaseConfigSchema.parse({
//       projectId: process.env.FIREBASE_PROJECT_ID,
//       clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//       privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
//     })
//   } catch (error) {
//     console.error('Environment validation error:', error);

//   }
// };


export const initializeFirebaseAdmin = async () => {

  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    })


    // Connect to auth emulator in development
    // if (process.env.NODE_ENV === 'development') {
    //   process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099'
    //   console.log('Using Firebase Auth Emulator');
    // }
  }
}



export const POST = async (request: Request) => {

  initializeFirebaseAdmin();

  const { idToken } = await request.json()

  try {
    // Verify the ID token and get the decoded claims
    const decodedToken = await getAuth().verifyIdToken(idToken)
    const { uid, email, role } = decodedToken

    // Create a session cookie using the ID token
    const expiresIn = 60 * 60 * 24 * 5 * 1000 // 5 days
    const sessionCookie = await getAuth().createSessionCookie(idToken, { expiresIn })
    const cookieStore = await cookies();

    // Set the session cookie
    cookieStore.set("__session", sessionCookie, {
      maxAge: expiresIn,     // Cookie expiration time in milliseconds (5 days)
      httpOnly: true,        // Prevents JavaScript access to the cookie
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      path: "/",             // Cookie is available on all paths
      sameSite: "strict",    // Cookie sent only to same site requests
    })

    // Set the ID token cookie
    cookieStore.set("idToken", idToken, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
    })

    // Set a separate cookie for the user role that can be accessed in server components and middleware
    cookieStore.set("userRole", role || "", {
      maxAge: expiresIn,
      httpOnly: false,       // Allow JavaScript and middleware access
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
    })

    // Set a cookie for the user ID
    cookieStore.set("userId", uid || "", {
      maxAge: expiresIn,
      httpOnly: false,       // Allow JavaScript and middleware access
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
    })

    // Return the custom claims along with success message
    return NextResponse.json({
      success: true,
      user: {
        uid,
        email,
        role,
        customClaims: decodedToken
      }
    })
  } catch (error) {
    console.error("Session creation error:", error)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
