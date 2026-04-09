
import { JurnalEntry, JurnalDetail } from "@/types/akuntansi";
import { Transaksi } from "@/types";
import { createJurnalEntry } from "../jurnalService";
import { getCoaIdByCode } from "../coaService";
import { AngsuranAllocation } from "../allocationService";
import { formatCurrency } from "./journalUtils";

/**
 * Create journal entry for Angsuran transaction following SAK EP
 * Properly allocating principal and interest with enhanced sync to Keuangan
 */
export async function createAngsuranJournalEntry(
  transaksi: Transaksi, 
  pinjaman: Transaksi,
  allocation: AngsuranAllocation
): Promise<JurnalEntry | null> {
  try {
    const details: JurnalDetail[] = [
      {
        id: "1",
        jurnalId: "",
        coaId: getCoaIdByCode("1000"), // Kas
        debit: transaksi.jumlah,
        kredit: 0,
        keterangan: `Penerimaan angsuran dari ${transaksi.anggotaNama} - SAK EP: Pokok ${formatCurrency(allocation.nominalPokok)}, Jasa ${formatCurrency(allocation.nominalJasa)}`
      }
    ];

    // Principal payment - reduces Piutang Anggota
    if (allocation.nominalPokok > 0) {
      details.push({
        id: "2",
        jurnalId: "",
        coaId: getCoaIdByCode("1100"), // Piutang Anggota
        debit: 0,
        kredit: allocation.nominalPokok,
        keterangan: `Pengurangan piutang anggota - Pembayaran pokok ${formatCurrency(allocation.nominalPokok)} (SAK EP)`
      });
    }

    // Interest income - recognized as revenue (also synced to Keuangan)
    if (allocation.nominalJasa > 0) {
      details.push({
        id: "3",
        jurnalId: "",
        coaId: getCoaIdByCode("4000"), // Pendapatan Jasa Pinjaman
        debit: 0,
        kredit: allocation.nominalJasa,
        keterangan: `Pendapatan jasa pinjaman ${formatCurrency(allocation.nominalJasa)} - Bunga ${allocation.sukuBungaPersen.toFixed(2)}% (SAK EP + Keuangan Sync)`
      });
    }

    const totalDebit = details.reduce((sum, detail) => sum + detail.debit, 0);
    const totalKredit = details.reduce((sum, detail) => sum + detail.kredit, 0);

    const pokokPercentage = transaksi.jumlah > 0 ? ((allocation.nominalPokok / transaksi.jumlah) * 100).toFixed(1) : '0';
    const jasaPercentage = transaksi.jumlah > 0 ? ((allocation.nominalJasa / transaksi.jumlah) * 100).toFixed(1) : '0';

    return await createJurnalEntry({
      nomorJurnal: "",
      tanggal: transaksi.tanggal,
      deskripsi: `SAK EP ANGSURAN + KEUANGAN SYNC - ${transaksi.anggotaNama} | Pokok: ${pokokPercentage}% (${formatCurrency(allocation.nominalPokok)}) | Jasa: ${jasaPercentage}% (${formatCurrency(allocation.nominalJasa)}) | Rate: ${allocation.sukuBungaPersen.toFixed(2)}%`,
      referensi: `TXN-${transaksi.id}`,
      status: "POSTED",
      createdBy: "system_auto_sync",
      totalDebit,
      totalKredit,
      details
    });
  } catch (error) {
    console.error("Error creating SAK EP angsuran journal entry:", error);
    return null;
  }
}
