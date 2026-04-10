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
      // Accounting sync is now handled solely via 'transaction-created' event listener
      // to prevent double-processing. No explicit call needed here.
      
      handleTransactionCreateSuccess(result.data);
      
      // Process auto deductions for loan transactions AFTER centralized sync
      if (result.data.jenis === "Pinjam") {
        await processLoanAutoDeductions(result.data);
      }
      
      // Link payment to installment schedule for Angsuran transactions
      if (result.data.jenis === "Angsuran") {
        const { linkPaymentToSchedule } = await import("./installmentScheduleService");
        await linkPaymentToSchedule(result.data);
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

/**
 * Update an existing transaksi dengan centralized sync
 */
export async function updateTransaksi(id: string, transaksi: Partial<Transaksi>): Promise<SubmissionResult<Transaksi>> {
  const existing = await db.transaksi.get(id);
  
  if (!existing) {
    handleTransactionNotFound();
    return { success: false, error: "Transaksi tidak ditemukan" };
  }
  
  const oldTransaksi = { ...existing };
  
  // If anggotaId is being updated, we need to update anggotaNama as well
  if (transaksi.anggotaId) {
    const anggota = await getAnggotaById(transaksi.anggotaId);
    if (!anggota) {
      handleMemberNotFound();
      return { success: false, error: "Anggota tidak ditemukan" };
    }
    transaksi.anggotaNama = anggota.nama;
  }
  
  const updatedTransaksi: Transaksi = {
    ...existing,
    ...transaksi,
    updatedAt: new Date().toISOString(),
  };
  
  try {
    await db.transaksi.put(updatedTransaksi);
  } catch (error: any) {
    return { success: false, error: `Database Error: ${error.message || 'Gagal memperbarui transaksi'}` };
  }
  
  handleTransactionUpdateSuccess(updatedTransaksi);
  
  // Centralized sync for updated transaction
  if (updatedTransaksi.status === "Sukses") {
    console.log(`🔄 Triggering centralized sync for updated transaction ${id}`);
    const syncResult = await centralizedSync.syncTransaction(updatedTransaksi);
    
    if (syncResult.success) {
      console.log(`✅ Update centralized sync completed for transaction ${id}: ${syncResult.message}`);
    }
  }
  
  // Comprehensive sync for updated transaction (non-accounting)
  const keuanganSync = await syncTransactionToKeuangan(updatedTransaksi);
  if (keuanganSync.success) {
    console.log(`Update comprehensive sync completed for transaction ${id}`);
  }
  
  // Emit transaction updated event
  window.dispatchEvent(new CustomEvent('transaction-updated', {
    detail: { 
      transaction: updatedTransaksi,
      previousTransaction: oldTransaksi,
      timestamp: new Date().toISOString()
    }
  }));
  
  // Log audit entry
  logAuditEntry(
    "UPDATE",
    "TRANSAKSI", 
    `Memperbarui transaksi ${oldTransaksi.jenis} dari Rp ${oldTransaksi.jumlah.toLocaleString('id-ID')} menjadi Rp ${updatedTransaksi.jumlah.toLocaleString('id-ID')} untuk anggota ${updatedTransaksi.anggotaNama} dengan centralized sync`,
    id
  );
  
  return { success: true, data: updatedTransaksi };
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
    logAuditEntry(
      "DELETE",
      "TRANSAKSI",
      `Menghapus transaksi ${transaksiToDelete.jenis} sebesar Rp ${transaksiToDelete.jumlah.toLocaleString('id-ID')} untuk anggota ${transaksiToDelete.anggotaNama} dengan centralized sync cleanup`,
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
  await db.transaksi.bulkAdd(initialTransaksi);
  
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
