
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

  constructor() {
    super('KoperasiDB');
    // v1: original schema
    this.version(1).stores({
      anggota: '++id, nama, nip, noHp, status, unitKerja',
      transaksi: '++id, anggotaId, jenis, tanggal, status, kategori',
      coa: '++id, kode, nama, jenis, kategori',
      jurnal: '++id, nomorJurnal, tanggal, status, referensi'
    });
    // v3: Pure DB Driven Schema with structured financial fields
    this.version(3).stores({
      anggota: '++id, nama, nip, noHp, status, unitKerja',
      transaksi: '++id, anggotaId, jenis, tanggal, status, kategori, referensiPinjamanId, tenor',
      coa: '++id, kode, nama, jenis, kategori',
      jurnal: '++id, nomorJurnal, tanggal, status, referensi',
      pengajuan: '++id, anggotaId, jenis, status, tanggal, loanId'
    });
    // v4: Persistent Installment Schedule
    this.version(4).stores({
      anggota: '++id, nama, nip, noHp, status, unitKerja',
      transaksi: '++id, anggotaId, jenis, tanggal, status, kategori, referensiPinjamanId, tenor',
      coa: '++id, kode, nama, jenis, kategori',
      jurnal: '++id, nomorJurnal, tanggal, status, referensi',
      pengajuan: '++id, anggotaId, jenis, status, tanggal, loanId',
      jadwal_angsuran: '++id, loanId, anggotaId, status, tanggalJatuhTempo'
    });

    // v5: Modern Dual-ID Architecture (UUID v7 PKs + Reference Number Indexes)
    this.version(5).stores({
      anggota: 'id, noAnggota, nama, nip, noHp, status, unitKerja',
      transaksi: 'id, nomorTransaksi, anggotaId, jenis, tanggal, status, kategori, referensiPinjamanId',
      coa: 'id, kode, nama, jenis, kategori',
      jurnal: 'id, nomorJurnal, tanggal, status, referensi',
      pengajuan: 'id, nomorPengajuan, anggotaId, jenis, status, tanggal, loanId',
      jadwal_angsuran: 'id, loanId, anggotaId, status, tanggalJatuhTempo',
      audit_log: 'id, timestamp, action, resource, userId'
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
