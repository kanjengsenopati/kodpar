
// Rate limiting for login attempts
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

/**
 * Check if user is locked out due to too many failed attempts
 */
export const isLockedOut = (username: string): boolean => {
  const attempts = loginAttempts.get(username);
  if (!attempts) return false;

  if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
    const timeSinceLastAttempt = Date.now() - attempts.lastAttempt;
    return timeSinceLastAttempt < LOCKOUT_DURATION;
  }

  return false;
};

/**
 * Record failed login attempt
 */
export const recordFailedAttempt = (username: string): void => {
  const attempts = loginAttempts.get(username) || { count: 0, lastAttempt: 0 };
  attempts.count++;
  attempts.lastAttempt = Date.now();
  loginAttempts.set(username, attempts);
};

/**
 * Clear failed login attempts
 */
export const clearFailedAttempts = (username: string): void => {
  loginAttempts.delete(username);
};
