import { db } from "@/db/db";

const BACKEND_URL = "http://localhost:3001";

/**
 * NeonMasterSyncService - RESPONSIBLE FOR SSOT
 * Ensures that IndexedDB is a mirror of NeonDB truth.
 */
export class NeonMasterSyncService {
  private static instance: NeonMasterSyncService;
  private isHydrating = false;

  static getInstance(): NeonMasterSyncService {
    if (!NeonMasterSyncService.instance) {
      NeonMasterSyncService.instance = new NeonMasterSyncService();
    }
    return NeonMasterSyncService.instance;
  }

  /**
   * Rehydrates IndexedDB from NeonDB
   * This is the "Pull" direction of the SSOT implementation.
   */
  async rehydrateFromCloud(): Promise<{ success: boolean; message: string }> {
    if (this.isHydrating) return { success: false, message: "Hydration already in progress" };
    this.isHydrating = true;

    try {
      console.log('☁️ [NEON-SSOT] Starting Master Data Rehydration...');
      
      const response = await fetch(`${BACKEND_URL}/sync/pull`);
      if (!response.ok) throw new Error(`Server returned ${response.status}`);
      
      const result = await response.json();
      const { anggota, transaksi, coa } = result.data;

      // ATOMIC UPDATE LOCAL MIRROR
      await db.transaction('rw', [db.anggota, db.transaksi, db.coa], async () => {
        // 1. Sync Anggota
        if (anggota && anggota.length > 0) {
          const mappedAnggota = anggota.map((a: any) => ({
            id: a.id,
            noAnggota: a.no_anggota,
            nama: a.nama,
            nip: a.nip,
            alamat: a.alamat,
            noHp: a.no_hp,
            jenisKelamin: a.jenis_kelamin,
            status: a.status,
            unitKerja: a.unit_kerja,
            tanggalBergabung: a.tanggal_bergabung,
            createdAt: a.created_at,
            updatedAt: a.updated_at
          }));
          await db.anggota.clear();
          await db.anggota.bulkAdd(mappedAnggota);
        }

        // 2. Sync Transaksi
        if (transaksi && transaksi.length > 0) {
          const mappedTransaksi = transaksi.map((t: any) => ({
            id: t.id,
            nomorTransaksi: t.nomor_transaksi,
            tanggal: t.tanggal,
            jenis: t.jenis,
            kategori: t.kategori,
            jumlah: Number(t.jumlah),
            anggotaId: t.anggota_id,
            keterangan: t.keterangan,
            nominalPokok: Number(t.nominal_pokok || 0),
            nominalJasa: Number(t.nominal_jasa || 0),
            status: t.status,
            createdAt: t.created_at,
            updatedAt: t.updated_at,
            accountingSyncStatus: 'SUCCESS' // Rehydrated from cloud means it's already on cloud
          }));
          await db.transaksi.clear();
          await db.transaksi.bulkAdd(mappedTransaksi);
        }

        // 3. Sync COA
        if (coa && coa.length > 0) {
          const mappedCOA = coa.map((c: any) => ({
            id: c.id,
            kode: c.kode,
            nama: c.nama,
            jenis: c.jenis,
            kategori: c.kategori,
            saldoNormal: c.saldo_normal,
            createdAt: c.created_at,
            updatedAt: c.updated_at
          }));
          await db.coa.clear();
          await db.coa.bulkAdd(mappedCOA);
        }
      });

      console.log('✅ [NEON-SSOT] Rehydration SUCCESS. Local cache is now synced with NeonDB.');
      return { success: true, message: "Data synced from cloud successfully" };
    } catch (error: any) {
      console.error('❌ [NEON-SSOT] Rehydration FAILED:', error);
      return { success: false, message: `Cloud Sync Failed: ${error.message}` };
    } finally {
      this.isHydrating = false;
    }
  }
}

export const neonMasterSync = NeonMasterSyncService.getInstance();
