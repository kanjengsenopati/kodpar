
interface SessionData {
  token: string;
  userId: string;
  expiresAt: number;
  refreshToken: string;
}

const SESSION_KEY = 'koperasi_session';
const SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours
const REFRESH_THRESHOLD = 30 * 60 * 1000; // 30 minutes

/**
 * Encrypt data before storing
 */
const encryptData = (data: string): string => {
  // In production, use proper encryption library
  // For now, we'll use base64 encoding as a basic obfuscation
  return btoa(data);
};

/**
 * Decrypt stored data
 */
const decryptData = (encryptedData: string): string => {
  try {
    return atob(encryptedData);
  } catch {
    return '';
  }
};

/**
 * Store session securely
 */
export const storeSession = (userId: string, token: string, refreshToken: string): void => {
  const sessionData: SessionData = {
    token,
    userId,
    expiresAt: Date.now() + SESSION_DURATION,
    refreshToken
  };

  const encryptedData = encryptData(JSON.stringify(sessionData));
  sessionStorage.setItem(SESSION_KEY, encryptedData);
};

/**
 * Get session data
 */
export const getSession = (): SessionData | null => {
  try {
    const encryptedData = sessionStorage.getItem(SESSION_KEY);
    if (!encryptedData) return null;

    const decryptedData = decryptData(encryptedData);
    const sessionData: SessionData = JSON.parse(decryptedData);

    // Check if session is expired
    if (Date.now() > sessionData.expiresAt) {
      clearSession();
      return null;
    }

    return sessionData;
  } catch {
    clearSession();
    return null;
  }
};

/**
 * Check if session needs refresh
 */
export const needsRefresh = (): boolean => {
  const session = getSession();
  if (!session) return false;

  return (session.expiresAt - Date.now()) < REFRESH_THRESHOLD;
};

/**
 * Clear session data
 */
export const clearSession = (): void => {
  sessionStorage.removeItem(SESSION_KEY);
};

/**
 * Update session expiry
 */
export const extendSession = (): void => {
  const session = getSession();
  if (session) {
    session.expiresAt = Date.now() + SESSION_DURATION;
    const encryptedData = encryptData(JSON.stringify(session));
    sessionStorage.setItem(SESSION_KEY, encryptedData);
  }
};
