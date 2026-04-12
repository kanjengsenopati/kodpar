
import { UnitKerja } from "@/types/unitKerja";
import { db } from "@/db/db";
import { getAllUnitKerja } from "./unitKerjaData";

/**
 * Check if unit kerja name already exists
 */
export async function isDuplicateName(nama: string, excludeId?: string): Promise<boolean> {
  const unitKerjaList = await getAllUnitKerja();
  return unitKerjaList.some(uk => 
    uk.id !== excludeId && uk.nama.toLowerCase() === nama.toLowerCase()
  );
}

/**
 * Check if unit kerja is being used by any anggota
 */
export async function isUnitKerjaInUse(unitKerjaNama: string): Promise<boolean> {
  try {
    const count = await db.anggota.where('unitKerja').equals(unitKerjaNama).count();
    return count > 0;
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
export async function validateForCreate(nama: string, keterangan?: string): Promise<void> {
  const errors = validateUnitKerjaData(nama, keterangan);
  
  if (await isDuplicateName(nama)) {
    errors.push("Unit kerja dengan nama tersebut sudah ada");
  }
  
  if (errors.length > 0) {
    throw new Error(errors.join(", "));
  }
}

/**
 * Validate unit kerja for update
 */
export async function validateForUpdate(id: string, nama: string, keterangan?: string): Promise<void> {
  const errors = validateUnitKerjaData(nama, keterangan);
  
  if (await isDuplicateName(nama, id)) {
    errors.push("Unit kerja dengan nama tersebut sudah ada");
  }
  
  if (errors.length > 0) {
    throw new Error(errors.join(", "));
  }
}

/**
 * Validate unit kerja for deletion
 */
export async function validateForDelete(unitKerja: UnitKerja): Promise<void> {
  if (await isUnitKerjaInUse(unitKerja.nama)) {
    throw new Error("Unit kerja tidak dapat dihapus karena masih digunakan oleh anggota");
  }
}
