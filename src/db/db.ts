
import Dexie, { type Table } from 'dexie';
import { Anggota } from '@/types/anggota';
import { Transaksi } from '@/types/transaksi';
import { ChartOfAccount, JurnalEntry } from '@/types/akuntansi';
import { JadwalAngsuran } from '@/types/transaksi';

export class KoperasiDB extends Dexie {
  anggota!: Table<Anggota>;
  transaksi!: Table<Transaksi>;
  coa!: Table<ChartOfAccount>;
  jurnal!: Table<JurnalEntry>;
  pengajuan!: Table;
  jadwal_angsuran!: Table<JadwalAngsuran>;
  audit_log!: Table<any>;
  unit_kerja!: Table<any>;
  sync_queue!: Table<any>;

  constructor() {
    super('KoperasiDB');
    // ... legacy versions 1-4
    this.version(1).stores({
      anggota: '++id, nama, nip, noHp, status, unitKerja',
      transaksi: '++id, anggotaId, jenis, tanggal, status, kategori',
      coa: '++id, kode, nama, jenis, kategori',
      jurnal: '++id, nomorJurnal, tanggal, status, referensi'
    });
    this.version(3).stores({
      anggota: '++id, nama, nip, noHp, status, unitKerja',
      transaksi: '++id, anggotaId, jenis, tanggal, status, kategori, referensiPinjamanId, tenor',
      coa: '++id, kode, nama, jenis, kategori',
      jurnal: '++id, nomorJurnal, tanggal, status, referensi',
      pengajuan: '++id, anggotaId, jenis, status, tanggal, loanId'
    });
    this.version(4).stores({
      anggota: '++id, nama, nip, noHp, status, unitKerja',
      transaksi: '++id, anggotaId, jenis, tanggal, status, kategori, referensiPinjamanId, tenor',
      coa: '++id, kode, nama, jenis, kategori',
      jurnal: '++id, nomorJurnal, tanggal, status, referensi',
      pengajuan: '++id, anggotaId, jenis, status, tanggal, loanId',
      jadwal_angsuran: '++id, loanId, anggotaId, status, tanggalJatuhTempo'
    });

    // v6: Final Stabilized Schema
    this.version(6).stores({
      anggota: 'id, noAnggota, nama, nip, noHp, status, unitKerja',
      transaksi: 'id, nomorTransaksi, anggotaId, jenis, tanggal, status, kategori, referensiPinjamanId',
      coa: 'id, kode, nama, jenis, kategori',
      jurnal: 'id, nomorJurnal, tanggal, status, referensi',
      pengajuan: 'id, nomorPengajuan, anggotaId, jenis, status, tanggal, loanId',
      jadwal_angsuran: 'id, loanId, anggotaId, status, tanggalJatuhTempo',
      audit_log: 'id, timestamp, action, resource, userId',
      unit_kerja: 'id, kode, nama'
    });

    // v7: Persistent Sync Queue for SaaS & Multi-client stability
      sync_queue: 'id, entityId, type, status, updatedAt'
    });

    // v8: SSOT Configuration Master
    this.version(8).stores({
      anggota: 'id, noAnggota, nama, nip, noHp, status, unitKerja',
      transaksi: 'id, nomorTransaksi, anggotaId, jenis, tanggal, status, kategori, referensiPinjamanId',
      coa: 'id, kode, nama, jenis, kategori',
      jurnal: 'id, nomorJurnal, tanggal, status, referensi',
      pengajuan: 'id, nomorPengajuan, anggotaId, jenis, status, tanggal, loanId',
      sync_queue: 'id, entityId, type, status, updatedAt'
    });

    // v9: Master Products (Savings/Loans) SSOT
    this.version(9).stores({
      anggota: 'id, noAnggota, nama, nip, noHp, status, unitKerja',
      transaksi: 'id, nomorTransaksi, anggotaId, jenis, tanggal, status, kategori, referensiPinjamanId',
      coa: 'id, kode, nama, jenis, kategori',
      jurnal: 'id, nomorJurnal, tanggal, status, referensi',
      pengajuan: 'id, nomorPengajuan, anggotaId, jenis, status, tanggal, loanId',
      jadwal_angsuran: 'id, loanId, anggotaId, status, tanggalJatuhTempo',
      audit_log: 'id, timestamp, action, resource, userId',
      unit_kerja: 'id, kode, nama',
      roles: 'id, name',
      permissions: 'id, name',
      settings: 'id',
      mst_jenis: 'id, kode, nama, jenisTransaksi',
      users: 'id, username, email, roleId',
      sync_queue: 'id, entityId, type, status, updatedAt'
    });

    // v10: Full Module SSOT (Retail, POS, Manufaktur)
    this.version(10).stores({
      anggota: 'id, noAnggota, nama, nip, noHp, status, unitKerja',
      transaksi: 'id, nomorTransaksi, anggotaId, jenis, tanggal, status, kategori, referensiPinjamanId',
      coa: 'id, kode, nama, jenis, kategori',
      jurnal: 'id, nomorJurnal, tanggal, status, referensi',
      pengajuan: 'id, nomorPengajuan, anggotaId, jenis, status, tanggal, loanId',
      jadwal_angsuran: 'id, loanId, anggotaId, status, tanggalJatuhTempo',
      audit_log: 'id, timestamp, action, resource, userId',
      unit_kerja: 'id, kode, nama',
      roles: 'id, name',
      permissions: 'id, name',
      settings: 'id',
      mst_jenis: 'id, kode, nama, jenisTransaksi',
      users: 'id, username, email, roleId',
      mst_produk: 'id, kode, nama, kategori',
      mst_pemasok: 'id, nama',
      pos_penjualan: 'id, nomorTransaksi, tanggal, kasirId, status',
      pos_penjualan_item: 'id, penjualanId, produkId',
      mfg_bom: 'id, code, productName, productCode, status',
      mfg_bom_item: 'id, bomId, materialName',
      mfg_work_order: 'id, code, bomId, status',
      sync_queue: 'id, entityId, type, status, updatedAt'
    });
  }





  // Helper to safely reset only if critical migration fails (dev-only stability)
  async safeReset() {
    console.warn("⚠️ Critical Schema Mismatch Detected. Performing atomic reset...");
    await this.delete();
    return this.open();
  }
}

export const db = new KoperasiDB();
