
import { cleanResetTransactionAndAccounting } from "@/services/resetDataService";

// Execute the clean reset immediately
console.log("🚀 Executing clean reset of transaction and accounting data...");

try {
  const result = cleanResetTransactionAndAccounting();
  
  console.log("✅ Reset completed successfully!");
  console.log(`📊 Reset Summary:
  - Deleted Transactions: ${result.deletedTransactions}
  - Deleted Journal Entries: ${result.deletedJournals}
  - Reset Transaction Amounts: ${result.resetCount}
  - Reset Keuangan Amounts: ${result.keuanganCount}
  - Total Items Affected: ${result.totalAffected}`);
  
  // Trigger page refresh to reflect changes
  setTimeout(() => {
    window.location.reload();
  }, 1000);
  
} catch (error) {
  console.error("❌ Reset failed:", error);
}
