import { Transaksi } from "@/types";
import { db } from "@/db/db";
import { initialTransaksi } from "./initialData";
import { generateTransaksiId } from "./idGenerator";
import { getAnggotaById } from "@/services/anggotaService";
import { getJenisByType } from "@/services/jenisService";
import { syncTransactionToAccounting } from "@/services/akuntansi/accountingSyncService";

/**
 * Get all transaksi from IndexedDB
 */
export async function getAllTransaksi(): Promise<Transaksi[]> {
  const count = await db.transaksi.count();
  if (count === 0) {
    await db.transaksi.bulkAdd(initialTransaksi);
    return initialTransaksi;
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
  return await db.transaksi.get(id);
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
  return availableKategori.includes(kategori);
}

/**
 * Create a new transaksi with automatic accounting sync
 */
export async function createTransaksi(data: Partial<Transaksi>): Promise<Transaksi | null> {
  try {
    const newId = generateTransaksiId();
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
      createdAt: now,
      updatedAt: now,
    };
    
    await db.transaksi.add(newTransaksi);
    
    // Auto-sync to accounting system if status is Sukses
    if (newTransaksi.status === "Sukses") {
      try {
        const journalEntry = await syncTransactionToAccounting(newTransaksi);
        if (journalEntry) {
          console.log(`✅ Transaction ${newTransaksi.id} (${newTransaksi.jenis}) automatically synced to accounting (Journal: ${journalEntry.nomorJurnal})`);
        }
      } catch (syncError) {
        console.error("❌ Failed to sync transaction to accounting:", syncError);
      }
    }
    
    return newTransaksi;
  } catch (error) {
    console.error("Error creating transaksi:", error);
    return null;
  }
}
