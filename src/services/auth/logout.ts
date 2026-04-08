import { clearSession } from "@/utils/secureStorage";
import { getCurrentUser } from "./sessionManagement";

/**
 * Logout function
 */
export const logoutUser = (): void => {
  const currentUser = getCurrentUser();
  
  console.log("Logging out user securely");
  clearSession();
  
  // Log audit entry for logout
  if (currentUser) {
    import("../auditService").then(({ logAuditEntry }) => {
      logAuditEntry(
        "LOGOUT",
        "SYSTEM",
        `Logout berhasil untuk user: ${currentUser.username}`,
        currentUser.id
      );
    });
  }
};