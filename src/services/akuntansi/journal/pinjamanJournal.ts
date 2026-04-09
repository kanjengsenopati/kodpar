
import { JurnalEntry, JurnalDetail } from "@/types/akuntansi";
import { Transaksi } from "@/types";
import { createJurnalEntry, getJurnalEntryByReference } from "../jurnalService";
import { getCoaIdByCode } from "../coaService";
import { formatCurrency } from "./journalUtils";

/**
 * Create journal entry for Pinjaman transaction following SAK EP (Entitas Privat) with enhanced duplicate prevention
 */
export async function createPinjamanJournalEntry(transaksi: Transaksi): Promise<JurnalEntry | null> {
  try {
    // Enhanced duplicate prevention - check multiple reference patterns
    const possibleReferences = [
      `TXN-${transaksi.id}`,
      `PINJAMAN-${transaksi.id}`,
      `LOAN-${transaksi.id}`
    ];
    
    for (const ref of possibleReferences) {
      const existingEntry = await getJurnalEntryByReference(ref);
      if (existingEntry) {
        console.log(`⚠️ Pinjaman journal entry already exists with reference ${ref}, returning existing entry: ${existingEntry.nomorJurnal}`);
        return existingEntry;
      }
    }

    const details: JurnalDetail[] = [
      {
        id: "1",
        jurnalId: "",
        coaId: getCoaIdByCode("1100"), // Piutang Anggota
        debit: transaksi.jumlah,
        kredit: 0,
        keterangan: `Piutang pinjaman kepada ${transaksi.anggotaNama} (SAK EP)`
      },
      {
        id: "2",
        jurnalId: "",
        coaId: getCoaIdByCode("1000"), // Kas
        debit: 0,
        kredit: transaksi.jumlah,
        keterangan: `Pencairan pinjaman untuk ${transaksi.anggotaNama}`
      }
    ];

    const totalDebit = details.reduce((sum, detail) => sum + detail.debit, 0);
    const totalKredit = details.reduce((sum, detail) => sum + detail.kredit, 0);

    const result = await createJurnalEntry({
      nomorJurnal: "",
      tanggal: transaksi.tanggal,
      deskripsi: `SAK EP PINJAMAN - ${transaksi.anggotaNama} | ${transaksi.kategori || 'Reguler'}: ${formatCurrency(transaksi.jumlah)}`,
      referensi: `TXN-${transaksi.id}`, // Use consistent reference pattern
      status: "POSTED",
      createdBy: "system_auto_sync",
      totalDebit,
      totalKredit,
      details
    });

    if (result.success && result.data) {
      console.log(`✅ Pinjaman journal entry created: ${result.data.nomorJurnal} for transaction ${transaksi.id}`);
      return result.data;
    } else {
      console.error(`❌ Failed to create journal entry for Pinjaman ${transaksi.id}: ${result.error}`);
      return null;
    }
  } catch (error) {
    console.error("Error creating SAK EP pinjaman journal entry:", error);
    return null;
  }
}

