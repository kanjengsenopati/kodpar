
import { JurnalEntry, JurnalDetail } from "@/types/akuntansi";
import { createJurnalEntry } from "../jurnalService";
import { formatCurrency } from "./journalUtils";

/**
 * Create journal entry for Pengeluaran (Expense) transactions to Biaya Operasional
 */
export function createPengeluaranJournalEntry(
  pengeluaran: any,
  referensi: string = ""
): JurnalEntry | null {
  try {
    const details: JurnalDetail[] = [
      {
        id: "1",
        jurnalId: "",
        coaId: "14", // Biaya Operasional
        debit: pengeluaran.jumlah,
        kredit: 0,
        keterangan: `Biaya operasional - ${pengeluaran.kategori}: ${pengeluaran.keterangan} (Auto-sync dari Keuangan)`
      },
      {
        id: "2",
        jurnalId: "",
        coaId: "2", // Kas
        debit: 0,
        kredit: pengeluaran.jumlah,
        keterangan: `Pembayaran ${pengeluaran.kategori} - ${pengeluaran.keterangan}`
      }
    ];

    const totalDebit = details.reduce((sum, detail) => sum + detail.debit, 0);
    const totalKredit = details.reduce((sum, detail) => sum + detail.kredit, 0);

    return createJurnalEntry({
      nomorJurnal: "",
      tanggal: pengeluaran.tanggal,
      deskripsi: `PENGELUARAN TO BIAYA OPERASIONAL - ${pengeluaran.kategori} | ${formatCurrency(pengeluaran.jumlah)}`,
      referensi: referensi || `KEUANGAN-${pengeluaran.id}`,
      status: "POSTED",
      createdBy: "system_auto_sync",
      totalDebit,
      totalKredit,
      details
    });
  } catch (error) {
    console.error("Error creating pengeluaran journal entry:", error);
    return null;
  }
}
