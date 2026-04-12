/**
 * Central API Configuration for Koperasi Sync Engine
 * Handles dynamic URL detection for Local & Production (Vercel)
 */

export const getBackendUrl = (): string => {
  // 1. Check for Environment Variable (Vite standard)
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) return envUrl;

  // 2. Production Auto-Detection
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // If running on Vercel/Production, assume API is on a specific subdomain or same host
    // For now, if not localhost, we fallback to a placeholder or the same host API
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      // Logic: If on 'koperasi.vercel.app', API might be on 'api-koperasi.vercel.app'
      // Or if using a proxy, it's the same host.
      // USER SHOULD SET VITE_API_URL for best results.
      return `https://${hostname}/api`; 
    }
  }

  // 3. Local Development Fallback
  return "http://localhost:3001";
};

export const BACKEND_URL = getBackendUrl();
