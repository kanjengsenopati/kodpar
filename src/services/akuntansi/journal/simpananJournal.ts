
import { JurnalEntry, JurnalDetail } from "@/types/akuntansi";
import { Transaksi } from "@/types";
import { createJurnalEntry } from "../jurnalService";
import { formatCurrency } from "./journalUtils";

/**
 * Create journal entry for Simpanan transaction following SAK EP (Entitas Privat)
 */
export async function createSimpananJournalEntry(transaksi: Transaksi): Promise<JurnalEntry | null> {
  try {
    let details: JurnalDetail[] = [];
    
    // Determine simpanan type based on kategori
    const kategori = transaksi.kategori?.toLowerCase() || "";
    
    if (kategori.includes("pokok")) {
      // Simpanan Pokok - Recorded as Equity per SAK EP
      details = [
        {
          id: "1",
          jurnalId: "",
          coaId: "2", // Kas
          debit: transaksi.jumlah || 0,
          kredit: 0,
          keterangan: `Penerimaan simpanan pokok dari ${transaksi.anggotaNama}`
        },
        {
          id: "2", 
          jurnalId: "",
          coaId: "8", // Simpanan Pokok (Ekuitas)
          debit: 0,
          kredit: transaksi.jumlah || 0,
          keterangan: `Simpanan pokok anggota - ${transaksi.anggotaNama} (SAK EP)`
        }
      ];
    } else if (kategori.includes("wajib")) {
      // Simpanan Wajib - Recorded as Equity per SAK EP
      details = [
        {
          id: "1",
          jurnalId: "",
          coaId: "2", // Kas
          debit: transaksi.jumlah || 0,
          kredit: 0,
          keterangan: `Penerimaan simpanan wajib dari ${transaksi.anggotaNama}`
        },
        {
          id: "2", 
          jurnalId: "",
          coaId: "9", // Simpanan Wajib (Ekuitas)
          debit: 0,
          kredit: transaksi.jumlah || 0,
          keterangan: `Simpanan wajib anggota - ${transaksi.anggotaNama} (SAK EP)`
        }
      ];
    } else {
      // Simpanan Sukarela - Recorded as Liability per SAK EP
      details = [
        {
          id: "1",
          jurnalId: "",
          coaId: "2", // Kas
          debit: transaksi.jumlah || 0,
          kredit: 0,
          keterangan: `Penerimaan simpanan sukarela dari ${transaksi.anggotaNama}`
        },
        {
          id: "2", 
          jurnalId: "",
          coaId: "6", // Utang Simpanan Sukarela
          debit: 0,
          kredit: transaksi.jumlah || 0,
          keterangan: `Simpanan sukarela anggota - ${transaksi.anggotaNama} (SAK EP)`
        }
      ];
    }

    const totalDebit = details.reduce((sum, detail) => sum + detail.debit, 0);
    const totalKredit = details.reduce((sum, detail) => sum + detail.kredit, 0);

    return await createJurnalEntry({
      nomorJurnal: "",
      tanggal: transaksi.tanggal,
      deskripsi: `SAK EP SIMPANAN - ${transaksi.anggotaNama} | ${transaksi.kategori || 'Umum'}: ${formatCurrency(transaksi.jumlah || 0)}`,
      referensi: `TXN-${transaksi.id}`,
      status: "POSTED",
      createdBy: "system_auto_sync",
      totalDebit,
      totalKredit,
      details
    });
  } catch (error) {
    console.error("Error creating SAK EP simpanan journal entry:", error);
    return null;
  }
}

