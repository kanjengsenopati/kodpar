
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Zap,
  Database,
  TrendingUp,
  Activity
} from 'lucide-react';
import { getAccountingSyncStatus, batchSyncAllTransactions } from '@/services/akuntansi/accountingSyncService';
import { useRealTimeAccountingSync } from '@/services/realTimeAccountingSync';
import { formatCurrency } from '@/utils/formatters';
import { toast } from 'sonner';

export function RealTimeSyncStatus() {
  const [syncStatus, setSyncStatus] = useState({
    totalTransactions: 0,
    syncedTransactions: 0,
    unsyncedTransactions: 0,
    lastSyncTime: null as string | null
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isBatchSyncing, setIsBatchSyncing] = useState(false);
  const { queueStatus, forceSyncAll } = useRealTimeAccountingSync();

  useEffect(() => {
    loadSyncStatus();
    
    // Listen for real-time sync events
    const handleSyncEvent = () => {
      loadSyncStatus();
    };

    window.addEventListener('real-time-accounting-sync', handleSyncEvent);
    window.addEventListener('accounting-sync-completed', handleSyncEvent);
    window.addEventListener('transaction-created', handleSyncEvent);
    window.addEventListener('transaction-updated', handleSyncEvent);
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadSyncStatus, 30000);

    return () => {
      window.removeEventListener('real-time-accounting-sync', handleSyncEvent);
      window.removeEventListener('accounting-sync-completed', handleSyncEvent);
      window.removeEventListener('transaction-created', handleSyncEvent);
      window.removeEventListener('transaction-updated', handleSyncEvent);
      clearInterval(interval);
    };
  }, []);

  const loadSyncStatus = () => {
    const status = getAccountingSyncStatus();
    setSyncStatus(status);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await forceSyncAll();
      loadSyncStatus();
      toast.success('Status sinkronisasi berhasil direfresh');
    } catch (error) {
      toast.error('Gagal refresh status sinkronisasi');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleBatchSync = async () => {
    setIsBatchSyncing(true);
    try {
      const result = batchSyncAllTransactions();
      loadSyncStatus();
      
      toast.success(
        `Batch sync selesai: ${result.successful} berhasil, ${result.failed} gagal dari ${result.totalProcessed} transaksi`
      );
    } catch (error) {
      toast.error('Gagal melakukan batch sync');
    } finally {
      setIsBatchSyncing(false);
    }
  };

  const syncPercentage = syncStatus.totalTransactions > 0 
    ? (syncStatus.syncedTransactions / syncStatus.totalTransactions) * 100 
    : 0;

  const formatLastSyncTime = (timeString: string | null) => {
    if (!timeString) return 'Belum pernah';
    
    const time = new Date(timeString);
    const now = new Date();
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit yang lalu`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    
    return time.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Status Sinkronisasi Real-time
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              size="sm"
              onClick={handleBatchSync}
              disabled={isBatchSyncing}
            >
              <Database className={`h-4 w-4 mr-1 ${isBatchSyncing ? 'animate-pulse' : ''}`} />
              Batch Sync
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sync Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Progress Sinkronisasi</span>
            <span className="text-sm text-muted-foreground">
              {syncStatus.syncedTransactions} / {syncStatus.totalTransactions}
            </span>
          </div>
          <Progress value={syncPercentage} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{syncPercentage.toFixed(1)}% tersinkronisasi</span>
            <span>{syncStatus.unsyncedTransactions} belum tersinkronisasi</span>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
            <div className="bg-green-100 p-2 rounded-full">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-green-600 font-medium">Tersinkronisasi</p>
              <p className="text-lg font-semibold text-green-700">
                {syncStatus.syncedTransactions}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 p-3 bg-yellow-50 rounded-lg">
            <div className="bg-yellow-100 p-2 rounded-full">
              <Clock className="h-4 w-4 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-yellow-600 font-medium">Menunggu</p>
              <p className="text-lg font-semibold text-yellow-700">
                {queueStatus.pending}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 p-3 bg-orange-50 rounded-lg">
            <div className="bg-orange-100 p-2 rounded-full">
              <AlertCircle className="h-4 w-4 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-orange-600 font-medium">Belum Sync</p>
              <p className="text-lg font-semibold text-orange-700">
                {syncStatus.unsyncedTransactions}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
            <div className="bg-blue-100 p-2 rounded-full">
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-blue-600 font-medium">Total</p>
              <p className="text-lg font-semibold text-blue-700">
                {syncStatus.totalTransactions}
              </p>
            </div>
          </div>
        </div>

        {/* Real-time Status */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Real-time Sync</span>
            </div>
            {queueStatus.processing && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                <Zap className="h-3 w-3 mr-1" />
                Processing
              </Badge>
            )}
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Sync Terakhir</p>
            <p className="text-sm font-medium">
              {formatLastSyncTime(syncStatus.lastSyncTime)}
            </p>
          </div>
        </div>

        {/* Sync Types Status */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Jenis Sinkronisasi Aktif:</p>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Transaksi → Akuntansi
            </Badge>
            <Badge className="bg-blue-100 text-blue-800">
              <RefreshCw className="h-3 w-3 mr-1" />
              Transaksi → Keuangan
            </Badge>
            <Badge className="bg-purple-100 text-purple-800">
              <Zap className="h-3 w-3 mr-1" />
              Pengajuan → Akuntansi
            </Badge>
            <Badge className="bg-orange-100 text-orange-800">
              <TrendingUp className="h-3 w-3 mr-1" />
              Auto Deductions
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
