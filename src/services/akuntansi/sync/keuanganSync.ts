
import { Transaksi } from "@/types";
import { createPemasukanPengeluaran } from "../../keuangan/transaksiService";

/**
 * Sync Simpanan to Keuangan as Pemasukan
 */
export function syncSimpananToKeuangan(transaksi: Transaksi): void {
  try {
    const kategoriMap: Record<string, string> = {
      "Simpanan Pokok": "Setoran Modal",
      "Simpanan Wajib": "Setoran Wajib", 
      "Simpanan Sukarela": "Setoran Sukarela"
    };

    const keuanganKategori = kategoriMap[transaksi.kategori || ""] || "Setoran Anggota";

    createPemasukanPengeluaran({
      tanggal: transaksi.tanggal,
      kategori: keuanganKategori,
      jumlah: transaksi.jumlah,
      keterangan: `Sync dari Transaksi ${transaksi.id} - ${transaksi.anggotaNama}: ${transaksi.kategori}`,
      jenis: "Pemasukan",
      createdBy: "system_accounting_sync"
    });

    console.log(`📊 Simpanan ${transaksi.id} synced to Keuangan as ${keuanganKategori}`);
  } catch (error) {
    console.error(`Failed to sync simpanan ${transaksi.id} to Keuangan:`, error);
  }
}

/**
 * Sync Angsuran interest portion to Keuangan as Pemasukan
 */
export function syncAngsuranToKeuangan(transaksi: Transaksi): void {
  try {
    // Extract jasa (interest) amount from keterangan
    const jasaMatch = transaksi.keterangan?.match(/Jasa: Rp ([\d,.]+)/);
    if (!jasaMatch) return;

    const jasaAmount = parseFloat(jasaMatch[1].replace(/[,]/g, ''));
    if (jasaAmount <= 0) return;

    createPemasukanPengeluaran({
      tanggal: transaksi.tanggal,
      kategori: "Pendapatan Jasa",
      jumlah: jasaAmount,
      keterangan: `Sync dari Angsuran ${transaksi.id} - ${transaksi.anggotaNama}: Pendapatan Jasa Pinjaman`,
      jenis: "Pemasukan", 
      createdBy: "system_accounting_sync"
    });

    console.log(`📊 Angsuran ${transaksi.id} interest (${jasaAmount}) synced to Keuangan as Pendapatan Jasa`);
  } catch (error) {
    console.error(`Failed to sync angsuran ${transaksi.id} to Keuangan:`, error);
  }
}

/**
 * Sync Penarikan to Keuangan as Pengeluaran
 */
export function syncPenarikanToKeuangan(transaksi: Transaksi): void {
  try {
    createPemasukanPengeluaran({
      tanggal: transaksi.tanggal,
      kategori: "Pembayaran Penarikan",
      jumlah: Math.abs(transaksi.jumlah),
      keterangan: `Sync dari Transaksi ${transaksi.id} - ${transaksi.anggotaNama}: Penarikan Simpanan`,
      jenis: "Pengeluaran",
      createdBy: "system_accounting_sync"
    });

    console.log(`📊 Penarikan ${transaksi.id} synced to Keuangan as Pembayaran Penarikan`);
  } catch (error) {
    console.error(`Failed to sync penarikan ${transaksi.id} to Keuangan:`, error);
  }
}
