import { Transaksi } from "@/types";
import { db } from "@/db/db";
import { initialTransaksi } from "./initialData";
import { generateTransaksiId } from "./idGenerator";
import { getAnggotaById } from "@/services/anggotaService";
import { getJenisByType } from "@/services/jenisService";
import { getCurrentUser } from "@/services/auth/sessionManagement";

/**
 * Get all transaksi from IndexedDB
 */
export async function getAllTransaksi(): Promise<Transaksi[]> {
  const user = getCurrentUser();
  const isAnggota = user?.roleId === "role_anggota" || user?.roleId === "anggota";
  
  const count = await db.transaksi.count();
  if (count === 0) {
    await db.transaksi.bulkAdd(initialTransaksi);
    return isAnggota && user?.anggotaId
      ? initialTransaksi.filter(t => t.anggotaId === user.anggotaId)
      : initialTransaksi;
  }
  
  if (isAnggota && user?.anggotaId) {
    return await db.transaksi.where('anggotaId').equals(user.anggotaId).toArray();
  }
  
  return await db.transaksi.toArray();
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
export function isValidKategori(jenis: "Simpan" | "Pinjam", kategori: string): boolean {
  const availableKategori = getAvailableKategori(jenis);
  
  // 1. Exact match check
  if (availableKategori.includes(kategori)) return true;
  
  // 2. Backward compatibility: check with "Pinjaman " prefix if the type is "Pinjam"
  if (jenis === "Pinjam") {
    // If input is "Reguler", check for "Pinjaman Reguler"
    if (availableKategori.includes(`Pinjaman ${kategori}`)) return true;
    
    // If input is "Pinjaman Reguler", check for "Reguler"
    const cleaned = kategori.replace(/^Pinjaman\s+/, "");
    if (availableKategori.includes(cleaned)) return true;
  }
  
  // 3. Same for Simpan if needed (future proofing)
  if (jenis === "Simpan") {
    if (availableKategori.includes(`Simpanan ${kategori}`)) return true;
    const cleaned = kategori.replace(/^Simpanan\s+/, "");
    if (availableKategori.includes(cleaned)) return true;
  }
  
  return false;
}

/**
 * Create a new transaksi with automatic accounting sync
 */
export async function createTransaksi(data: Partial<Transaksi>): Promise<Transaksi | null> {
  try {
    const newId = await generateTransaksiId();
    const now = new Date().toISOString();
    
    // If anggotaId is provided but anggotaNama is not, try to get anggota name
    let anggotaNama = data.anggotaNama || "";
    if (data.anggotaId && !data.anggotaNama) {
      const anggota = await getAnggotaById(data.anggotaId);
      if (anggota) {
        anggotaNama = anggota.nama;
      }
    }
    
    // Validate kategori if provided
    if (data.jenis && data.kategori) {
      // Check if kategori is valid for the given jenis
      if (!isValidKategori(data.jenis as "Simpan" | "Pinjam", data.kategori)) {
        console.warn(`Kategori '${data.kategori}' is not valid for jenis ${data.jenis}`);
      }
    }
    
    const newTransaksi: Transaksi = {
      id: newId,
      tanggal: data.tanggal || new Date().toISOString().split('T')[0],
      anggotaId: data.anggotaId || "",
      anggotaNama: anggotaNama,
      jenis: data.jenis || "Simpan",
      kategori: data.kategori || undefined,
      jumlah: data.jumlah || 0,
      keterangan: data.keterangan || "",
      status: data.status || "Sukses",
      accountingSyncStatus: data.status === "Sukses" ? "PENDING" : undefined,
      createdAt: now,
      updatedAt: now,
    };
    
    // Add to database
    try {
      await db.transaksi.add(newTransaksi);
    } catch (dbError) {
      if (dbError instanceof Error && dbError.name === 'ConstraintError') {
        console.warn(`🔄 Primary key collision for transaction ${newId}, retrying with a new ID...`);
        const retryData = { ...data };
        return await createTransaksi(retryData);
      }
      throw dbError; // Re-throw if it's not a collision
    }
    
    return newTransaksi;
  } catch (error) {
    console.error("Error in core createTransaksi:", error);
    return null;
  }
}
