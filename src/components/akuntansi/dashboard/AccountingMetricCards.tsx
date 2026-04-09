import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db/db";
import { formatCurrency } from "@/utils/formatters";
import { getBukuBesarByAccount } from "@/services/akuntansi/bukuBesarService";
import { getCoaIdByCode } from "@/services/akuntansi/coaService";
import { 
  TrendingUp, 
  Wallet, 
  ArrowUpRight, 
  AlertCircle,
  CheckCircle2
} from "lucide-react";

export function AccountingMetricCards() {
  const [metrics, setMetrics] = useState({
    totalPenyaluran: 0,
    piutangAccounting: 0,
    kasSaldo: 0,
    consistencyStatus: 'checking',
    isLoading: true
  });

  useEffect(() => {
    async function loadMetrics() {
      try {
        // 1. Fetch TOTAL PENYALURAN (The 64M number - from Sub-ledger/Transaction)
        const allTransactions = await db.transaksi.toArray();
        const totalPenyaluran = allTransactions
          .filter(t => t.jenis === "Pinjam" && t.status === "Sukses")
          .reduce((sum, t) => sum + (t.jumlah || 0), 0);

        // 2. Fetch OUSTANDING PIUTANG (The 300k number - from Ledger Truth)
        // Note: Using current period
        const now = new Date();
        const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        const coaPiutangId = getCoaIdByCode("1100");
        const coaKasId = getCoaIdByCode("1000");

        const [bukuBesarPiutang, bukuBesarKas] = await Promise.all([
          getBukuBesarByAccount(coaPiutangId, period),
          getBukuBesarByAccount(coaKasId, period)
        ]);

        const piutangAccounting = bukuBesarPiutang?.saldoAkhir || 0;
        const kasSaldo = bukuBesarKas?.saldoAkhir || 0;

        // 3. Consistency Check
        // If the gap is huge, we flag it as needing a rebuild
        const consistencyStatus = piutangAccounting < totalPenyaluran * 0.1 ? 'warning' : 'perfect';

        setMetrics({
          totalPenyaluran,
          piutangAccounting,
          kasSaldo,
          consistencyStatus,
          isLoading: false
        });
      } catch (error) {
        console.error("Error loading accounting metrics:", error);
        setMetrics(prev => ({ ...prev, isLoading: false }));
      }
    }

    loadMetrics();
    
    // Listen for rebuild events
    const handleRebuild = () => loadMetrics();
    window.addEventListener('ledger-rebuild-completed', handleRebuild);
    return () => window.removeEventListener('ledger-rebuild-completed', handleRebuild);
  }, []);

  if (metrics.isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-[24px]" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* 1. Total Penyaluran (Plafon Terdistribusi) */}
      <Card className="rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-none bg-white">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
            Total Penyaluran (Gross)
          </CardTitle>
          <TrendingUp className="h-[18px] w-[18px] text-slate-400" />
        </CardHeader>
        <CardContent>
          <div className="text-[18px] font-bold text-slate-900">
            {formatCurrency(metrics.totalPenyaluran)}
          </div>
          <p className="text-[12px] text-slate-400 mt-1 italic">
            Akumulasi pinjaman yang disalurkan
          </p>
        </CardContent>
      </Card>

      {/* 2. Saldo Piutang (Saldo Buku SAK EP) */}
      <Card className="rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-none bg-white">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
            Piutang Outstandings (Net)
          </CardTitle>
          <ArrowUpRight className="h-[18px] w-[18px] text-emerald-600" />
        </CardHeader>
        <CardContent>
          <div className="text-[18px] font-bold text-emerald-600">
            {formatCurrency(metrics.piutangAccounting)}
          </div>
          <div className="flex items-center gap-1 mt-1">
            {metrics.consistencyStatus === 'warning' ? (
              <>
                <AlertCircle className="h-3 w-3 text-red-500" />
                <span className="text-[11px] text-red-500 font-medium">Buku belum sinkron</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                <span className="text-[11px] text-emerald-500 font-medium">SAK EP Reconciled</span>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 3. Saldo Kas & Bank */}
      <Card className="rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-none bg-white">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
            Total Kas & Bank
          </CardTitle>
          <Wallet className="h-[18px] w-[18px] text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-[18px] font-bold text-slate-900">
            {formatCurrency(metrics.kasSaldo)}
          </div>
          <p className="text-[12px] text-slate-400 mt-1 italic">
            Posisi likuiditas koperasi saat ini
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
