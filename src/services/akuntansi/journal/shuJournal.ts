
import { JurnalEntry, JurnalDetail } from "@/types/akuntansi";
import { createJurnalEntry } from "../jurnalService";
import { getCoaIdByCode } from "../coaService";
import { formatCurrency } from "./journalUtils";

/**
 * Create journal entry for SHU distribution based on RAT decision
 */
export function createSHUDistributionEntry(
  totalSHU: number,
  jasaModal: number,
  jasaUsaha: number,
  tanggal: string,
  keterangan: string = "Pembagian SHU berdasarkan RAT"
): JurnalEntry | null {
  try {
    const details: JurnalDetail[] = [
      {
        id: "1",
        jurnalId: "",
        coaId: getCoaIdByCode("cadangan-shu"), // Should ideally be standardized
        debit: totalSHU,
        kredit: 0,
        keterangan: `Alokasi SHU untuk dibagikan - ${keterangan}`
      }
    ];

    // Note: COA codes for specific SHU allocations should be standardized
    // For now, using logical placeholders that we should ensure exist in initialCOA
    
    // Add entries for jasa modal and jasa usaha distribution
    let detailIndex = 2;
    
    if (jasaModal > 0) {
      details.push({
        id: detailIndex.toString(),
        jurnalId: "",
        coaId: getCoaIdByCode("3100"), // Simpanan Pokok (for jasa modal)
        debit: 0,
        kredit: jasaModal,
        keterangan: `Jasa Modal - Pembagian SHU berdasarkan simpanan (SAK EP)`
      });
      detailIndex++;
    }

    if (jasaUsaha > 0) {
      details.push({
        id: detailIndex.toString(),
        jurnalId: "",
        coaId: getCoaIdByCode("3300"), // Cadangan Umum (for jasa usaha)
        debit: 0,
        kredit: jasaUsaha,
        keterangan: `Jasa Usaha - Pembagian SHU berdasarkan transaksi (SAK EP)`
      });
    }

    const totalDebit = details.reduce((sum, detail) => sum + detail.debit, 0);
    const totalKredit = details.reduce((sum, detail) => sum + detail.kredit, 0);

    return createJurnalEntry({
      nomorJurnal: "",
      tanggal,
      deskripsi: `SAK EP SHU DISTRIBUTION - Total: ${formatCurrency(totalSHU)} | Jasa Modal: ${formatCurrency(jasaModal)} | Jasa Usaha: ${formatCurrency(jasaUsaha)}`,
      referensi: `SHU-${Date.now()}`,
      status: "POSTED",
      createdBy: "system_auto_sync",
      totalDebit,
      totalKredit,
      details
    });
  } catch (error) {
    console.error("Error creating SAK EP SHU distribution entry:", error);
    return null;
  }
}
