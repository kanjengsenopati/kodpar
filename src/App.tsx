
// Koperasi-ERP App
import React, { useEffect } from 'react';
import { AppRoutes } from '@/routes/AppRoutes';
import { initializeCentralizedSync } from './services/sync/centralizedSyncService';
import { BusinessTabProvider } from './contexts/BusinessTabContext';

function App() {
  const initializeApp = async () => {
    try {
      // Cleanup old caches (SHU results) to prevent state mismatch
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('shu_result_')) {
          localStorage.removeItem(key);
        }
      });
      console.log('🧹 Old SHU cache cleared to prevent data staleness');

      // Ensure DB and Sync services are ready
      await initializeCentralizedSync();
      console.log('✅ Koperasi App initialization successful');
    } catch (error) {
      console.error('❌ Koperasi App initialization failed:', error);
      // Fallback for production stability
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
