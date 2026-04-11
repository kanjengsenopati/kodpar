
import { Transaksi, Pengajuan } from "@/types";
import { getAllTransaksi } from "../../transaksi/transaksiCore";
import { syncTransactionToAccounting } from "./transactionSync";

/**
 * Sync Pengajuan approval to accounting
 */
export async function syncPengajuanToAccounting(pengajuan: Pengajuan): Promise<any> {
  if (pengajuan.status !== "Disetujui") return null;

  // Create a temporary transaction object for sync
  const tempTransaction: Transaksi = {
    id: `PG-${pengajuan.id}`,
    anggotaId: pengajuan.anggotaId,
    anggotaId: pengajuan.anggotaId,
    jenis: pengajuan.jenis,
    jumlah: pengajuan.jumlah,
    tanggal: pengajuan.tanggal,
    kategori: pengajuan.kategori,
    keterangan: `Approved from Application ${pengajuan.id}: ${pengajuan.keterangan}`,
    status: "Sukses",
    createdAt: pengajuan.createdAt,
    updatedAt: pengajuan.updatedAt
  };

  return await syncTransactionToAccounting(tempTransaction);
}

/**
 * Batch sync all transactions to accounting
 */
export async function batchSyncAllTransactions(): Promise<{ 
  totalProcessed: number, 
  successful: number, 
  failed: number,
  details: Array<{ id: string, type: string, status: 'success' | 'failed', error?: string }>
}> {
  const allTransaksi = await getAllTransaksi();
  let successful = 0;
  let failed = 0;
  const details: Array<{ id: string, type: string, status: 'success' | 'failed', error?: string }> = [];

  console.log(`🔄 Starting batch sync of ${allTransaksi.length} transactions...`);

  for (const transaksi of allTransaksi) {
    try {
      const result = await syncTransactionToAccounting(transaksi);
      if (result) {
        successful++;
        details.push({
          id: transaksi.id,
          type: transaksi.jenis,
          status: 'success'
        });
      } else {
        failed++;
        details.push({
          id: transaksi.id,
          type: transaksi.jenis,
          status: 'failed',
          error: 'No journal entry created'
        });
      }
    } catch (error) {
      failed++;
      details.push({
        id: transaksi.id,
        type: transaksi.jenis,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  console.log(`✅ Batch sync completed: ${successful} successful, ${failed} failed out of ${allTransaksi.length} total`);

  return {
    totalProcessed: allTransaksi.length,
    successful,
    failed,
    details
  };
}

/**
 * Real-time sync status checker
 */
export async function getAccountingSyncStatus(): Promise<{
  totalTransactions: number,
  syncedTransactions: number,
  unsyncedTransactions: number,
  lastSyncTime: string | null
}> {
  const allTransaksi = await getAllTransaksi();
  
  if (!Array.isArray(allTransaksi)) {
    console.error("❌ allTransaksi is not an array:", allTransaksi);
    return {
      totalTransactions: 0,
      syncedTransactions: 0,
      unsyncedTransactions: 0,
      lastSyncTime: localStorage.getItem('last_accounting_sync_time')
    };
  }

  const syncedCount = allTransaksi.filter(t => t.status === "Sukses").length;
  
  return {
    totalTransactions: allTransaksi.length,
    syncedTransactions: syncedCount,
    unsyncedTransactions: allTransaksi.length - syncedCount,
    lastSyncTime: localStorage.getItem('last_accounting_sync_time')
  };
}
