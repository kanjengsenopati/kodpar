import { Transaksi, SubmissionResult } from "@/types";
import { db } from "@/db/db";
import { initialTransaksi } from "./initialData";
import * as IdUtils from "../../utils/idUtils";
import { getJenisByType } from "../jenisService";
import { getCurrentUser } from "../auth/sessionManagement";

/**
 * Get all transaksi from IndexedDB (Mirror of NeonDB)
 */
export async function getAllTransaksi(): Promise<Transaksi[]> {
  try {
    const user = getCurrentUser();
    const isAnggota = user?.roleId === "role_anggota" || user?.roleId === "anggota";
    
    if (isAnggota && user?.anggotaId) {
      return await db.transaksi.where('anggotaId').equals(user.anggotaId).toArray();
    }
    
    return await db.transaksi.toArray();

  } catch (error) {
    console.warn("⚠️ Database access error in getAllTransaksi (likely migration in progress):", error);
    return [];
  }
}

/**
 * Get transaksi by anggota ID
 */
export async function getTransaksiByAnggotaId(anggotaId: string): Promise<Transaksi[]> {
  return await db.transaksi.where('anggotaId').equals(anggotaId).toArray();
}

/**
 * Get transaksi by ID
 */
export async function getTransaksiById(id: string): Promise<Transaksi | undefined> {
  const user = getCurrentUser();
  const isAnggota = user?.roleId === "role_anggota" || user?.roleId === "anggota";
  
  const transaction = await db.transaksi.get(id);
  if (isAnggota && user?.anggotaId && transaction?.anggotaId !== user.anggotaId) {
    console.warn(`An anggota (${user.anggotaId}) tried to access another user's transaction (${id})`);
    return undefined;
  }
  
  return transaction;
}

/**
 * Get transaksi by type and category
 */
export async function getTransaksiByTypeAndCategory(
  jenis: "Simpan" | "Pinjam" | "Angsuran", 
  kategori?: string
): Promise<Transaksi[]> {
  if (kategori) {
    return await db.transaksi
      .where('jenis').equals(jenis)
      .and(t => t.kategori === kategori)
      .toArray();
  } else {
    return await db.transaksi
      .where('jenis').equals(jenis)
      .toArray();
  }
}

/**
 * Get all active kategori names by jenis
 */
export function getAvailableKategori(jenis: "Simpan" | "Pinjam"): string[] {
  const jenisTransaksi = jenis === "Simpan" ? "Simpanan" : "Pinjaman";
  const jenisList = getJenisByType(jenisTransaksi);
  return jenisList
    .filter(j => j.isActive)
    .map(j => j.nama);
}

/**
 * Validate if a kategori is valid for a specific jenis
 */
export function isValidKategori(jenis: "Simpan" | "Pinjam" | "Angsuran", kategori: string): boolean {
  // Angsuran uses same categories as Pinjam
  const effectiveJenis = jenis === "Angsuran" ? "Pinjam" : jenis;
  const availableKategori = getAvailableKategori(effectiveJenis);
  
  // 1. Exact match check
  if (availableKategori.includes(kategori)) return true;
  
  // 2. Backward compatibility: check with "Pinjaman " prefix if the type is "Pinjam"
  if (effectiveJenis === "Pinjam") {
    // If input is "Reguler", check for "Pinjaman Reguler"
    if (availableKategori.includes(`Pinjaman ${kategori}`)) return true;
    
    // If input is "Pinjaman Reguler", check for "Reguler"
    const cleaned = kategori.replace(/^Pinjaman\s+/, "");
    if (availableKategori.includes(cleaned)) return true;
  }
  
  // 3. Same for Simpan if needed (future proofing)
  if (effectiveJenis === "Simpan") {
    if (availableKategori.includes(`Simpanan ${kategori}`)) return true;
    const cleaned = kategori.replace(/^Simpanan\s+/, "");
    if (availableKategori.includes(cleaned)) return true;
  }
  
  return false;
}

/**
 * Generate a new human-readable transaksi reference number
 */
export async function generateTransaksiNumber(): Promise<string> {
  const allTransaksi = await db.transaksi.toArray();
  const today = new Date();
  
  const existingNumbers = allTransaksi
    .map(t => IdUtils.extractNumericSuffix(t.nomorTransaksi || t.id))
    .filter(n => !isNaN(n));
    
  const lastSeq = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
  
  return IdUtils.formatReferenceNumber({
    prefix: "TR",
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    sequence: lastSeq + 1,
    padding: 6
  });
}

import { generateUUIDv7 } from "../../utils/id-generator";
// ... (existing imports)

/**
 * Create a new transaksi with automatic accounting sync
 */
export async function createTransaksi(data: Partial<Transaksi>): Promise<SubmissionResult<Transaksi>> {
  try {
    // 1. GENERATE ID BEFORE ANY DB OPERATION (SaaS Sync Readiness)
    const newId = generateUUIDv7();
    
    // 2. GENERATE TRANSACTION NUMBER
    const nomorTransaksi = await generateTransaksiNumber();
    const now = new Date().toISOString();
    
    // VALIDATION
    if (!data.anggotaId) {
      return { success: false, error: "ID Anggota wajib diisi" };
    }
    
    const newTransaksi: Transaksi = {
      id: newId,
      nomorTransaksi,
      tanggal: data.tanggal || new Date().toISOString().split('T')[0],
      anggotaId: data.anggotaId || "",
      jenis: data.jenis || "Simpan",
      kategori: data.kategori || undefined,
      jumlah: data.jumlah || 0,
      keterangan: data.keterangan || "",
      status: data.status || "Sukses",
      referensiPinjamanId: data.referensiPinjamanId,
      nominalPokok: data.nominalPokok,
      nominalJasa: data.nominalJasa,
      tenor: data.tenor,
      createdAt: now,
      updatedAt: now,
    };

    
    // 3. ADD TO INDEXEDDB
    await db.transaksi.add(newTransaksi);
    
    return { success: true, data: newTransaksi };
  } catch (error: any) {
    if (error.name === 'ConstraintError') {
      console.warn(`🔄 ID collision detector: Retrying...`);
      return await createTransaksi(data);
    }
    console.error("Error in core createTransaksi:", error);
    return { success: false, error: `Critical Error: ${error.message || 'Kesalahan sistem'}` };
  }
}

