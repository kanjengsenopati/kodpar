import React, { useState, useEffect } from 'react';
import { Cloud, CloudOff, CloudCheck, RefreshCw } from 'lucide-react';
import { db } from '@/db/db';
import * as Text from "@/components/ui/text";
import { cn } from "@/lib/utils";

export default function SyncStatusIndicator() {
  const [pendingCount, setPendingCount] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const checkQueue = async () => {
      try {
        const count = await db.sync_queue
          .filter(item => item.remoteStatus !== 'SUCCESS')
          .count();
        setPendingCount(count);
      } catch (err) {
        console.error("Failed to check sync queue", err);
      }
    };

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    const handleSyncEvent = () => {
      setIsSyncing(true);
      setTimeout(() => setIsSyncing(false), 2000);
      checkQueue();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('cloud-sync-success', handleSyncEvent);

    // Initial check
    checkQueue();
    const interval = setInterval(checkQueue, 5000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('cloud-sync-success', handleSyncEvent);
      clearInterval(interval);
    };
  }, []);

  if (!isOnline) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-50 text-red-600 border border-red-100 animate-pulse">
        <CloudOff size={12} strokeWidth={2.5} />
        <Text.Label className="text-[9px] text-red-600 font-bold whitespace-nowrap">OFFLINE</Text.Label>
      </div>
    );
  }

  if (pendingCount > 0) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-100">
        <RefreshCw size={12} strokeWidth={2.5} className="animate-spin" />
        <Text.Label className="text-[9px] text-amber-600 font-bold whitespace-nowrap">
          {pendingCount} PENDING
        </Text.Label>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex items-center gap-1.5 px-2 py-1 rounded-full transition-all duration-500",
      isSyncing ? "bg-blue-50 text-blue-600 border-blue-100 scale-105" : "bg-emerald-50 text-emerald-600 border-emerald-100"
    )}>
      <Cloud size={12} strokeWidth={2.5} className={cn(isSyncing && "animate-bounce")} />
      <Text.Label className={cn(
        "text-[9px] font-bold whitespace-nowrap",
        isSyncing ? "text-blue-600" : "text-emerald-600"
      )}>
        {isSyncing ? "SYNCING..." : "CLOUD SYNC"}
      </Text.Label>
    </div>
  );
}
