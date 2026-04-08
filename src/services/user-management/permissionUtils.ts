
import { User, Permission } from "@/types";
import { getRoleById } from "./roleService";
import { getPermissions } from "./permissionService";

// Helper function to check if user has a specific permission
export const hasPermission = (user: User | undefined, permissionId: string): boolean => {
  if (!user) return false;
  
  const role = getRoleById(user.roleId);
  if (!role) return false;
  
  return role.permissions.includes(permissionId);
};

// Helper function to check if user has permission for a specific module and action
export const hasModulePermission = (user: User | undefined, module: string, action: "read" | "create" | "update" | "delete" | "all"): boolean => {
  if (!user) return false;
  
  const role = getRoleById(user.roleId);
  if (!role) return false;
  
  const permissions = getPermissions();
  const modulePermissions = permissions.filter(p => 
    p.module === module && (p.action === action || p.action === "all")
  );
  
  return modulePermissions.some(p => role.permissions.includes(p.id));
};
