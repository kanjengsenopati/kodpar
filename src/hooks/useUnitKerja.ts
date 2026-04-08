
import { useState, useEffect } from 'react';
import { UnitKerja } from '@/types/unitKerja';
import { getAllUnitKerja, syncUnitKerjaWithAnggota } from '@/services/unitKerjaService';

/**
 * Custom hook to manage unit kerja data with robust error handling
 * @returns Object containing unit kerja data and operations
 */
export function useUnitKerja() {
  const [unitKerjaList, setUnitKerjaList] = useState<UnitKerja[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Load unit kerja data
  const loadUnitKerja = async () => {
    try {
      setError(null);
      const data = getAllUnitKerja();
      setUnitKerjaList(data);
      
      // Auto-sync with anggota data if needed
      const syncedCount = syncUnitKerjaWithAnggota();
      if (syncedCount > 0) {
        console.log(`Synced ${syncedCount} new unit kerja from anggota data`);
        // Reload after sync
        const updatedData = getAllUnitKerja();
        setUnitKerjaList(updatedData);
      }
    } catch (error) {
      console.error("Error loading unit kerja data:", error);
      setError("Gagal memuat data unit kerja");
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadUnitKerja();
  }, []);

  // Listen for external data updates
  useEffect(() => {
    const handleUnitKerjaUpdate = () => {
      console.log("Unit kerja data updated externally, reloading...");
      loadUnitKerja();
    };

    // Listen for storage changes from other components
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'unit_kerja_updated') {
        handleUnitKerjaUpdate();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events in the same tab
    window.addEventListener('unitKerjaUpdated', handleUnitKerjaUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('unitKerjaUpdated', handleUnitKerjaUpdate);
    };
  }, []);

  // Function to refresh unit kerja data
  const refreshUnitKerja = () => {
    setIsLoading(true);
    loadUnitKerja();
  };

  // Function to manually sync with anggota data
  const syncWithAnggota = () => {
    const syncedCount = syncUnitKerjaWithAnggota();
    if (syncedCount > 0) {
      refreshUnitKerja();
      return syncedCount;
    }
    return 0;
  };

  return {
    unitKerjaList,
    isLoading,
    error,
    refreshUnitKerja,
    syncWithAnggota
  };
}
