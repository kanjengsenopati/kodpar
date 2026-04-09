
import { 
  PosisiKeuangan, 
  PenghasilanKomprehensif, 
  ArusKas, 
  PerubahanModal,
  PosisiKeuanganItem, 
  PenghasilanKomprehensifItem, 
  ArusKasItem,
  PerubahanModalItem
} from "@/types/akuntansi";
import { getAllChartOfAccounts } from "./coaService";
import { getBukuBesarSummaryByType, getAllBukuBesar } from "./bukuBesarService";

// Export report types for components
export type { 
  PosisiKeuangan as PosisiKeuanganReport, 
  PenghasilanKomprehensif as PenghasilanKomprehensifReport, 
  ArusKas as ArusKasReport, 
  PerubahanModal as PerubahanModalReport 
};

/**
 * Generate Laporan Posisi Keuangan (Statement of Financial Position) using Buku Besar data
 */
export function generatePosisiKeuangan(periode: string): PosisiKeuangan {
  console.log(`📊 Generating Laporan Posisi Keuangan for period ${periode}`);
  
  const accounts = getAllChartOfAccounts();
  const bukuBesarData = getAllBukuBesar(periode);
  const summary = getBukuBesarSummaryByType(periode);
  
  console.log(`📋 Found ${bukuBesarData.length} accounts with transactions in Buku Besar`);
  
  // Create account balance map from Buku Besar
  const accountBalances = new Map<string, number>();
  bukuBesarData.forEach(bukuBesar => {
    accountBalances.set(bukuBesar.coaId, bukuBesar.saldoAkhir);
  });
  
  // Generate Aset items
  const aset: PosisiKeuanganItem[] = accounts
    .filter(acc => acc.jenis === 'ASET' && acc.isActive)
    .map(acc => ({
      coaId: acc.id,
      kodeAkun: acc.kode,
      namaAkun: acc.nama,
      jumlah: accountBalances.get(acc.id) || 0,
      level: acc.level,
      isGroup: acc.isGroup
    }))
    .filter(item => item.jumlah > 0)
    .sort((a, b) => a.kodeAkun.localeCompare(b.kodeAkun));
  
  // Generate Kewajiban items
  const kewajiban: PosisiKeuanganItem[] = accounts
    .filter(acc => acc.jenis === 'KEWAJIBAN' && acc.isActive)
    .map(acc => ({
      coaId: acc.id,
      kodeAkun: acc.kode,
      namaAkun: acc.nama,
      jumlah: accountBalances.get(acc.id) || 0,
      level: acc.level,
      isGroup: acc.isGroup
    }))
    .filter(item => item.jumlah > 0)
    .sort((a, b) => a.kodeAkun.localeCompare(b.kodeAkun));
  
  // Generate Modal items
  const modal: PosisiKeuanganItem[] = accounts
    .filter(acc => acc.jenis === 'MODAL' && acc.isActive)
    .map(acc => ({
      coaId: acc.id,
      kodeAkun: acc.kode,
      namaAkun: acc.nama,
      jumlah: accountBalances.get(acc.id) || 0,
      level: acc.level,
      isGroup: acc.isGroup
    }))
    .filter(item => item.jumlah > 0)
    .sort((a, b) => a.kodeAkun.localeCompare(b.kodeAkun));
  
  const totalAset = summary.ASET?.saldoAkhir || 0;
  const totalKewajiban = summary.KEWAJIBAN?.saldoAkhir || 0;
  const totalModal = summary.MODAL?.saldoAkhir || 0;
  
  console.log(`💰 Posisi Keuangan totals - Aset: ${totalAset}, Kewajiban: ${totalKewajiban}, Modal: ${totalModal}`);
  
  return {
    periode,
    aset,
    kewajiban,
    modal,
    totalAset,
    totalKewajiban,
    totalModal
  };
}

/**
 * Generate Laporan Penghasilan Komprehensif (Statement of Comprehensive Income) using Buku Besar data
 */
