
import { useState, useEffect } from "react";
import { Anggota } from "@/types";
import { 
  getTransaksiByAnggotaId, 
  getOverdueLoans,
  getUpcomingDueLoans,
  calculatePenalty
} from "@/services/transaksiService";

import { useAnggotaRealTimeSync } from "@/hooks/useAnggotaRealTimeSync";

import { AnggotaDetailHeader } from "./AnggotaDetailHeader";
import { MainInfoSection } from "./MainInfoSection";
import { TransactionSection } from "./TransactionSection";
import { KeluargaSection } from "./KeluargaSection";
import { FinancialSummaryCards } from "./FinancialSummaryCards";
import { PengajuanPinjamanButton } from "./pinjaman-form";
import { SHUInfoDrawer } from "./shu/SHUInfoDrawer";

interface AnggotaDetailContentProps {
  anggota: Anggota;
}

export function AnggotaDetailContent({ anggota }: AnggotaDetailContentProps) {
  const idAsString: string = String(anggota.id);
  
  // Menggunakan hook baru untuk real-time sync
  const { financialData, lastUpdate, refreshFinancialData } = useAnggotaRealTimeSync(idAsString);

  const [transaksi, setTransaksi] = useState<any[]>([]);
  const [simpananTransaksi, setSimpananTransaksi] = useState<any[]>([]);
  const [pinjamanTransaksi, setPinjamanTransaksi] = useState<any[]>([]);
  const [angsuranTransaksi, setAngsuranTransaksi] = useState<any[]>([]);
  const [filteredJatuhTempo, setFilteredJatuhTempo] = useState<any[]>([]);
  const [filteredTunggakan, setFilteredTunggakan] = useState<any[]>([]);
  const [totalTunggakan, setTotalTunggakan] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tr = await getTransaksiByAnggotaId(idAsString);
        setTransaksi(tr);
        setSimpananTransaksi(tr.filter(t => t.jenis === "Simpan"));
        setPinjamanTransaksi(tr.filter(t => t.jenis === "Pinjam"));
        setAngsuranTransaksi(tr.filter(t => t.jenis === "Angsuran"));
        
        const jt = await getUpcomingDueLoans(idAsString, 30);
        setFilteredJatuhTempo(jt);
        
        const rawT = await getOverdueLoans(idAsString);
        const mappedTunggakan = rawT.map(item => ({
          ...item,
          penalty: calculatePenalty(item.transaksi.jumlah, item.daysOverdue)
        }));
        setFilteredTunggakan(mappedTunggakan);
        setTotalTunggakan(mappedTunggakan.reduce((sum, item) => sum + item.penalty, 0));
      } catch (error) {
        console.error("Error fetching detail data:", error);
      }
    };

    fetchData();
  }, [idAsString, lastUpdate]);

  const keluargaCount = anggota?.keluarga?.length || 0;
  const dokumenCount = anggota?.dokumen?.length || 0;

  return (
    <>
      <AnggotaDetailHeader 
        nama={anggota.nama} 
        keluargaCount={keluargaCount}
        dokumenCount={dokumenCount}
        anggotaId={idAsString}
      />
      
      <div className="mt-4 mb-6 flex justify-between">
        <SHUInfoDrawer totalSHU={financialData.totalSHU} anggotaId={idAsString} />
        <PengajuanPinjamanButton anggotaId={idAsString} anggotaNama={anggota.nama} />
      </div>
      
      <MainInfoSection anggota={anggota} />
      
      <div className="mt-6 mb-6">
        <KeluargaSection 
          anggota={anggota} 
          onAnggotaUpdate={refreshFinancialData}
        />
      </div>
      
      <FinancialSummaryCards 
        totalSimpanan={financialData.totalSimpanan}
        totalPinjaman={financialData.sisaPinjaman}
        totalAngsuran={financialData.totalAngsuran}
        totalPenarikan={financialData.totalPenarikan}
        totalTunggakan={totalTunggakan}
        totalSHU={financialData.totalSHU}
        anggotaId={idAsString}
      />
      
      <div className="mt-6">
        <TransactionSection 
          transaksi={transaksi} 
          simpananTransaksi={simpananTransaksi}
          pinjamanTransaksi={pinjamanTransaksi}
          angsuranTransaksi={angsuranTransaksi}
          jatuhTempo={filteredJatuhTempo}
          tunggakan={filteredTunggakan}
          anggotaId={idAsString}
        />
      </div>
    </>
  );
}
