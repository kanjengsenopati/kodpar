
import { JurnalEntry } from "@/types/akuntansi";
import { getAllPemasukanPengeluaran } from "@/services/keuangan/transaksiService";
import { createJurnalEntry } from "./jurnalService";
import { getAllChartOfAccounts } from "./coaService";

/**
 * Sync single transaction to accounting
 */
export function syncTransactionToAccounting(transaksi: any): JurnalEntry | null {
  try {
    const accounts = getAllChartOfAccounts();
    const kasAccount = accounts.find(acc => acc.kode === "1000");
    
    if (!kasAccount) {
      console.error("Kas account not found");
      return null;
    }

    const journalEntry = createJurnalEntry({
      nomorJurnal: "",
      tanggal: transaksi.tanggal,
      deskripsi: `${transaksi.jenis}: ${transaksi.keterangan}`,
      referensi: `KEUANGAN-${transaksi.id}`,
      totalDebit: transaksi.jumlah,
      totalKredit: transaksi.jumlah,
      status: 'POSTED',
      createdBy: 'system_auto_sync',
      details: [
        {
          id: `detail-${Date.now()}-1`,
          jurnalId: '',
          coaId: kasAccount.id,
          debit: transaksi.jenis === 'Pemasukan' ? transaksi.jumlah : 0,
          kredit: transaksi.jenis === 'Pengeluaran' ? transaksi.jumlah : 0,
          keterangan: transaksi.keterangan
        }
      ]
    });

    return journalEntry;
  } catch (error) {
    console.error("Error syncing transaction to accounting:", error);
    return null;
  }
}

/**
 * Batch sync transactions to accounting
 */
export function batchSyncTransactionsToAccounting(): { totalProcessed: number, successful: number, failed: number } {
  const transactions = getAllPemasukanPengeluaran();
  let successful = 0;
  let failed = 0;

  transactions.forEach(transaksi => {
    try {
      const result = syncTransactionToAccounting(transaksi);
      if (result) {
        successful++;
      } else {
        failed++;
      }
    } catch (error) {
      failed++;
    }
  });

  return {
    totalProcessed: transactions.length,
    successful,
    failed
  };
}
