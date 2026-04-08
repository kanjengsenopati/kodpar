// Re-export all authentication functions from modular files
export {
  getAuthState,
  isAuthenticated,
  getCurrentUser,
  hasPermission
} from "./auth/sessionManagement";

export {
  loginUser,
  loginWithAnggotaId,
  logoutUser
} from "./auth/authCore";

export {
  updatePassword
} from "./auth/passwordOperations";

export {
  isLockedOut,
  recordFailedAttempt,
  clearFailedAttempts
} from "./auth/rateLimiting";

// Keep the AuthState interface export for compatibility
export interface AuthState {
  currentUser: import("@/types/auth").ExtendedUser | null;
  isAuthenticated: boolean;
}
