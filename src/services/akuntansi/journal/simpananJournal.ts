
import { JurnalEntry, JurnalDetail } from "@/types/akuntansi";
import { Transaksi } from "@/types";
import { createJurnalEntry } from "../jurnalService";
import { formatCurrency } from "./journalUtils";

/**
 * Create journal entry for Simpanan transaction following SAK ETAP
 */
export async function createSimpananJournalEntry(transaksi: Transaksi): Promise<JurnalEntry | null> {
  try {
    let details: JurnalDetail[] = [];
    
    // Determine simpanan type based on kategori
    const kategori = transaksi.kategori?.toLowerCase() || "";
    
    if (kategori.includes("pokok")) {
      // Simpanan Pokok - Recorded as Equity per SAK ETAP
      details = [
        {
          id: "1",
          jurnalId: "",
          coaId: "2", // Kas
          debit: transaksi.jumlah,
          kredit: 0,
          keterangan: `Penerimaan simpanan pokok dari ${transaksi.anggotaNama}`
        },
        {
          id: "2", 
          jurnalId: "",
          coaId: "8", // Simpanan Pokok (Ekuitas)
          debit: 0,
          kredit: transaksi.jumlah,
          keterangan: `Simpanan pokok anggota - ${transaksi.anggotaNama} (SAK ETAP)`
        }
      ];
    } else if (kategori.includes("wajib")) {
      // Simpanan Wajib - Recorded as Equity per SAK ETAP
      details = [
        {
          id: "1",
          jurnalId: "",
          coaId: "2", // Kas
          debit: transaksi.jumlah,
          kredit: 0,
          keterangan: `Penerimaan simpanan wajib dari ${transaksi.anggotaNama}`
        },
        {
          id: "2", 
          jurnalId: "",
          coaId: "9", // Simpanan Wajib (Ekuitas)
          debit: 0,
          kredit: transaksi.jumlah,
          keterangan: `Simpanan wajib anggota - ${transaksi.anggotaNama} (SAK ETAP)`
        }
      ];
    } else {
      // Simpanan Sukarela - Recorded as Liability per SAK ETAP
      details = [
        {
          id: "1",
          jurnalId: "",
          coaId: "2", // Kas
          debit: transaksi.jumlah,
          kredit: 0,
          keterangan: `Penerimaan simpanan sukarela dari ${transaksi.anggotaNama}`
        },
        {
          id: "2", 
          jurnalId: "",
          coaId: "6", // Utang Simpanan Sukarela
          debit: 0,
          kredit: transaksi.jumlah,
          keterangan: `Simpanan sukarela anggota - ${transaksi.anggotaNama} (SAK ETAP)`
        }
      ];
    }

    const totalDebit = details.reduce((sum, detail) => sum + detail.debit, 0);
    const totalKredit = details.reduce((sum, detail) => sum + detail.kredit, 0);

    return await createJurnalEntry({
      nomorJurnal: "",
      tanggal: transaksi.tanggal,
      deskripsi: `SAK ETAP SIMPANAN - ${transaksi.anggotaNama} | ${transaksi.kategori || 'Umum'}: ${formatCurrency(transaksi.jumlah)}`,
      referensi: `TXN-${transaksi.id}`,
      status: "POSTED",
      createdBy: "system_auto_sync",
      totalDebit,
      totalKredit,
      details
    });
  } catch (error) {
    console.error("Error creating SAK ETAP simpanan journal entry:", error);
    return null;
  }
}
