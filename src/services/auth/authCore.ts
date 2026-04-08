
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
    // Try demo login first
    const demoUser = await handleDemoLogin(email, password);
    if (demoUser) {
      return demoUser;
    }

    // For real users, try Supabase authentication
    try {
      return await handleSupabaseLogin(email, password);
    } catch (supabaseError) {
      console.log("Supabase auth failed:", supabaseError);
      recordFailedAttempt(email);
      throw new Error("Invalid email or password");
    }

  } catch (error) {
    console.error("Login error:", error);
    if (error instanceof Error) {
      throw error;
    }
    recordFailedAttempt(email);
    throw new Error("Login failed");
  }
};
