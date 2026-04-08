
import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated, getCurrentUser } from "@/services/authService";
import { getRoleById } from "@/services/userManagementService";

interface AuthGuardProps {
  children: ReactNode;
  requiredPermission?: string;
}

export function AuthGuard({ children, requiredPermission }: AuthGuardProps) {
  const location = useLocation();
  const isAuth = isAuthenticated();
  const currentUser = getCurrentUser();
  
  useEffect(() => {
    // Only log authentication status in development
    if (process.env.NODE_ENV === 'development') {
      console.log("Auth status:", isAuth);
      console.log("Current location:", location.pathname);
    }
  }, [isAuth, location]);
  
  // If user is not authenticated, redirect to login
  if (!isAuth) {
    if (location.pathname !== '/login' && location.pathname !== '/anggota/login') {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return <>{children}</>;
  }
  
  // If permission is required, check if user has it
  if (requiredPermission && currentUser) {
    // Check if user has required permission directly via role
    const hasPermissionFromRole = currentUser.role?.permissions?.includes(requiredPermission);
    
    if (hasPermissionFromRole) {
      return <>{children}</>;
    } 
    
    // If no role information in currentUser, try to get it
    if (currentUser.roleId) {
      const role = getRoleById(currentUser.roleId);
      
      if (role && role.permissions?.includes(requiredPermission)) {
        return <>{children}</>;
      }
    }
    
    // Redirect to home if user doesn't have permission
    return <Navigate to="/" replace />;
  }
  
  // If everything is fine, show the protected content
  return <>{children}</>;
}
