/**
 * Firebase admin initialization and exports
 */
import * as admin from "firebase-admin";

// Initialize the app if it hasn't been initialized yet
if (!admin.apps.length) {
  admin.initializeApp();
}

// Export database instance for easier access
export const db = admin.database();

// Export auth instance for easier access
export const auth = admin.auth();

// Export admin as default
export default admin;
