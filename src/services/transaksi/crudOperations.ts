import { Transaksi, SubmissionResult } from "@/types";
import { getAnggotaById } from "../anggotaService";
// refreshFinancialCalculations removed (Decommissioned Legacy Logic)
import { logAuditEntry } from "../auditService";
import { syncTransactionToKeuangan } from "../sync/comprehensiveSyncService";
import { centralizedSync } from "../sync/centralizedSyncService";
import { 
  getAllTransaksi, 
  createTransaksi as createTransaksiCore,
} from "./transaksiCore";
import { 
  handleTransactionCreateSuccess,
  handleTransactionPending,
  handleTransactionError,
  handleTransactionUpdateSuccess,
  handleMemberNotFound,
  handleTransactionNotFound,
  handleTransactionDeleteSuccess,
  handleTransactionDeleteNotFound,
  handleDataResetSuccess
} from "./notificationOperations";
import { initialTransaksi } from "./initialData";
import { processLoanAutoDeductions } from "./operations/autoDeductionProcessor";
import { createTransactionWithSync } from "./operations/transactionCore";
import { db } from "@/db/db";

/**
 * Enhanced create transaksi dengan centralized sync untuk mencegah duplikasi
 */
export async function createTransaksi(data: Partial<Transaksi>): Promise<SubmissionResult<Transaksi>> {
  try {
    // Create the transaction using improved async sync wrapper
    const result = await createTransactionWithSync(data);
    
    if (result.success && result.data && result.data.status === "Sukses") {
      handleTransactionCreateSuccess(result.data);
      
      // Process auto deductions for loan transactions
      if (result.data.jenis === "Pinjam") {
        await processLoanAutoDeductions(result.data);
      }
    } else if (result.success && result.data) {
      handleTransactionPending(result.data);
    }
    
    return result;
  } catch (error: any) {
    console.error("Error creating transaksi in crud wrapper:", error);
    // Note: handleTransactionError() is usually called by the UI based on result.success
    return { success: false, error: `Wrapper Error: ${error.message || 'Gagal memproses transaksi'}` };
  }
}

import { updateTransactionWithSync } from "./operations/transactionCore";
// ... (imports preserved)

/**
 * Update an existing transaksi dengan centralized sync ATOMIC
 */
export async function updateTransaksi(id: string, transaksi: Partial<Transaksi>): Promise<SubmissionResult<Transaksi>> {
  try {
    // Audit data integrity before atomic update
    if (transaksi.anggotaId) {
      const anggota = await getAnggotaById(transaksi.anggotaId);
      if (!anggota) {
        handleMemberNotFound();
        return { success: false, error: "Anggota tidak ditemukan" };
      }
    }

    // Execute ATOMIC UPDATE (Transaction + Accounting Jurnal)
    const result = await updateTransactionWithSync(id, transaksi);
    
    if (result.success && result.data) {
      handleTransactionUpdateSuccess(result.data);
      
      // Secondary non-accounting sync (e.g. reports)
      try {
        await syncTransactionToKeuangan(result.data);
      } catch (err) {
        console.warn("Non-fatal secondary sync warning:", err);
      }
    }

    return result;
  } catch (error: any) {
    console.error("Error updating transaksi in crud wrapper:", error);
    return { success: false, error: `Critical Update Error: ${error.message || 'Gagal memproses update'}` };
  }
}


/**
 * Delete a transaksi by ID with real-time sync cleanup
 */
export async function deleteTransaksi(id: string): Promise<boolean> {
  const transaksiToDelete = await db.transaksi.get(id);
  
  if (!transaksiToDelete) {
    handleTransactionDeleteNotFound();
    return false;
  }
  
  await db.transaksi.delete(id);
  
  if (transaksiToDelete) {
    handleTransactionDeleteSuccess(transaksiToDelete);
    
    // Emit transaction deleted event
    window.dispatchEvent(new CustomEvent('transaction-deleted', {
      detail: { 
        transaction: transaksiToDelete,
        timestamp: new Date().toISOString()
      }
    }));
    
    // Log audit entry
    const anggota = await getAnggotaById(transaksiToDelete.anggotaId);
    logAuditEntry(
      "DELETE",
      "TRANSAKSI",
      `Menghapus transaksi ${transaksiToDelete.jenis} sebesar Rp ${transaksiToDelete.jumlah.toLocaleString('id-ID')} untuk anggota ${anggota?.nama || transaksiToDelete.anggotaId} dengan centralized sync cleanup`,
      id
    );
    
    // Refresh financial calculations for affected member
    // Affect member calculations are updated via events.
  }
  
  return true;
}

/**
 * Reset transaksi data to initial state and return the reset data
 */
export async function resetTransaksiData(): Promise<Transaksi[]> {
  await db.transaksi.clear();
  if (initialTransaksi.length > 0) {
    await db.transaksi.bulkAdd(initialTransaksi);
  }
  
  handleDataResetSuccess();
  
  // Emit data reset event
  window.dispatchEvent(new CustomEvent('transaction-data-reset', {
    detail: { 
      timestamp: new Date().toISOString()
    }
  }));
  
  // Log audit entry
  logAuditEntry(
    "DELETE",
    "SYSTEM",
    "Mereset semua data transaksi ke kondisi awal dengan centralized sync cleanup"
  );
  
  return initialTransaksi;
}
