
import { JurnalEntry, JurnalDetail } from "@/types/akuntansi";
import { Transaksi } from "@/types";
import { createJurnalEntry } from "../jurnalService";
import { getCoaIdByCode } from "../coaService";
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
          coaId: getCoaIdByCode("1000"), // Kas
          debit: transaksi.jumlah || 0,
          kredit: 0,
          keterangan: `Penerimaan simpanan pokok dari ${transaksi.anggotaNama}`
        },
        {
          id: "2", 
          jurnalId: "",
          coaId: getCoaIdByCode("3100"), // Simpanan Pokok (Ekuitas)
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
          coaId: getCoaIdByCode("1000"), // Kas
          debit: transaksi.jumlah || 0,
          kredit: 0,
          keterangan: `Penerimaan simpanan wajib dari ${transaksi.anggotaNama}`
        },
        {
          id: "2", 
          jurnalId: "",
          coaId: getCoaIdByCode("3200"), // Simpanan Wajib (Ekuitas)
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
          coaId: getCoaIdByCode("1000"), // Kas
          debit: transaksi.jumlah || 0,
          kredit: 0,
          keterangan: `Penerimaan simpanan sukarela dari ${transaksi.anggotaNama}`
        },
        {
          id: "2", 
          jurnalId: "",
          coaId: getCoaIdByCode("2100"), // Simpanan Sukarela
          debit: 0,
          kredit: transaksi.jumlah || 0,
          keterangan: `Simpanan sukarela anggota - ${transaksi.anggotaNama} (SAK EP)`
        }
      ];
    }

    const totalDebit = details.reduce((sum, detail) => sum + detail.debit, 0);
    const totalKredit = details.reduce((sum, detail) => sum + detail.kredit, 0);

    console.log(`📊 Creating SAK EP journal entry for Simpanan ${transaksi.id} - ${kategori}`);

    const result = await createJurnalEntry({
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

    if (result) {
      console.log(`✅ Simpanan journal entry created successfully: ${result.nomorJurnal}`);
    } else {
      console.error(`❌ Failed to create journal entry for Simpanan ${transaksi.id}`);
    }

    return result;
  } catch (error) {
    console.error("Error in createSimpananJournalEntry:", error);
    // Provide a more descriptive error object instead of just null if possible
    return null;
  }
}

