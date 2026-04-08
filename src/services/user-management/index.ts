
import { User } from "@/types/user";
import { Role, Permission } from "@/types";

// Import all services
import { 
  getUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser, 
  initUsers 
} from "./userService";

import {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  initRoles
} from "./roleService";

import {
  getPermissions,
  getPermissionsByModule,
  initPermissions
} from "./permissionService";

import {
  hasPermission,
  hasModulePermission
} from "./permissionUtils";

// Initialize all data
export const initUserManagementData = (): void => {
  initPermissions();
  initRoles();
  initUsers();
};

// Export all functions
export {
  // User functions
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  
  // Role functions
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  
  // Permission functions
  getPermissions,
  getPermissionsByModule,
  
  // Permission utility functions
  hasPermission,
  hasModulePermission
};
