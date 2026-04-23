import { BACKEND_URL } from "@/config/apiConfig";


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
      const {
        anggota, transaksi, coa, settings, unitKerja, roles,
        mstJenis, users, permissions,
        produk, pemasok, penjualan, penjualanItem,
        bom, bomItem, workOrder,
        pembelian, pembelianItem
      } = result.data;

      // ATOMIC UPDATE LOCAL MIRROR
      await db.transaction('rw', [
        db.anggota, db.transaksi, db.coa, db.settings, db.unit_kerja,
        db.roles, db.table('mst_jenis'), db.table('users'), db.table('permissions'),
        db.table('mst_produk'), db.table('mst_pemasok'), db.table('pos_penjualan'),
        db.table('pos_penjualan_item'), db.table('mfg_bom'), db.table('mfg_bom_item'),
        db.table('mfg_work_order'), db.table('pos_pembelian'), db.table('pos_pembelian_item')
      ], async () => {

        // ... (existing mapping 1-6 internal logic)

        // 7. Sync Master Jenis
        if (mstJenis && mstJenis.length > 0) {
          const mappedJenis = mstJenis.map((j: any) => ({
            id: j.id,
            kode: j.kode,
            nama: j.nama,
            jenisTransaksi: j.jenis_transaksi,
            keterangan: j.keterangan,
            persyaratan: j.persyaratan,
            bungaPersen: Number(j.bunga_persen || 0),
            wajib: j.wajib,
            untukPeminjam: j.untuk_peminjam,
            tenorMin: j.tenor_min,
            tenorMax: j.tenor_max,
            maksimalPinjaman: Number(j.maksimal_pinjaman || 0),
            isActive: j.is_active,
            createdAt: j.created_at,
            updatedAt: j.updated_at
          }));
          await db.table('mst_jenis').clear();
          await db.table('mst_jenis').bulkAdd(mappedJenis);
        }

        // 8. Sync Users
        if (users && users.length > 0) {
          const mappedUsers = users.map((u: any) => ({
            id: u.id,
            username: u.username,
            nama: u.nama,
            email: u.email,
            roleId: u.role_id,
            anggotaId: u.anggota_id,
            aktif: u.aktif,
            lastLogin: u.last_login,
            createdAt: u.created_at,
            updatedAt: u.updated_at
          }));
          await db.table('users').clear();
          await db.table('users').bulkAdd(mappedUsers);
        }

        // 9. Sync Permissions
        if (permissions && permissions.length > 0) {
          await db.table('permissions').clear();
          await db.table('permissions').bulkAdd(permissions);
        }

        // 10. Sync Produk
        if (produk && produk.length > 0) {
          const mappedProduk = produk.map((p: any) => ({
            id: p.id,
            kode: p.kode,
            nama: p.nama,
            kategori: p.kategori,
            hargaBeli: Number(p.harga_beli || 0),
            hargaJual: Number(p.harga_jual || 0),
            stok: Number(p.stok || 0),
            satuan: p.satuan,
            deskripsi: p.deskripsi,
            gambar: p.gambar,
            isActive: p.is_active,
            createdAt: p.created_at,
            updatedAt: p.updated_at
          }));
          await db.table('mst_produk').clear();
          await db.table('mst_produk').bulkAdd(mappedProduk);
        }

        // 11. Sync Pemasok
        if (pemasok && pemasok.length > 0) {
          await db.table('mst_pemasok').clear();
          await db.table('mst_pemasok').bulkAdd(pemasok.map((s: any) => ({
            id: s.id,
            nama: s.nama,
            alamat: s.alamat,
            telepon: s.telepon,
            email: s.email,
            kontak: s.kontak,
            createdAt: s.created_at
          })));
        }

        // 12. Sync Penjualan
        if (penjualan && penjualan.length > 0) {
          await db.table('pos_penjualan').clear();
          await db.table('pos_penjualan').bulkAdd(penjualan.map((v: any) => ({
            id: v.id,
            nomorTransaksi: v.nomor_transaksi,
            tanggal: v.tanggal,
            kasirId: v.kasir_id,
            subtotal: Number(v.subtotal || 0),
            diskon: Number(v.diskon || 0),
            pajak: Number(v.pajak || 0),
            total: Number(v.total || 0),
            dibayar: Number(v.dibayar || 0),
            kembalian: Number(v.kembalian || 0),
            metodePembayaran: v.metode_pembayaran,
            status: v.status,
            catatan: v.catatan,
            createdAt: v.created_at
          })));
        }

        if (penjualanItem && penjualanItem.length > 0) {
          await db.table('pos_penjualan_item').clear();
          await db.table('pos_penjualan_item').bulkAdd(penjualanItem.map((vi: any) => ({
            id: vi.id,
            penjualanId: vi.penjualan_id,
            produkId: vi.produk_id,
            jumlah: Number(vi.jumlah || 0),
            hargaSatuan: Number(vi.harga_satuan || 0),
            total: Number(vi.total || 0),
            diskon: Number(vi.diskon || 0)
          })));
        }

        // 13. Sync BOM
        if (bom && bom.length > 0) {
          await db.table('mfg_bom').clear();
          await db.table('mfg_bom').bulkAdd(bom.map((b: any) => ({
            id: b.id,
            code: b.code,
            productName: b.product_name,
            productCode: b.product_code,
            description: b.description,
            category: b.category,
            totalMaterialCost: Number(b.total_material_cost || 0),
            overheadCost: Number(b.overhead_cost || 0),
            laborCost: Number(b.labor_cost || 0),
            totalCost: Number(b.total_cost || 0),
            outputQuantity: Number(b.output_quantity || 1),
            outputUnit: b.output_unit,
            status: b.status,
            createdAt: b.created_at,
            updatedAt: b.updated_at
          })));
        }

        if (bomItem && bomItem.length > 0) {
          await db.table('mfg_bom_item').clear();
          await db.table('mfg_bom_item').bulkAdd(bomItem.map((bi: any) => ({
            id: bi.id,
            bomId: bi.bom_id,
            materialName: bi.material_name,
            materialCode: bi.material_code,
            quantity: Number(bi.quantity || 0),
            unit: bi.unit,
            unitCost: Number(bi.unit_cost || 0),
            totalCost: Number(bi.total_cost || 0)
          })));
        }

        // 14. Sync Work Order
        if (workOrder && workOrder.length > 0) {
          await db.table('mfg_work_order').clear();
          await db.table('mfg_work_order').bulkAdd(workOrder.map((wo: any) => ({
            id: wo.id,
            code: wo.code,
            bomId: wo.bom_id,
            quantity: Number(wo.quantity || 0),
            status: wo.status,
            priority: wo.priority,
            startDate: wo.start_date,
            dueDate: wo.due_date,
            estimatedCost: Number(wo.estimated_cost || 0),
            actualCost: Number(wo.actual_cost || 0),
            createdAt: wo.created_at,
            updatedAt: wo.updated_at
          })));
        }

        // 15. Sync Pembelian
        if (pembelian && pembelian.length > 0) {
          await db.table('pos_pembelian').clear();
          await db.table('pos_pembelian').bulkAdd(pembelian.map((p: any) => ({
            id: p.id,
            nomorTransaksi: p.nomor_transaksi,
            tanggal: p.tanggal,
            pemasokId: p.pemasok_id,
            subtotal: Number(p.subtotal || 0),
            diskon: Number(p.diskon || 0),
            ppn: Number(p.ppn || 0),
            total: Number(p.total || 0),
            status: p.status,
            catatan: p.catatan,
            createdAt: p.created_at,
            updatedAt: p.updated_at
          })));
        }

        if (pembelianItem && pembelianItem.length > 0) {
          await db.table('pos_pembelian_item').clear();
          await db.table('pos_pembelian_item').bulkAdd(pembelianItem.map((pi: any) => ({
            id: pi.id,
            pembelianId: pi.pembelian_id,
            produkId: pi.produk_id,
            jumlah: Number(pi.jumlah || 0),
            hargaSatuan: Number(pi.harga_satuan || 0),
            total: Number(pi.total || 0)
          })));
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
