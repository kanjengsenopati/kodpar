import { ExtendedUser } from "@/types/auth";
import { generateSecureToken } from "@/utils/security";
import { storeSession } from "@/utils/secureStorage";
import { clearFailedAttempts } from "./rateLimiting";

/**
 * Handle demo user authentication
 */
export const handleDemoLogin = async (email: string, password: string): Promise<ExtendedUser | null> => {
  // Demo Super Admin
  if (email === "adminkpri@email.com" && password === "password123") {
    const extendedUser: ExtendedUser = {
      id: "demo-superadmin-001",
      username: 'adminkpri',
      nama: 'Admin KPRI Super',
      email: email,
      roleId: 'role_superadmin',
      aktif: true,
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      role: {
        id: 'role_superadmin',
        name: 'Super Admin',
        permissions: ['*']
      }
    };

    const token = generateSecureToken();
    const refreshToken = generateSecureToken();
    storeSession(extendedUser.id, token, refreshToken);
    clearFailedAttempts(email);

    // Log audit entry for successful login
    try {
      const { logAuditEntry } = await import("../auditService");
      logAuditEntry(
        "LOGIN",
        "SYSTEM",
        `Demo login berhasil untuk Super Admin: ${email}`,
        extendedUser.id
      );
    } catch (auditError) {
      console.log("Audit logging failed, but continuing with login:", auditError);
    }

    console.log("Demo Super Admin login successful for:", email);
    return extendedUser;
  }

  // Demo Admin
  if (email === "admin@email.com" && password === "password123") {
    const extendedUser: ExtendedUser = {
      id: "demo-admin-002",
      username: 'admin',
      nama: 'Admin',
      email: email,
      roleId: 'role_admin',
      aktif: true,
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      role: {
        id: 'role_admin',
        name: 'Admin',
        permissions: ['users:read', 'users:create', 'users:update', 'anggota:create', 'transaksi:create']
      }
    };

    const token = generateSecureToken();
    const refreshToken = generateSecureToken();
    storeSession(extendedUser.id, token, refreshToken);
    clearFailedAttempts(email);
    
    console.log("Demo Admin login successful for:", email);
    return extendedUser;
  }

  // Demo Member (Mariyem)
  if (email === "demo@email.com" && password === "demo") {
    const extendedUser: ExtendedUser = {
      id: "demo-user-003",
      username: 'mariyem',
      nama: 'MARIYEM',
      email: email,
      roleId: 'role_anggota',
      anggotaId: "AG0001",
      aktif: true,
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      role: {
        id: 'role_anggota',
        name: 'Anggota',
        permissions: ['view_own_data', 'update_own_profile']
      }
    };

    const token = generateSecureToken();
    const refreshToken = generateSecureToken();
    storeSession(extendedUser.id, token, refreshToken);
    clearFailedAttempts(email);
    
    console.log("Demo Member login successful for:", email);
    return extendedUser;
  }

  return null;
};
