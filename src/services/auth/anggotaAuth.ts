import { ExtendedUser } from "@/types/auth";
import { getAnggotaById } from "@/services/anggotaService";
import { generateSecureToken } from "@/utils/security";
import { storeSession } from "@/utils/secureStorage";
import { isLockedOut, recordFailedAttempt, clearFailedAttempts } from "./rateLimiting";

/**
 * Login function for anggota with security improvements
 */
export const loginWithAnggotaId = async (anggotaId: string, password: string): Promise<ExtendedUser> => {
  console.log("Attempting secure anggota login for ID:", anggotaId);
  
  // Check for lockout
  if (isLockedOut(anggotaId)) {
    throw new Error("Akun sementara dikunci karena terlalu banyak percobaan login. Silakan coba lagi nanti.");
  }

  try {
    const anggota = getAnggotaById(anggotaId);
    
    if (!anggota) {
      recordFailedAttempt(anggotaId);
      throw new Error("ID Anggota tidak ditemukan");
    }

    // For demo purposes, accept password123 or the anggota ID
    const isValidPassword = password === "password123" || password === anggota.id;
    
    if (!isValidPassword) {
      recordFailedAttempt(anggotaId);
      throw new Error("Password salah");
    }

    // Clear failed attempts on successful login
    clearFailedAttempts(anggotaId);
    
    // Generate secure tokens
    const token = generateSecureToken();
    const refreshToken = generateSecureToken();
    
    // Create auth user ID
    const authUserId = `anggota-${anggota.id}`;
    
    // Store secure session
    storeSession(authUserId, token, refreshToken);
    
    const authUser: ExtendedUser = {
      id: authUserId,
      username: anggota.nama,
      nama: anggota.nama,
      email: anggota.email || "",
      roleId: "anggota",
      anggotaId: anggota.id,
      aktif: true,
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      role: {
        id: "anggota",
        name: "Anggota",
        permissions: ["view_own_data"]
      }
    };
    
    // Log audit entry for successful anggota login
    const { logAuditEntry } = await import("../auditService");
    logAuditEntry(
      "LOGIN",
      "SYSTEM",
      `Login anggota berhasil untuk ID: ${anggotaId} (${anggota.nama})`,
      authUserId
    );
    
    console.log("Secure anggota login successful for:", anggotaId);
    return authUser;
  } catch (error) {
    console.error("Anggota login error:", error);
    throw error;
  }
};