
import Dexie, { type Table } from 'dexie';
import { Anggota } from '@/types/anggota';
import { Transaksi } from '@/types/transaksi';
import { ChartOfAccount, JurnalEntry } from '@/types/akuntansi';

export class KoperasiDB extends Dexie {
  anggota!: Table<Anggota>;
  transaksi!: Table<Transaksi>;
  coa!: Table<ChartOfAccount>;
  jurnal!: Table<JurnalEntry>;
  pengajuan!: Table;

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
  }
}

export const db = new KoperasiDB();
