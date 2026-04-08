
import { User } from "@/types/user";
import { Role, Permission } from "@/types";
import { generateId } from "@/lib/utils";
import { getFromLocalStorage, saveToLocalStorage } from "@/utils/localStorage";

// Import all services
import { 
  getUsers as getUsersFromService, 
  getUserById as getUserByIdFromService, 
  createUser as createUserFromService, 
  updateUser as updateUserFromService, 
  deleteUser as deleteUserFromService, 
  initUsers as initUsersFromService,
  defaultUsers
} from "./user-management/userService";

import {
  getRoles as getRolesFromService,
  getRoleById as getRoleByIdFromService,
  createRole as createRoleFromService,
  updateRole as updateRoleFromService,
  deleteRole as deleteRoleFromService,
  initRoles as initRolesFromService
} from "./user-management/roleService";

import {
  getPermissions as getPermissionsFromService,
  getPermissionsByModule as getPermissionsByModuleFromService,
  initPermissions as initPermissionsFromService
} from "./user-management/permissionService";

import {
  hasPermission as hasPermissionFromUtils,
  hasModulePermission as hasModulePermissionFromUtils
} from "./user-management/permissionUtils";

// Initialize all data
export const initUserManagementData = (): void => {
  initPermissionsFromService();
  initRolesFromService();
  initUsersFromService();

  // Make sure users are initialized - fallback
  const existingUsers = getFromLocalStorage("koperasi_users", []);
  if (existingUsers.length === 0) {
    console.log("No users found, initializing default users");
    saveToLocalStorage("koperasi_users", defaultUsers);
  }
};

// Make sure data is initialized
initUserManagementData();

// Export all functions
export const getUsers = getUsersFromService;
export const getUserById = getUserByIdFromService;
export const createUser = createUserFromService;
export const updateUser = updateUserFromService;
export const deleteUser = deleteUserFromService;
export const initUsers = initUsersFromService;

export const getRoles = getRolesFromService;
export const getRoleById = getRoleByIdFromService;
export const createRole = createRoleFromService;
export const updateRole = updateRoleFromService;
export const deleteRole = deleteRoleFromService;
export const initRoles = initRolesFromService;

export const getPermissions = getPermissionsFromService;
export const getPermissionsByModule = getPermissionsByModuleFromService;
export const initPermissions = initPermissionsFromService;

export const hasPermission = hasPermissionFromUtils;
export const hasModulePermission = hasModulePermissionFromUtils;
