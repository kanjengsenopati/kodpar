
// Koperasi-ERP App
import React, { useEffect } from 'react';
import { AppRoutes } from '@/routes/AppRoutes';
import { initializeCentralizedSync } from './services/sync/centralizedSyncService';
import { BusinessTabProvider } from './contexts/BusinessTabContext';

function App() {
  const APP_VERSION = '1.4.0'; // Cache buster version

  const initializeApp = async () => {
    try {
      // Force cleanup if version mismatch detected
      const lastVersion = localStorage.getItem('koperasi_app_version');
      if (lastVersion !== APP_VERSION) {
        console.log(`🔄 Version update detected (${lastVersion || 'initial'} -> ${APP_VERSION}). Clearing caches...`);
        
        // Clear everything for a fresh start
        localStorage.clear();
        sessionStorage.clear();
        
        // Save new version
        localStorage.setItem('koperasi_app_version', APP_VERSION);
        
        // Final force reload
        window.location.reload();
        return;
      }

      // Standard cleanup for specific keys
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('shu_result_')) {
          localStorage.removeItem(key);
        }
      });
      console.log('🧹 Old SHU cache cleared to prevent data staleness');

      // Ensure DB and Sync services are ready
      await initializeCentralizedSync();

      // Trigger Master Sync (Cloud -> Local) only once per session
      const isRehydrated = sessionStorage.getItem('neon_ssot_rehydrated');
      if (!isRehydrated) {
        const { neonMasterSync } = await import('./services/sync/neonMasterSyncService');
        await neonMasterSync.rehydrateFromCloud();
        sessionStorage.setItem('neon_ssot_rehydrated', 'true');
      }

      console.log('✅ Koperasi App initialization successful');
    } catch (error) {
      console.error('❌ Koperasi App initialization failed:', error);
    }

  };

  useEffect(() => {
    initializeApp();
  }, []);

  return (
    <BusinessTabProvider>
      <div className="min-h-screen bg-background">
        <AppRoutes />
      </div>
    </BusinessTabProvider>
  );
}

export default App;
