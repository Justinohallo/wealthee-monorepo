import { auth } from "../../config/firebase";
/**
 * Admin user management functions
 */
import { createHttpFunction } from "../../utils/function-wrapper";
import { logger } from "../../utils/logger";

/**
 * Creates a super user with admin privileges
 * Note: In production, you should limit access to this function
 * through proper security rules and authentication
 */
export const createSuperUser = createHttpFunction({
  handler: async ({ req, res }) => {
    // Extract user data from request or use defaults
    const email = req.body.email || "justinohallo@gmail.com";
    const password = req.body.password || "tempTemp1234";

    logger.info(`Creating super user with email: ${email}`, "AdminUserManagement");

    // Create the user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      emailVerified: true,
    });

    // Set custom claims to assign the role "admin"
    await auth.setCustomUserClaims(userRecord.uid, { role: "admin" });

    logger.info(`Super user created successfully: ${userRecord.uid}`, "AdminUserManagement");

    // Return success response
    res.json({
      success: true,
      data: {
        uid: userRecord.uid,
        email: userRecord.email,
        role: "admin",
      },
      timestamp: new Date().toISOString(),
    });
  },
  options: {
    // In a real application, you would require authentication and specific roles
    // requireAuth: true,
    // requiredRole: "admin",
  }
});

/**
 * Lists all admin users in the system
 */
export const listAdmins = createHttpFunction({
  handler: async ({ res }) => {
    logger.info("Listing all admin users", "AdminUserManagement");

    // Retrieve all users from Firebase Auth
    const { users } = await auth.listUsers();

    // Filter users with admin role
    const adminUsers = users.filter(
      (user) => user.customClaims && user.customClaims.role === "admin"
    );

    // Transform user data to include only necessary fields
    const formattedUsers = adminUsers.map((user) => ({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      disabled: user.disabled,
      creationTime: user.metadata.creationTime,
      lastSignInTime: user.metadata.lastSignInTime,
    }));

    // Return success response
    res.json({
      success: true,
      data: formattedUsers,
      timestamp: new Date().toISOString(),
    });
  },
  options: {
    // requireAuth: true,
    requiredRole: "admin",
  }
});

/**
 * Disables an admin user
 */
export const disableAdmin = createHttpFunction({
  handler: async ({ req, res }) => {
    // Check for required path parameter
    const { uid } = req.params;
    if (!uid) {
      res.status(400).json({
        success: false,
        error: "Required path parameter 'uid' is missing",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    logger.info(`Disabling admin user: ${uid}`, "AdminUserManagement");

    // Check if user exists and has admin role
    const user = await auth.getUser(uid);
    if (!user.customClaims || user.customClaims.role !== "admin") {
      res.status(404).json({
        success: false,
        error: "Admin user not found",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Disable the user
    await auth.updateUser(uid, { disabled: true });

    logger.info(`Admin user disabled: ${uid}`, "AdminUserManagement");

    // Return success response
    res.json({
      success: true,
      data: { uid, disabled: true },
      timestamp: new Date().toISOString(),
    });
  },
  options: {
    requireAuth: true,
    requiredRole: "admin",
  }
});
