
import { Role, User } from "@/types";
import { generateId } from "@/lib/utils";
import { getFromLocalStorage, saveToLocalStorage } from "@/utils/localStorage";
import { getUsersFromStorage } from "./userService";
import { defaultPermissions } from "./permissionService";

// Local Storage Key
const ROLES_KEY = "koperasi_roles";

// Default roles
export const defaultRoles: Role[] = [
  {
    id: "role_superadmin",
    name: "Super Admin",
    description: "Akses penuh ke semua fitur sistem",
    permissions: defaultPermissions.map(p => p.id),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "role_admin",
    name: "Admin",
    description: "Akses untuk mengelola data koperasi",
    permissions: [
      "perm_anggota_read", "perm_anggota_create", "perm_anggota_update",
      "perm_transaksi_read", "perm_transaksi_create", "perm_transaksi_update",
      "perm_laporan_read", "perm_laporan_export",
      "perm_pos_read", "perm_pos_sell", "perm_pos_inventory",
      "perm_users_read", "perm_pengaturan_read"
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "role_kasir",
    name: "Kasir",
    description: "Akses untuk melakukan transaksi penjualan",
    permissions: [
      "perm_pos_read", "perm_pos_sell"
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Roles Service
export const getRoles = (): Role[] => {
  return getFromLocalStorage(ROLES_KEY, []);
};

export const getRoleById = (id: string): Role | undefined => {
  const roles = getRoles();
  return roles.find(role => role.id === id);
};

export const createRole = (roleData: Omit<Role, "id" | "createdAt" | "updatedAt">): Role => {
  const roles = getRoles();
  const newRole: Role = {
    id: generateId("ROLE"),
    ...roleData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  roles.push(newRole);
  saveToLocalStorage(ROLES_KEY, roles);
  return newRole;
};

export const updateRole = (id: string, roleData: Partial<Role>): Role | null => {
  const roles = getRoles();
  const index = roles.findIndex(role => role.id === id);
  
  if (index === -1) return null;
  
  const updatedRole = {
    ...roles[index],
    ...roleData,
    updatedAt: new Date().toISOString()
  };
  
  roles[index] = updatedRole;
  saveToLocalStorage(ROLES_KEY, roles);
  return updatedRole;
};

export const deleteRole = (id: string): boolean => {
  // Check if any user is using this role
  const users = getUsersFromStorage();
  const hasUsers = users.some(user => user.roleId === id);
  
  if (hasUsers) {
    return false; // Cannot delete a role that is being used
  }
  
  const roles = getRoles();
  const filteredRoles = roles.filter(role => role.id !== id);
  
  if (filteredRoles.length === roles.length) {
    return false;
  }
  
  saveToLocalStorage(ROLES_KEY, filteredRoles);
  return true;
};

export const initRoles = (): void => {
  // Initialize roles
  const existingRoles = getRoles();
  if (existingRoles.length === 0) {
    saveToLocalStorage(ROLES_KEY, defaultRoles);
  }
};
