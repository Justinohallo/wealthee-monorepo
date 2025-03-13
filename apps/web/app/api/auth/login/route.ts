// In any server component or API route
import '@/lib/firebase-admin'

import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getAuth } from "firebase-admin/auth"

export const POST = async (request: Request) => {
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
