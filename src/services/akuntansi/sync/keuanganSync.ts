import { Transaksi } from "@/types";
import { createPemasukanPengeluaran } from "../../keuangan/transaksiService";

/**
 * Sync Simpanan to Koperasi Revenue/Funds
 * SAK EP Compliant Terminology
 */
export function syncSimpananToKeuangan(transaksi: Transaksi): void {
  try {
    const kategoriMap: Record<string, string> = {
      "Simpanan Pokok": "Setoran Modal / Pokok",
      "Simpanan Wajib": "Simpanan Wajib Anggota", 
      "Simpanan Sukarela": "Simpanan Sukarela Anggota"
    };

    const keuanganKategori = kategoriMap[transaksi.kategori || ""] || "Simpanan Anggota";

    createPemasukanPengeluaran({
      tanggal: transaksi.tanggal,
      kategori: keuanganKategori,
      jumlah: transaksi.jumlah,
      keterangan: `Sync Koperasi [${transaksi.id}] - ${transaksi.anggotaNama}: ${transaksi.kategori}`,
      jenis: "Pemasukan",
      createdBy: "system_accounting_sync"
    });

    console.log(`📑 Koperasi Sync: Simpanan ${transaksi.id} recorded as ${keuanganKategori} (SAK EP)`);
  } catch (error) {
    console.error(`❌ Koperasi Sync Failure: simpanan ${transaksi.id}:`, error);
  }
}

/**
 * Sync Angsuran interest (Jasa) portion to Koperasi Revenue
 * PURE DATABASE DRIVEN
 */
export function syncAngsuranToKeuangan(transaksi: Transaksi): void {
  try {
    // 1. PURE DB: Access nominalJasa from structured field
    const jasaAmount = transaksi.nominalJasa || 0;
    
    if (jasaAmount <= 0) return;

    createPemasukanPengeluaran({
      tanggal: transaksi.tanggal,
      kategori: "Pendapatan Jasa Pinjaman",
      jumlah: jasaAmount,
      keterangan: `Sync Koperasi [${transaksi.id}] - ${transaksi.anggotaNama}: Jasa Pinjaman (SAK EP)`,
      jenis: "Pemasukan", 
      createdBy: "system_accounting_sync"
    });

    console.log(`📑 Koperasi Sync: Jasa Pinjaman ${transaksi.id} (${jasaAmount}) recorded (SAK EP)`);
  } catch (error) {
    console.error(`❌ Koperasi Sync Failure: angsuran ${transaksi.id}:`, error);
  }
}

/**
 * Sync Penarikan (Withdrawal) to Koperasi Funds
 */
export function syncPenarikanToKeuangan(transaksi: Transaksi): void {
  try {
    createPemasukanPengeluaran({
      tanggal: transaksi.tanggal,
      kategori: "Penarikan Dana Anggota",
      jumlah: Math.abs(transaksi.jumlah),
      keterangan: `Sync Koperasi [${transaksi.id}] - ${transaksi.anggotaNama}: Penarikan Simpanan`,
      jenis: "Pengeluaran",
      createdBy: "system_accounting_sync"
    });

    console.log(`📑 Koperasi Sync: Penarikan ${transaksi.id} recorded (SAK EP)`);
  } catch (error) {
    console.error(`❌ Koperasi Sync Failure: penarikan ${transaksi.id}:`, error);
  }
}
