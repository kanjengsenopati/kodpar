
import { JurnalEntry, JurnalDetail } from "@/types/akuntansi";
import { Transaksi } from "@/types";
import { createJurnalEntry } from "../jurnalService";
import { formatCurrency } from "./journalUtils";

/**
 * Create journal entry for Penarikan transaction following SAK ETAP
 */
export function createPenarikanJournalEntry(transaksi: Transaksi): JurnalEntry | null {
  try {
    // For withdrawal, we need to determine if it's from savings equity or liability
    // Default to liability (simpanan sukarela) unless specified
    const details: JurnalDetail[] = [
      {
        id: "1",
        jurnalId: "",
        coaId: "6", // Utang Simpanan Sukarela (assuming sukarela withdrawal)
        debit: Math.abs(transaksi.jumlah),
        kredit: 0,
        keterangan: `Penarikan simpanan oleh ${transaksi.anggotaNama} (SAK ETAP)`
      },
      {
        id: "2",
        jurnalId: "",
        coaId: "2", // Kas
        debit: 0,
        kredit: Math.abs(transaksi.jumlah),
        keterangan: `Pembayaran penarikan kepada ${transaksi.anggotaNama}`
      }
    ];

    const totalDebit = details.reduce((sum, detail) => sum + detail.debit, 0);
    const totalKredit = details.reduce((sum, detail) => sum + detail.kredit, 0);

    return createJurnalEntry({
      nomorJurnal: "",
      tanggal: transaksi.tanggal,
      deskripsi: `SAK ETAP PENARIKAN - ${transaksi.anggotaNama} | ${formatCurrency(Math.abs(transaksi.jumlah))}`,
      referensi: `TXN-${transaksi.id}`,
      status: "POSTED",
      createdBy: "system_auto_sync",
      totalDebit,
      totalKredit,
      details
    });
  } catch (error) {
    console.error("Error creating SAK ETAP penarikan journal entry:", error);
    return null;
  }
}
