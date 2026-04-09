import { useState, useEffect } from 'react';
import { calculateDetailedMemberFinancialSummary } from '@/services/financialCalculations';

/**
 * Hook untuk real-time sync financial data anggota
 */
export function useAnggotaRealTimeSync(anggotaId: string) {
  const [financialData, setFinancialData] = useState<any>({
    totalSimpanan: 0,
    totalPinjaman: 0,
    totalAngsuran: 0,
    sisaPinjaman: 0,
    totalPenarikan: 0,
    totalSHU: 0
  });
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(true);

  const refreshFinancialData = async () => {
    try {
      setIsLoading(true);
      const updatedData = await calculateDetailedMemberFinancialSummary(anggotaId);
      setFinancialData(updatedData);
      setLastUpdate(new Date());
    } catch (error) {
      console.error("Error refreshing financial data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial load
    refreshFinancialData();

    // Listen for member financial data updates
    const handleMemberDataUpdate = (event: any) => {
      if (event.detail.anggotaId === anggotaId) {
        console.log(`📊 Received financial data update for member ${anggotaId}`);
        refreshFinancialData();
      }
    };

    // Listen for centralized sync events
    const handleCentralizedSync = (event: any) => {
      // Refresh after any sync completion
      setTimeout(refreshFinancialData, 200);
    };

    // Listen for transaction events that affect this member
    const handleTransactionEvent = (event: any) => {
      const transaction = event.detail.transaction;
      if (transaction && transaction.anggotaId === anggotaId) {
        console.log(`💰 Transaction event for member ${anggotaId}, refreshing data`);
        setTimeout(refreshFinancialData, 150);
      }
    };

    window.addEventListener('member-financial-data-updated', handleMemberDataUpdate);
    window.addEventListener('centralized-sync-completed', handleCentralizedSync);
    window.addEventListener('transaction-created', handleTransactionEvent);
    window.addEventListener('transaction-updated', handleTransactionEvent);
    window.addEventListener('transaction-deleted', handleTransactionEvent);

    // Set up interval for periodic refresh
    const interval = setInterval(refreshFinancialData, 10000); // Every 10 seconds

    return () => {
      window.removeEventListener('member-financial-data-updated', handleMemberDataUpdate);
      window.removeEventListener('centralized-sync-completed', handleCentralizedSync);
      window.removeEventListener('transaction-created', handleTransactionEvent);
      window.removeEventListener('transaction-updated', handleTransactionEvent);
      window.removeEventListener('transaction-deleted', handleTransactionEvent);
      clearInterval(interval);
    };
  }, [anggotaId]);

  return {
    financialData,
    lastUpdate,
    refreshFinancialData
  };
}
