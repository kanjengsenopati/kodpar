import { Anggota, AnggotaKeluarga } from "@/types/anggota";
import { db } from "@/db/db";
import { getAllUnitKerja, syncUnitKerjaWithAnggota } from "./unitKerjaService";
import { logAuditEntry } from "./auditService";

// Initial sample data with the specified dummy data
const initialAnggota: Anggota[] = [
  { 
    id: "AG0001", 
    nama: "MARIYEM", 
    nip: "197201011998031001",
    alamat: "DESA JATILOR",
    noHp: "0812345678",
    jenisKelamin: "P",
    agama: "ISLAM",
    status: "active",
    unitKerja: "SDN Jatilor 01",
    tanggalBergabung: "2023-01-15",
    tanggalRegistrasi: "2023",
    foto: undefined,
    email: "mariyem@example.com",
    dokumen: [],
    keluarga: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  { 
    id: "AG0002", 
    nama: "MASKUN ROZAK", 
    nip: "198201011998031001",
    alamat: "DESA BRINGIN",
    noHp: "0823456789",
    jenisKelamin: "L",
    agama: "ISLAM",
    status: "active",
    unitKerja: "SDN Bringin",
    tanggalBergabung: "2023-02-20",
    tanggalRegistrasi: "2023",
    foto: undefined,
    email: "maskun.rozak@example.com",
    dokumen: [],
    keluarga: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  { 
    id: "AG0003", 
    nama: "AHMAD NURALIMIN", 
    nip: "198801011998031001",
    alamat: "DESA KLAMPOK",
    noHp: "08345678912",
    jenisKelamin: "L",
    agama: "ISLAM",
    status: "active",
    unitKerja: "SDN Klampok 01",
    tanggalBergabung: "2023-03-10",
    tanggalRegistrasi: "2023",
    foto: undefined,
    email: "ahmad.nuralimin@example.com",
    dokumen: [],
    keluarga: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  { 
    id: "AG0004", 
    nama: "DJAKA KUMALATARTO, S.Pd, M.Pd", 
    nip: "197002161210012345",
    alamat: "Desa Ketitang, Kecamatan Godong, Kab Grobogan",
    noHp: "08123456789",
    jenisKelamin: "L",
    agama: "ISLAM",
    status: "active",
    unitKerja: "SD Negeri Ketitang",
    tanggalBergabung: "2023-04-01",
    tanggalRegistrasi: "2023",
    foto: undefined,
    email: "djaka.kumalatarto@example.com",
    dokumen: [],
    keluarga: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

/**
 * Reset anggota data to initial state and return the reset data
 */
export async function resetAnggotaData(): Promise<Anggota[]> {
  await db.anggota.clear();
  await db.anggota.bulkAdd(initialAnggota);
  
  // After resetting anggota data, sync unit kerja
  syncUnitKerjaWithAnggota();
  
  return initialAnggota;
}

/**
 * Get all anggota from IndexedDB
 */
export async function getAllAnggota(): Promise<Anggota[]> {
  const count = await db.anggota.count();
  if (count === 0) {
    await db.anggota.bulkAdd(initialAnggota);
    return initialAnggota;
  }
  return await db.anggota.toArray();
}

// Alias function for getAllAnggota to fix the import issue
export async function getAnggotaList(): Promise<Anggota[]> {
  return await getAllAnggota();
}

/**
 * Get anggota by ID
 */
export async function getAnggotaById(id: string): Promise<Anggota | undefined> {
  return await db.anggota.get(id);
}

/**
 * Generate a new anggota ID
 */
export async function generateAnggotaId(): Promise<string> {
  const anggotaList = await getAllAnggota();
  const lastId = anggotaList.length > 0 
    ? parseInt(anggotaList[anggotaList.length - 1].id.replace("AG", "")) 
    : 0;
  const newId = `AG${String(lastId + 1).padStart(4, "0")}`;
  return newId;
}

/**
 * Create a new anggota
 */
export async function createAnggota(anggota: Omit<Anggota, 'id' | 'createdAt' | 'updatedAt'>): Promise<Anggota> {
  const id = await generateAnggotaId();
  
  const newAnggota: Anggota = {
    ...anggota,
    id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  await db.anggota.add(newAnggota);
  
  // Sync unit kerja after creating anggota
  syncUnitKerjaWithAnggota();
  
  // Log audit entry
  logAuditEntry(
    "CREATE",
    "ANGGOTA",
    `Membuat data anggota baru: ${newAnggota.nama} (${newAnggota.id})`,
    newAnggota.id
  );
  
  return newAnggota;
}

/**
 * Update an existing anggota
 */
export async function updateAnggota(id: string, anggota: Partial<Anggota>): Promise<Anggota | null> {
  const existing = await db.anggota.get(id);
  
  if (!existing) {
    return null;
  }
  
  const updatedAnggota: Anggota = {
    ...existing,
    ...anggota,
    updatedAt: new Date().toISOString(),
  };
  
  await db.anggota.put(updatedAnggota);
  
  // Sync unit kerja after updating anggota (in case unit kerja changed)
  syncUnitKerjaWithAnggota();
  
  // Log audit entry
  logAuditEntry(
    "UPDATE",
    "ANGGOTA",
    `Memperbarui data anggota: ${existing.nama} (${id})`,
    id
  );
  
  return updatedAnggota;
}

/**
 * Delete an anggota by ID
 */
export async function deleteAnggota(id: string): Promise<boolean> {
  const existing = await db.anggota.get(id);
  
  if (!existing) {
    return false;
  }
  
  await db.anggota.delete(id);
  
  // Log audit entry
  logAuditEntry(
    "DELETE",
    "ANGGOTA",
    `Menghapus data anggota: ${existing.nama} (${id})`,
    id
  );
  
  return true;
}

/**
 * Validate anggota data against current unit kerja and update if needed
 */
export async function validateAnggotaUnitKerja(): Promise<number> {
  const anggotaList = await getAllAnggota();
  const unitKerjaList = getAllUnitKerja().map(uk => uk.nama);
  
  const defaultUnitKerja = unitKerjaList.length > 0 ? unitKerjaList[0] : "";
  
  let updatedCount = 0;
  
  for (const anggota of anggotaList) {
    if (!unitKerjaList.includes(anggota.unitKerja) && defaultUnitKerja) {
      updatedCount++;
      await db.anggota.update(anggota.id, {
        unitKerja: defaultUnitKerja,
        updatedAt: new Date().toISOString()
      });
    }
  }
  
  if (updatedCount > 0) {
    localStorage.setItem('anggota_updated', new Date().toISOString());
  }
  
  return updatedCount;
}
