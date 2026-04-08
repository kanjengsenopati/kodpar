
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
    // v2: formally add the pengajuan table so it participates in transactions
    this.version(2).stores({
      anggota: '++id, nama, nip, noHp, status, unitKerja',
      transaksi: '++id, anggotaId, jenis, tanggal, status, kategori',
      coa: '++id, kode, nama, jenis, kategori',
      jurnal: '++id, nomorJurnal, tanggal, status, referensi',
      pengajuan: '++id, anggotaId, jenis, status, tanggal'
    });
  }
}

export const db = new KoperasiDB();
