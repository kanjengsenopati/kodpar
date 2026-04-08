import { Transaksi } from "@/types";
import { getAnggotaById } from "../anggotaService";
import { refreshFinancialCalculations } from "../realTimeCalculationService";
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
export async function createTransaksi(data: Partial<Transaksi>): Promise<Transaksi | null> {
  try {
    // Create the transaction using core service
    const newTransaksi = await createTransactionWithSync(data);
    
    if (newTransaksi && newTransaksi.status === "Sukses") {
      // Single point of accounting sync menggunakan centralized service
      console.log(`🔄 Triggering centralized sync for transaction ${newTransaksi.id}`);
      const syncResult = await centralizedSync.syncTransaction(newTransaksi);
      
      if (syncResult.success) {
        console.log(`✅ Centralized sync completed for transaction ${newTransaksi.id}: ${syncResult.message}`);
      } else {
        console.warn(`⚠️ Centralized sync warning for transaction ${newTransaksi.id}: ${syncResult.message}`);
      }
      
      handleTransactionCreateSuccess(newTransaksi);
      
      // Process auto deductions for loan transactions AFTER centralized sync
      if (newTransaksi.jenis === "Pinjam") {
        await processLoanAutoDeductions(newTransaksi);
      }
    } else if (newTransaksi) {
      handleTransactionPending(newTransaksi);
    }
    
    return newTransaksi;
  } catch (error) {
    console.error("Error creating transaksi:", error);
    handleTransactionError();
    return null;
  }
}

/**
 * Update an existing transaksi dengan centralized sync
 */
export async function updateTransaksi(id: string, transaksi: Partial<Transaksi>): Promise<Transaksi | null> {
  const existing = await db.transaksi.get(id);
  
  if (!existing) {
    handleTransactionNotFound();
    return null;
  }
  
  const oldTransaksi = { ...existing };
  
  // If anggotaId is being updated, we need to update anggotaNama as well
  if (transaksi.anggotaId) {
    const anggota = await getAnggotaById(transaksi.anggotaId);
    if (!anggota) {
      handleMemberNotFound();
      return null;
    }
    transaksi.anggotaNama = anggota.nama;
  }
  
  const updatedTransaksi: Transaksi = {
    ...existing,
    ...transaksi,
    updatedAt: new Date().toISOString(),
  };
  
  await db.transaksi.put(updatedTransaksi);
  
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
  
  // Refresh financial calculations for real-time consistency
  if (updatedTransaksi.anggotaId) {
    refreshFinancialCalculations(updatedTransaksi.anggotaId);
  }
  
  return updatedTransaksi;
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
    if (transaksiToDelete.anggotaId) {
      refreshFinancialCalculations(transaksiToDelete.anggotaId);
    }
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
