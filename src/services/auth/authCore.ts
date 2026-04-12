
import { ExtendedUser } from "@/types/auth";
import { isLockedOut, recordFailedAttempt, clearFailedAttempts } from "./rateLimiting";
import { handleDemoLogin } from "./demoAuth";
import { handleSupabaseLogin } from "./supabaseAuth";

// Re-export functions from other modules
export { loginWithAnggotaId } from "./anggotaAuth";
export { logoutUser } from "./logout";

/**
 * Main login function with email authentication
 */
export const loginUser = async (email: string, password: string): Promise<ExtendedUser> => {
  console.log("Attempting login for:", email);
  
  // Check for lockout first and clear if needed for demo accounts
  if (isLockedOut(email)) {
    // Clear lockout for demo accounts
    if (email === "adminkpri@email.com" || email === "admin@email.com" || email === "demo@email.com") {
      clearFailedAttempts(email);
    } else {
      throw new Error("Account temporarily locked due to too many failed attempts. Please try again later.");
    }
  }

  try {
    const { BACKEND_URL } = await import("@/config/apiConfig");
    
    const response = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success && result.data) {
        const user = result.data as ExtendedUser;
        
        // Finalize session (tokens matching demoAuth logic)
        const { generateSecureToken } = await import("@/utils/security");
        const { storeSession } = await import("@/utils/secureStorage");
        const token = generateSecureToken();
        const refreshToken = generateSecureToken();
        storeSession(user.id, token, refreshToken);
        clearFailedAttempts(email);

        console.log("Cloud Database Login successful for:", email);
        return user;
      }
    }

    // If backend failed or rejected, check the status
    if (response.status === 401) {
      recordFailedAttempt(email);
      throw new Error("Email atau password salah");
    }

    throw new Error("Gagal terhubung ke layanan otentikasi awan");

  } catch (error) {

    console.error("Login error:", error);
    if (error instanceof Error) {
      throw error;
    }
    recordFailedAttempt(email);
    throw new Error("Login failed");
  }
};
