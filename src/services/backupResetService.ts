
import { getFromLocalStorage, saveToLocalStorage } from "@/utils/localStorage";

export interface BackupData {
  timestamp: string;
  version: string;
  data: {
    transaksi: any[];
    anggota: any[];
    pengajuan: any[];
    keuangan: any[];
    pengaturan: any;
    [key: string]: any;
  };
}

/**
 * Create a backup of all application data
 */
export function createBackup(): BackupData {
  const backup: BackupData = {
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    data: {
      transaksi: getFromLocalStorage("koperasi_transaksi", []),
      anggota: getFromLocalStorage("koperasi_anggota", []),
      pengajuan: getFromLocalStorage("koperasi_pengajuan", []),
      keuangan: getFromLocalStorage("koperasi_pemasukan_pengeluaran", []),
      pengaturan: getFromLocalStorage("koperasi_pengaturan", {}),
      jenis: getFromLocalStorage("koperasi_jenis", []),
      kategori: getFromLocalStorage("koperasi_kategori_transaksi", []),
      unitKerja: getFromLocalStorage("koperasi_unit_kerja", []),
      produk: getFromLocalStorage("koperasi_produk", []),
      penjualan: getFromLocalStorage("koperasi_penjualan", []),
      pembelian: getFromLocalStorage("koperasi_pembelian", []),
      pemasok: getFromLocalStorage("koperasi_pemasok", []),
    }
  };

  console.log("Backup created:", backup);
  return backup;
}

/**
 * Download backup as JSON file
 */
export function downloadBackup(): void {
  const backup = createBackup();
  const dataStr = JSON.stringify(backup, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `koperasi_backup_${new Date().toISOString().split('T')[0]}.json`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

/**
 * Restore data from backup
 */
export function restoreFromBackup(backupData: BackupData): boolean {
  try {
    Object.entries(backupData.data).forEach(([key, value]) => {
      const storageKey = key === "transaksi" ? "koperasi_transaksi" :
                        key === "anggota" ? "koperasi_anggota" :
                        key === "pengajuan" ? "koperasi_pengajuan" :
                        key === "keuangan" ? "koperasi_pemasukan_pengeluaran" :
                        key === "pengaturan" ? "koperasi_pengaturan" :
                        key === "jenis" ? "koperasi_jenis" :
                        key === "kategori" ? "koperasi_kategori_transaksi" :
                        key === "unitKerja" ? "koperasi_unit_kerja" :
                        key === "produk" ? "koperasi_produk" :
                        key === "penjualan" ? "koperasi_penjualan" :
                        key === "pembelian" ? "koperasi_pembelian" :
                        key === "pemasok" ? "koperasi_pemasok" :
                        `koperasi_${key}`;
      
      saveToLocalStorage(storageKey, value);
    });
    
    console.log("Data restored from backup successfully");
    return true;
  } catch (error) {
    console.error("Error restoring backup:", error);
    return false;
  }
}

/**
 * Reset all application data
 */
export function resetAllData(): void {
  const keysToReset = [
    "koperasi_transaksi",
    "koperasi_anggota", 
    "koperasi_pengajuan",
    "koperasi_pemasukan_pengeluaran",
    "koperasi_jenis",
    "koperasi_kategori_transaksi",
    "koperasi_unit_kerja",
    "koperasi_produk",
    "koperasi_penjualan",
    "koperasi_pembelian",
    "koperasi_pemasok"
  ];
  
  // Clear localStorage data
  keysToReset.forEach(key => {
    localStorage.removeItem(key);
  });
  
  // Clear all localStorage items that start with "koperasi_"
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith("koperasi_")) {
      localStorage.removeItem(key);
    }
  });
  
  console.log("All application data has been reset");
}

/**
 * Clear cache and cookies
 */
export function clearCacheAndCookies(): Promise<void> {
  return new Promise((resolve) => {
    // Clear sessionStorage
    sessionStorage.clear();
    
    // Clear all cookies
    document.cookie.split(";").forEach(cookie => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
    });
    
    // Clear browser cache if supported
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      }).then(() => {
        console.log("Browser caches cleared");
        resolve();
      });
    } else {
      console.log("Cache and cookies cleared");
      resolve();
    }
  });
}

/**
 * Complete reset: data + cache + cookies
 */
export async function completeReset(): Promise<void> {
  resetAllData();
  await clearCacheAndCookies();
  console.log("Complete reset performed");
}
