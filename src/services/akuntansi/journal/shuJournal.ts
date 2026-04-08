
import { JurnalEntry, JurnalDetail } from "@/types/akuntansi";
import { createJurnalEntry } from "../jurnalService";
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
        coaId: "11", // SHU Belum Dibagi
        debit: totalSHU,
        kredit: 0,
        keterangan: `Alokasi SHU untuk dibagikan - ${keterangan}`
      }
    ];

    // Add entries for jasa modal and jasa usaha distribution
    let detailIndex = 2;
    
    if (jasaModal > 0) {
      details.push({
        id: detailIndex.toString(),
        jurnalId: "",
        coaId: "8", // Simpanan Pokok (for jasa modal)
        debit: 0,
        kredit: jasaModal,
        keterangan: `Jasa Modal - Pembagian SHU berdasarkan simpanan (SAK ETAP)`
      });
      detailIndex++;
    }

    if (jasaUsaha > 0) {
      details.push({
        id: detailIndex.toString(),
        jurnalId: "",
        coaId: "10", // Cadangan Umum (for jasa usaha)
        debit: 0,
        kredit: jasaUsaha,
        keterangan: `Jasa Usaha - Pembagian SHU berdasarkan transaksi (SAK ETAP)`
      });
    }

    const totalDebit = details.reduce((sum, detail) => sum + detail.debit, 0);
    const totalKredit = details.reduce((sum, detail) => sum + detail.kredit, 0);

    return createJurnalEntry({
      nomorJurnal: "",
      tanggal,
      deskripsi: `SAK ETAP SHU DISTRIBUTION - Total: ${formatCurrency(totalSHU)} | Jasa Modal: ${formatCurrency(jasaModal)} | Jasa Usaha: ${formatCurrency(jasaUsaha)}`,
      referensi: `SHU-${Date.now()}`,
      status: "POSTED",
      createdBy: "system_auto_sync",
      totalDebit,
      totalKredit,
      details
    });
  } catch (error) {
    console.error("Error creating SAK ETAP SHU distribution entry:", error);
    return null;
  }
}
