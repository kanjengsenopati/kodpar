
import { Transaksi } from "@/types";
import { calculateAutoDeductions, processAutoDeductions } from "../autoDeductionService";
import { realTimeAccountingSync } from "../../realTimeAccountingSync";

/**
 * Process auto deductions for loan transactions
 */
export function processLoanAutoDeductions(newTransaksi: Transaksi): void {
  if (newTransaksi.jenis !== "Pinjam") return;

  const deductions = calculateAutoDeductions(newTransaksi.jumlah);
  
  if (deductions.danaResikoKredit?.enabled || deductions.simpananWajibKredit?.enabled) {
    console.log(`Processing auto deductions for loan ${newTransaksi.id}:`, deductions);
    const deductionResult = processAutoDeductions(newTransaksi, deductions);
    
    if (deductionResult.success && deductionResult.createdTransactions.length > 0) {
      console.log(`Auto deductions processed successfully for loan ${newTransaksi.id}. Created ${deductionResult.createdTransactions.length} financial transactions with comprehensive sync.`);
      
      // Get the actual Keuangan transactions that were created and convert them to Transaksi format for sync
      deductionResult.createdTransactions.forEach(createdTransaction => {
        // Create a pseudo-transaction for accounting sync purposes
        const pseudoTransaksi: Transaksi = {
          id: createdTransaction.id,
          anggotaId: newTransaksi.anggotaId,
          anggotaNama: newTransaksi.anggotaNama,
          jenis: "Simpan", // Auto deductions are treated as deposits
          jumlah: createdTransaction.amount,
          tanggal: newTransaksi.tanggal,
          kategori: createdTransaction.type === 'danaResikoKredit' ? 'Dana Resiko Kredit' : 'Simpanan Wajib Kredit',
          keterangan: `Auto deduction from loan ${newTransaksi.id}`,
          status: "Sukses",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        realTimeAccountingSync.queueTransactionSync(pseudoTransaksi);
      });
    }
  }
}
