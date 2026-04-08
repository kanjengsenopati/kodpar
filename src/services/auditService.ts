import { getFromLocalStorage, saveToLocalStorage } from "@/utils/localStorage";
import { getCurrentUser } from "@/services/authService";

export interface AuditEntry {
  id: string;
  timestamp: string;
  userId: string;
  username: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  device: string;
  browser: string;
  os: string;
  sessionId?: string;
}

const AUDIT_KEY = "koperasi_audit_trail";

// Get device information from user agent
const getDeviceInfo = (userAgent: string) => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const isTablet = /iPad|Android(?!.*Mobile)/i.test(userAgent);
  
  if (isTablet) return "Tablet";
  if (isMobile) return "Mobile";
  return "Desktop";
};

// Get browser information
const getBrowserInfo = (userAgent: string) => {
  if (userAgent.includes("Chrome")) return "Chrome";
  if (userAgent.includes("Firefox")) return "Firefox";
  if (userAgent.includes("Safari")) return "Safari";
  if (userAgent.includes("Edge")) return "Edge";
  return "Unknown";
};

// Get OS information
const getOSInfo = (userAgent: string) => {
  if (userAgent.includes("Windows")) return "Windows";
  if (userAgent.includes("Mac")) return "macOS";
  if (userAgent.includes("Linux")) return "Linux";
  if (userAgent.includes("Android")) return "Android";
  if (userAgent.includes("iOS")) return "iOS";
  return "Unknown";
};

// Get client IP (mock for demo - in production use proper IP detection)
const getClientIP = async (): Promise<string> => {
  try {
    // In production, you would get this from your backend
    // For demo purposes, we'll use a mock IP
    return "192.168.1.100";
  } catch {
    return "Unknown";
  }
};

export const logAuditEntry = async (
  action: string,
  resource: string,
  details: string,
  resourceId?: string
): Promise<void> => {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const userAgent = navigator.userAgent;
  const ipAddress = await getClientIP();
  
  const auditEntry: AuditEntry = {
    id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    userId: currentUser.id,
    username: currentUser.username,
    action,
    resource,
    resourceId,
    details,
    ipAddress,
    userAgent,
    device: getDeviceInfo(userAgent),
    browser: getBrowserInfo(userAgent),
    os: getOSInfo(userAgent),
    sessionId: `session_${Date.now()}`
  };

  const auditTrail = getAuditTrail();
  auditTrail.unshift(auditEntry);

  // Keep only last 1000 entries
  if (auditTrail.length > 1000) {
    auditTrail.splice(1000);
  }

  saveToLocalStorage(AUDIT_KEY, auditTrail);
  console.log("Audit logged:", auditEntry);
};

export const getAuditTrail = (): AuditEntry[] => {
  return getFromLocalStorage<AuditEntry[]>(AUDIT_KEY, []);
};

export const getAuditTrailByUser = (userId: string): AuditEntry[] => {
  return getAuditTrail().filter(entry => entry.userId === userId);
};

export const getAuditTrailByResource = (resource: string): AuditEntry[] => {
  return getAuditTrail().filter(entry => entry.resource === resource);
};

export const getAuditTrailByDateRange = (startDate: string, endDate: string): AuditEntry[] => {
  return getAuditTrail().filter(entry => {
    const entryDate = new Date(entry.timestamp);
    return entryDate >= new Date(startDate) && entryDate <= new Date(endDate);
  });
};

export const clearAuditTrail = (): void => {
  saveToLocalStorage(AUDIT_KEY, []);
};

// Helper function to format action descriptions
export const getActionDescription = (action: string, resource: string): string => {
  const actionMap: Record<string, string> = {
    CREATE: "Membuat",
    UPDATE: "Memperbarui", 
    DELETE: "Menghapus",
    VIEW: "Melihat",
    LOGIN: "Login",
    LOGOUT: "Logout",
    EXPORT: "Mengekspor",
    IMPORT: "Mengimpor"
  };

  const resourceMap: Record<string, string> = {
    ANGGOTA: "Data Anggota",
    TRANSAKSI: "Transaksi",
    PENGATURAN: "Pengaturan",
    USER: "Pengguna",
    ROLE: "Peran",
    BACKUP: "Backup Data",
    SYSTEM: "Sistem"
  };

  return `${actionMap[action] || action} ${resourceMap[resource] || resource}`;
};
