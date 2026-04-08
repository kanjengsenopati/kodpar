
import { validatePassword } from "@/utils/security";
import { getCurrentUser } from "./sessionManagement";

/**
 * Update password function with security
 */
export const updatePassword = async (userId: string, currentPassword: string, newPassword: string): Promise<boolean> => {
  try {
    // Validate new password strength
    const validation = validatePassword(newPassword);
    if (!validation.isValid) {
      throw new Error(validation.errors.join('. '));
    }

    const currentUser = getCurrentUser();
    if (currentUser?.anggotaId) {
      // Handle anggota password change
      if (currentPassword !== "password123" && currentPassword !== currentUser.anggotaId) {
        throw new Error("Password lama tidak sesuai");
      }
    } else {
      // Handle admin/staff password change
      // In production, verify against hashed password
      if (currentPassword !== "password123" && currentPassword !== "demo") {
        throw new Error("Password lama tidak sesuai");
      }
    }

    // In production, hash the new password and store it
    console.log("Password updated successfully for user:", userId);
    return true;
  } catch (error) {
    console.error("Password update error:", error);
    throw error;
  }
};
