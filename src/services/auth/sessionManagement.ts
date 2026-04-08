
import { ExtendedUser } from "@/types/auth";
import { getUserById } from "@/services/userManagementService";
import { getRoleById } from "@/services/user-management/roleService";
import { storeSession, getSession, clearSession, needsRefresh, extendSession } from "@/utils/secureStorage";

interface AuthState {
  currentUser: ExtendedUser | null;
  isAuthenticated: boolean;
}

/**
 * Get authentication state from secure session
 */
export const getAuthState = (): AuthState => {
  const session = getSession();
  
  if (!session) {
    return {
      currentUser: null,
      isAuthenticated: false
    };
  }

  // Extend session if needed
  if (needsRefresh()) {
    extendSession();
  }

  // Handle demo users specially - they don't exist in database
  if (session.userId.startsWith('demo-')) {
    const extendedUser = getDemoUser(session.userId);
    if (extendedUser) {
      return {
        currentUser: extendedUser,
        isAuthenticated: true
      };
    }
  }

  // Get user data for real users
  const user = getUserById(session.userId);
  if (!user) {
    clearSession();
    return {
      currentUser: null,
      isAuthenticated: false
    };
  }

  // Get role information
  const role = user.roleId ? getRoleById(user.roleId) : undefined;
  
  const extendedUser: ExtendedUser = {
    ...user,
    role: role ? {
      id: role.id,
      name: role.name,
      permissions: role.permissions
    } : undefined
  };

  return {
    currentUser: extendedUser,
    isAuthenticated: true
  };
};

/**
 * Get demo user data
 */
const getDemoUser = (userId: string): ExtendedUser | null => {
  switch (userId) {
    case "demo-superadmin-001":
      return {
        id: "demo-superadmin-001",
        username: 'adminkpri',
        nama: 'Admin KPRI Super',
        email: 'adminkpri@email.com',
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
    case "demo-admin-002":
      return {
        id: "demo-admin-002",
        username: 'admin',
        nama: 'Admin',
        email: 'admin@email.com',
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
    case "demo-user-003":
      return {
        id: "demo-user-003",
        username: 'demo',
        nama: 'Demo User',
        email: 'demo@email.com',
        roleId: 'role_anggota',
        aktif: true,
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        role: {
          id: 'role_anggota',
          name: 'Anggota',
          permissions: ['view_own_data']
        }
      };
    default:
      return null;
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const authState = getAuthState();
  return authState.isAuthenticated;
};

/**
 * Get the current user
 */
export const getCurrentUser = (): ExtendedUser | null => {
  const authState = getAuthState();
  return authState.currentUser;
};

/**
 * Check if user has permission
 */
export const hasPermission = (permissionId: string): boolean => {
  const user = getCurrentUser();
  if (!user) return false;
  
  if (user.permissions?.includes(permissionId)) {
    return true;
  }
  
  if (user.role?.permissions?.includes(permissionId)) {
    return true;
  }
  
  return false;
};
