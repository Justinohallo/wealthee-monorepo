import { ADMIN } from "@/constants/functionNames";
import { callFirebaseFunction } from "@/lib/firebase-functions";

/**
 * Admin Users related service functions
 */

export interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  emailVerified: boolean;
  disabled: boolean;
  customClaims: {
    role: string;
  };
}

export interface CreateSuperUserParams {
  email: string;
  displayName: string;
  password: string;
}

/**
 * Create a super user (admin)
 */
export async function createSuperUser(
  params: CreateSuperUserParams,
  idToken: string
): Promise<AdminUser | null> {
  try {
    const response = await callFirebaseFunction<{ admin: AdminUser }>({
      idToken,
      functionName: ADMIN.USERS.CREATE_SUPER_USER,
      options: {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params)
      }
    });

    return response?.data?.admin || null;
  } catch (error) {
    console.error("Failed to create super user:", error);
    throw error;
  }
}

/**
 * List all admins
 */
export async function listAdmins(
  idToken: string
): Promise<AdminUser[]> {
  try {
    const response = await callFirebaseFunction<{ admins: AdminUser[] }>({
      idToken,
      functionName: ADMIN.USERS.LIST_ADMINS,
      options: {
        method: "GET",
        revalidate: 0 // Don't cache admin data
      }
    });

    return response?.data?.admins || [];
  } catch (error) {
    console.error("Failed to list admins:", error);
    return [];
  }
}

/**
 * Disable an admin
 */
export async function disableAdmin(
  adminId: string,
  idToken: string
): Promise<{ success: boolean }> {
  try {
    const response = await callFirebaseFunction<{ success: boolean }>({
      idToken,
      functionName: ADMIN.USERS.DISABLE_ADMIN,
      queryParams: { adminId },
      options: { method: "PUT" }
    });

    return { success: response?.data?.success || false };
  } catch (error) {
    console.error("Failed to disable admin:", error);
    return { success: false };
  }
}
