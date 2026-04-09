
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ShieldAlert, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { consistencyService, ConsistencyStatus } from "@/services/akuntansi/consistencyService";
import { toast } from "sonner";
import * as Text from "@/components/ui/text";

export function SyncConsistencyWidget() {
  const [status, setStatus] = useState<ConsistencyStatus | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isReconciling, setIsReconciling] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    setIsVerifying(true);
    try {
      const result = await consistencyService.validateSyncConsistency();
      setStatus(result);
    } catch (error) {
      console.error("Failed to verify consistency:", error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleReconcile = async () => {
    setIsReconciling(true);
    try {
      const result = await consistencyService.reconcileInconsistencies();
      toast.success(`Berhasil sinkronisasi ${result.success} transaksi`);
      await fetchStatus();
    } catch (error) {
      toast.error("Gagal melakukan rekonsiliasi data");
    } finally {
      setIsReconciling(false);
    }
  };

  const handleFullRebuild = async () => {
    if (!confirm("⚠️ PERINGATAN: Ini akan menghapus semua jurnal otomatis dan membangun ulang dari awal. Lanjutkan?")) return;
    
    setIsReconciling(true);
    try {
      const result = await consistencyService.fullRebuildLedger();
      toast.success(`Ledger berhasil dibangun ulang: ${result.success} sukses, ${result.failed} gagal.`);
      await fetchStatus();
    } catch (error) {
      toast.error("Gagal membangun ulang ledger");
    } finally {
      setIsReconciling(false);
    }
  };

  if (!status && isVerifying) {
    return (
      <Card className="rounded-[24px] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-pulse">
        <CardContent className="p-6 h-[100px] flex items-center justify-center">
          <Text.Body>Memverifikasi konsistensi data...</Text.Body>
        </CardContent>
      </Card>
    );
  }

  const hasInconsistency = status && status.inconsistentTransactions.length > 0;

  return (
    <Card className="rounded-[24px] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
      <CardContent className="p-0">
        <div className={`p-5 flex items-center justify-between ${hasInconsistency ? 'bg-amber-50' : 'bg-emerald-50'}`}>
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${hasInconsistency ? 'bg-amber-100' : 'bg-emerald-100'}`}>
              {hasInconsistency ? (
                <ShieldAlert className="h-6 w-6 text-amber-600" />
              ) : (
                <ShieldCheck className="h-6 w-6 text-emerald-600" />
              )}
            </div>
            <div>
              <Text.H2 className="leading-tight">Integritas Data</Text.H2>
              <Text.Body className={hasInconsistency ? 'text-amber-700' : 'text-emerald-700'}>
                {hasInconsistency 
                  ? `${status.inconsistentTransactions.length} transaksi belum jurnal` 
                  : "Semua data tersinkronisasi sempurna"
                }
              </Text.Body>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {hasInconsistency ? (
              <div className="flex gap-2">
                <Button 
                  onClick={handleReconcile} 
                  disabled={isReconciling}
                  className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl px-4"
                >
                  {isReconciling ? (
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Sinkronisasi
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleFullRebuild} 
                  disabled={isReconciling}
                  className="border-amber-200 text-amber-700 hover:bg-amber-100 rounded-xl"
                >
                  Reset Ledger
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleFullRebuild} 
                  disabled={isReconciling}
                  className="text-slate-400 hover:text-amber-600"
                >
                  <AlertCircle className="h-4 w-4 mr-1" />
                  Full Rebuild
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={fetchStatus} 
                  disabled={isVerifying}
                  className="text-emerald-600"
                >
                  <RefreshCw className={`h-4 w-4 ${isVerifying ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {status && (
          <div className="px-5 py-3 flex items-center gap-6 border-t border-slate-50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <Text.Caption className="not-italic font-semibold text-slate-500">
                {status.synced} TERJURNAL
              </Text.Caption>
            </div>
            {status.pending > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                <Text.Caption className="not-italic font-semibold text-slate-500">
                  {status.pending} PENDING
                </Text.Caption>
              </div>
            )}
            {status.failed > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <Text.Caption className="not-italic font-semibold text-slate-500">
                  {status.failed} GAGAL
                </Text.Caption>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
