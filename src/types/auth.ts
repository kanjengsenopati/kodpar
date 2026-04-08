
import { User } from "./user";

// Authentication related types
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: ExtendedUser | null;
}

export interface ExtendedUser extends User {
  anggotaId?: string;
  permissions?: string[];
  role?: {
    id: string;
    name: string;
    permissions?: string[];
  };
}
