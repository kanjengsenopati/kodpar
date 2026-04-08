
import { useState, useEffect } from 'react';
import { getAllPemasukanPengeluaran } from '@/services/keuangan/transaksiService';
import { PemasukanPengeluaran } from '@/types';

export function useAccountingKeuanganSync() {
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [data, setData] = useState<PemasukanPengeluaran[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const syncAfterOperation = () => {
    setLastUpdate(new Date());
    loadData();
  };

  const loadData = () => {
    try {
      setIsLoading(true);
      const transactions = getAllPemasukanPengeluaran();
      setData(transactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    
    // Listen for keuangan data changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'pemasukan_pengeluaran') {
        setLastUpdate(new Date());
        loadData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for direct storage updates in the same tab
    const checkForUpdates = () => {
      loadData();
    };

    // Set up interval to check for updates
    const interval = setInterval(checkForUpdates, 5000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return { 
    lastUpdate, 
    data, 
    isLoading, 
    syncAfterOperation 
  };
}

// Export alias for backward compatibility
export function useKeuanganSync() {
  return useAccountingKeuanganSync();
}

// Export for transaction sync
export function useKeuanganTransaksiSync() {
  return useAccountingKeuanganSync();
}
