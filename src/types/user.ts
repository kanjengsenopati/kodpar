
// User Management Types
export interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
  action: "read" | "create" | "update" | "delete" | "all";
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[]; // Permission IDs
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  username: string;
  nama: string;
  email: string;
  foto?: string;
  jabatan?: string;
  noHP?: string;
  alamat?: string;
  roleId: string;
  roleName?: string;
  aktif: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  anggotaId?: string;
  password?: string;
}

export interface UserFormData extends Omit<User, "id" | "createdAt" | "updatedAt" | "lastLogin" | "roleName"> {
  id?: string;
  password?: string;
}