export function generatePenghasilanKomprehensif(periode: string): PenghasilanKomprehensif {
  console.log(`📊 Generating Laporan Penghasilan Komprehensif for period ${periode}`);
  
  const accounts = getAllChartOfAccounts();
  const bukuBesarData = getAllBukuBesar(periode);
  const summary = getBukuBesarSummaryByType(periode);
  
  // Create account balance map from Buku Besar
  const accountBalances = new Map<string, number>();
  bukuBesarData.forEach(bukuBesar => {
    accountBalances.set(bukuBesar.coaId, bukuBesar.saldoAkhir);
  });
  
  // Generate Pendapatan items
  const pendapatan: PenghasilanKomprehensifItem[] = accounts
    .filter(acc => acc.jenis === 'PENDAPATAN' && acc.isActive)
    .map(acc => ({
      coaId: acc.id,
      kodeAkun: acc.kode,
      namaAkun: acc.nama,
      jumlah: accountBalances.get(acc.id) || 0,
      level: acc.level,
      isGroup: acc.isGroup
    }))
    .filter(item => item.jumlah > 0)
    .sort((a, b) => a.kodeAkun.localeCompare(b.kodeAkun));
  
  // Generate Beban items
  const beban: PenghasilanKomprehensifItem[] = accounts
    .filter(acc => acc.jenis === 'BEBAN' && acc.isActive)
    .map(acc => ({
      coaId: acc.id,
      kodeAkun: acc.kode,
      namaAkun: acc.nama,
      jumlah: accountBalances.get(acc.id) || 0,
      level: acc.level,
      isGroup: acc.isGroup
    }))
    .filter(item => item.jumlah > 0)
    .sort((a, b) => a.kodeAkun.localeCompare(b.kodeAkun));
  
  const totalPendapatan = summary.PENDAPATAN?.saldoAkhir || 0;
  const totalBeban = summary.BEBAN?.saldoAkhir || 0;
  const labaKotor = totalPendapatan - totalBeban;
  const labaBersih = labaKotor;
  
  console.log(`💹 Penghasilan Komprehensif totals - Pendapatan: ${totalPendapatan}, Beban: ${totalBeban}, Laba Bersih: ${labaBersih}`);
  
  return {
    periode,
    pendapatan,
    beban,
    totalPendapatan,
    totalBeban,
    labaKotor,
    labaBersih
  };
}

/**
 * Generate Arus Kas (Cash Flow Statement) based on cash account movements
 */
export function generateArusKas(periode: string): ArusKas {
  const accounts = getAllChartOfAccounts();
  const bukuBesarData = getAllBukuBesar(periode);
  
  // Find cash accounts (assuming code starts with 1000)
  const cashAccounts = accounts.filter(acc => 
    acc.jenis === 'ASET' && acc.kode.startsWith('1000')
  );
  
  const kasAwal = 0; // Could be enhanced to get from previous period
  
  // Simplified cash flow calculation based on cash account movements
  const operasional: ArusKasItem[] = [];
  const investasi: ArusKasItem[] = [];
  const pendanaan: ArusKasItem[] = [];
  
  // Analyze cash movements from Buku Besar
  bukuBesarData
    .filter(bb => cashAccounts.some(ca => ca.id === bb.coaId))
    .forEach(bukuBesar => {
      bukuBesar.transaksi.forEach(transaksi => {
        const netCashFlow = transaksi.debit - transaksi.kredit;
        if (Math.abs(netCashFlow) > 0) {
          operasional.push({
            deskripsi: transaksi.keterangan,
            jumlah: Math.abs(netCashFlow),
            jenis: netCashFlow > 0 ? "MASUK" : "KELUAR"
          });
        }
      });
    });
  
  const totalOperasionalMasuk = operasional.filter(op => op.jenis === "MASUK").reduce((sum, op) => sum + op.jumlah, 0);
  const totalOperasionalKeluar = operasional.filter(op => op.jenis === "KELUAR").reduce((sum, op) => sum + op.jumlah, 0);
  const perubahanKas = totalOperasionalMasuk - totalOperasionalKeluar;
  const kasAkhir = kasAwal + perubahanKas;
  
  return {
    periode,
    operasional,
    investasi,
    pendanaan,
    kasAwal,
    kasAkhir,
    perubahanKas
  };
}

/**
 * Generate Perubahan Modal (Statement of Changes in Equity)
 */
export function generatePerubahanModal(periode: string): PerubahanModal {
  const summary = getBukuBesarSummaryByType(periode);
  const penghasilanKomprehensif = generatePenghasilanKomprehensif(periode);
  
  const modalAwal = 0; // Could be enhanced to get from previous period
  
  const penambahan: PerubahanModalItem[] = [
    { deskripsi: "Laba bersih periode berjalan", jumlah: Math.max(0, penghasilanKomprehensif.labaBersih) }
  ];
  
  const pengurangan: PerubahanModalItem[] = [
    { deskripsi: "Rugi periode berjalan", jumlah: Math.max(0, -labaRugi.labaBersih) }
  ];
  
  const totalPenambahan = penambahan.reduce((sum, item) => sum + item.jumlah, 0);
  const totalPengurangan = pengurangan.reduce((sum, item) => sum + item.jumlah, 0);
  const modalAkhir = modalAwal + totalPenambahan - totalPengurangan;
  
  return {
    periode,
    modalAwal,
    penambahan,
    pengurangan,
    totalPenambahan,
    totalPengurangan,
    modalAkhir
  };
}
