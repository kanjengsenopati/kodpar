
import { useState, useEffect } from 'react';
import { getAllAnggota } from '@/services/anggotaService';
import { Anggota } from '@/types';

/**
 * Hook untuk real-time sync anggota list dengan financial data
 */
export function useAnggotaListSync() {
  const [anggotaList, setAnggotaList] = useState<Anggota[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const loadAnggotaList = () => {
    const loadedAnggota = getAllAnggota();
    setAnggotaList(loadedAnggota);
    setLastUpdate(new Date());
    return loadedAnggota;
  };

  useEffect(() => {
    // Initial load
    loadAnggotaList();

    // Listen for anggota data refresh events
    const handleAnggotaRefresh = (event: any) => {
      console.log('📋 Anggota data refresh requested, reloading list');
      setTimeout(loadAnggotaList, 100);
    };

    // Listen for member financial updates
    const handleMemberFinancialUpdate = (event: any) => {
      console.log(`💰 Financial update for member ${event.detail.anggotaId}, refreshing list`);
      setTimeout(loadAnggotaList, 150);
    };

    // Listen for centralized sync completion
    const handleCentralizedSync = (event: any) => {
      console.log('🔄 Centralized sync completed, refreshing anggota list');
      setTimeout(loadAnggotaList, 200);
    };

    // Listen for transaction events
    const handleTransactionEvent = (event: any) => {
      console.log('💳 Transaction event detected, refreshing anggota list');
      setTimeout(loadAnggotaList, 100);
    };

    window.addEventListener('anggota-data-refresh-needed', handleAnggotaRefresh);
    window.addEventListener('member-financial-data-updated', handleMemberFinancialUpdate);
    window.addEventListener('centralized-sync-completed', handleCentralizedSync);
    window.addEventListener('transaction-created', handleTransactionEvent);
    window.addEventListener('transaction-updated', handleTransactionEvent);
    window.addEventListener('transaction-deleted', handleTransactionEvent);
    window.addEventListener('pengajuan-approved', handleTransactionEvent);

    // Periodic refresh
    const interval = setInterval(loadAnggotaList, 15000); // Every 15 seconds

    return () => {
      window.removeEventListener('anggota-data-refresh-needed', handleAnggotaRefresh);
      window.removeEventListener('member-financial-data-updated', handleMemberFinancialUpdate);
      window.removeEventListener('centralized-sync-completed', handleCentralizedSync);
      window.removeEventListener('transaction-created', handleTransactionEvent);
      window.removeEventListener('transaction-updated', handleTransactionEvent);
      window.removeEventListener('transaction-deleted', handleTransactionEvent);
      window.removeEventListener('pengajuan-approved', handleTransactionEvent);
      clearInterval(interval);
    };
  }, []);

  return {
    anggotaList,
    lastUpdate,
    loadAnggotaList,
    refreshAnggotaList: loadAnggotaList
  };
}
