import { User } from "@/types/user";
import { generateId } from "@/lib/utils";
import { getFromLocalStorage, saveToLocalStorage } from "@/utils/localStorage";
import { getRoleById } from "./roleService";

// Local Storage Key
const USERS_KEY = "koperasi_users";

// Default users
export const defaultUsers: User[] = [
  {
    id: "user_1",
    username: "superadmin",
    nama: "Super Administrator",
    email: "superadmin@koperasi.com",
    roleId: "role_superadmin",
    foto: "",
    jabatan: "Super Administrator",
    noHP: "081234567890",
    alamat: "Jl. Admin No. 1",
    aktif: true,
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "user_2",
    username: "admin",
    nama: "Administrator",
    email: "admin@koperasi.com",
    roleId: "role_admin",
    foto: "",
    jabatan: "Administrator",
    noHP: "081234567891",
    alamat: "Jl. Admin No. 2",
    aktif: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "user_3",
    username: "demo",
    nama: "Demo User",
    email: "demo@koperasi.com",
    roleId: "role_admin",
    foto: "",
    jabatan: "Demo Administrator",
    noHP: "081234567892",
    alamat: "Jl. Demo No. 1",
    aktif: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "user_4",
    username: "kasir1",
    nama: "Kasir Utama",
    email: "kasir@koperasi.com",
    roleId: "role_kasir",
    foto: "",
    jabatan: "Kasir",
    noHP: "081234567893",
    alamat: "Jl. Kasir No. 1",
    aktif: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "user_5",
    username: "anggota1",
    nama: "Budi Santoso",
    email: "anggota@koperasi.com",
    roleId: "role_kasir",
    anggotaId: "AGT001",
    foto: "",
    jabatan: "Anggota",
    noHP: "081234567894",
    alamat: "Jl. Anggota No. 1",
    aktif: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const getUsersFromStorage = (): User[] => {
  return getFromLocalStorage(USERS_KEY, []);
};

export const getUsers = (): User[] => {
  return getUsersFromStorage();
};

export const getUserById = (id: string): User | undefined => {
  const users = getUsers();
  return users.find(user => user.id === id);
};

export const createUser = (userData: Omit<User, "id" | "createdAt" | "updatedAt">): User => {
  const users = getUsers();
  const newUser: User = {
    id: generateId("user"),
    ...userData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  users.push(newUser);
  saveToLocalStorage(USERS_KEY, users);
  return newUser;
};

export const updateUser = (id: string, userData: Partial<User>): User | null => {
  const users = getUsers();
  const index = users.findIndex(user => user.id === id);
  
  if (index === -1) return null;
  
  // Update user data
  const updatedUser = {
    ...users[index],
    ...userData,
    updatedAt: new Date().toISOString()
  };
  
  users[index] = updatedUser;
  saveToLocalStorage(USERS_KEY, users);
  return updatedUser;
};

export const deleteUser = (id: string): boolean => {
  const users = getUsers();
  const filteredUsers = users.filter(user => user.id !== id);
  
  if (filteredUsers.length === users.length) {
    return false;
  }
  
  saveToLocalStorage(USERS_KEY, filteredUsers);
  return true;
};

export const initUsers = (): void => {
  // Initialize users
  const existingUsers = getUsersFromStorage();
  if (existingUsers.length === 0) {
    saveToLocalStorage(USERS_KEY, defaultUsers);
  }
};
