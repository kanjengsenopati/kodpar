
import { Permission } from "@/types";
import { getFromLocalStorage, saveToLocalStorage } from "@/utils/localStorage";

// Local Storage Key
const PERMISSIONS_KEY = "koperasi_permissions";

// Default permissions for the system
export const defaultPermissions: Permission[] = [
  // Anggota permissions
  { id: "perm_anggota_read", name: "Lihat Anggota", description: "Melihat data anggota", module: "anggota", action: "read" },
  { id: "perm_anggota_create", name: "Tambah Anggota", description: "Menambah anggota baru", module: "anggota", action: "create" },
  { id: "perm_anggota_update", name: "Edit Anggota", description: "Mengubah data anggota", module: "anggota", action: "update" },
  { id: "perm_anggota_delete", name: "Hapus Anggota", description: "Menghapus anggota", module: "anggota", action: "delete" },
  
  // Transaksi permissions
  { id: "perm_transaksi_read", name: "Lihat Transaksi", description: "Melihat transaksi", module: "transaksi", action: "read" },
  { id: "perm_transaksi_create", name: "Tambah Transaksi", description: "Membuat transaksi baru", module: "transaksi", action: "create" },
  { id: "perm_transaksi_update", name: "Edit Transaksi", description: "Mengubah data transaksi", module: "transaksi", action: "update" },
  { id: "perm_transaksi_delete", name: "Batalkan Transaksi", description: "Membatalkan transaksi", module: "transaksi", action: "delete" },
  
  // Laporan permissions
  { id: "perm_laporan_read", name: "Lihat Laporan", description: "Melihat laporan", module: "laporan", action: "read" },
  { id: "perm_laporan_export", name: "Export Laporan", description: "Mengexport laporan", module: "laporan", action: "create" },
  
  // POS permissions
  { id: "perm_pos_read", name: "Akses POS", description: "Mengakses modul POS", module: "pos", action: "read" },
  { id: "perm_pos_sell", name: "Penjualan", description: "Melakukan penjualan", module: "pos", action: "create" },
  { id: "perm_pos_inventory", name: "Kelola Inventori", description: "Mengelola stok barang", module: "pos", action: "update" },
  
  // User Management permissions
  { id: "perm_users_read", name: "Lihat Pengguna", description: "Melihat daftar pengguna", module: "users", action: "read" },
  { id: "perm_users_create", name: "Tambah Pengguna", description: "Menambah pengguna baru", module: "users", action: "create" },
  { id: "perm_users_update", name: "Edit Pengguna", description: "Mengubah data pengguna", module: "users", action: "update" },
  { id: "perm_users_delete", name: "Hapus Pengguna", description: "Menghapus pengguna", module: "users", action: "delete" },
  
  // Role Management permissions
  { id: "perm_roles_read", name: "Lihat Role", description: "Melihat daftar role", module: "roles", action: "read" },
  { id: "perm_roles_create", name: "Tambah Role", description: "Menambah role baru", module: "roles", action: "create" },
  { id: "perm_roles_update", name: "Edit Role", description: "Mengubah data role", module: "roles", action: "update" },
  { id: "perm_roles_delete", name: "Hapus Role", description: "Menghapus role", module: "roles", action: "delete" },
  
  // Pengaturan permissions
  { id: "perm_pengaturan_read", name: "Lihat Pengaturan", description: "Melihat pengaturan", module: "pengaturan", action: "read" },
  { id: "perm_pengaturan_update", name: "Ubah Pengaturan", description: "Mengubah pengaturan", module: "pengaturan", action: "update" },
];

// Permissions Service
export const getPermissions = (): Permission[] => {
  return getFromLocalStorage(PERMISSIONS_KEY, []);
};

export const getPermissionsByModule = (module: string): Permission[] => {
  const permissions = getPermissions();
  return permissions.filter(perm => perm.module === module);
};

export const initPermissions = (): void => {
  // Initialize permissions
  const existingPermissions = getPermissions();
  if (existingPermissions.length === 0) {
    saveToLocalStorage(PERMISSIONS_KEY, defaultPermissions);
  }
};
