
import { UnitKerja } from "@/types/unitKerja";
import { getFromLocalStorage } from "@/utils/localStorage";
import { getAllUnitKerja } from "./unitKerjaData";

/**
 * Check if unit kerja name already exists
 */
export function isDuplicateName(nama: string, excludeId?: string): boolean {
  const unitKerjaList = getAllUnitKerja();
  return unitKerjaList.some(uk => 
    uk.id !== excludeId && uk.nama.toLowerCase() === nama.toLowerCase()
  );
}

/**
 * Check if unit kerja is being used by any anggota
 */
export function isUnitKerjaInUse(unitKerjaNama: string): boolean {
  try {
    const anggotaData = getFromLocalStorage("koperasi_anggota", []);
    return anggotaData.some((anggota: any) => anggota.unitKerja === unitKerjaNama);
  } catch (error) {
    console.error("Error checking unit kerja usage:", error);
    return false;
  }
}

/**
 * Validate unit kerja data
 */
export function validateUnitKerjaData(nama: string, keterangan?: string): string[] {
  const errors: string[] = [];
  
  if (!nama || nama.trim() === "") {
    errors.push("Nama unit kerja wajib diisi");
  }
  
  if (nama && nama.trim().length < 2) {
    errors.push("Nama unit kerja minimal 2 karakter");
  }
  
  if (nama && nama.trim().length > 100) {
    errors.push("Nama unit kerja maksimal 100 karakter");
  }
  
  if (keterangan && keterangan.trim().length > 255) {
    errors.push("Keterangan maksimal 255 karakter");
  }
  
  return errors;
}

/**
 * Validate unit kerja for creation
 */
export function validateForCreate(nama: string, keterangan?: string): void {
  const errors = validateUnitKerjaData(nama, keterangan);
  
  if (isDuplicateName(nama)) {
    errors.push("Unit kerja dengan nama tersebut sudah ada");
  }
  
  if (errors.length > 0) {
    throw new Error(errors.join(", "));
  }
}

/**
 * Validate unit kerja for update
 */
export function validateForUpdate(id: string, nama: string, keterangan?: string): void {
  const errors = validateUnitKerjaData(nama, keterangan);
  
  if (isDuplicateName(nama, id)) {
    errors.push("Unit kerja dengan nama tersebut sudah ada");
  }
  
  if (errors.length > 0) {
    throw new Error(errors.join(", "));
  }
}

/**
 * Validate unit kerja for deletion
 */
export function validateForDelete(unitKerja: UnitKerja): void {
  if (isUnitKerjaInUse(unitKerja.nama)) {
    throw new Error("Unit kerja tidak dapat dihapus karena masih digunakan oleh anggota");
  }
}
