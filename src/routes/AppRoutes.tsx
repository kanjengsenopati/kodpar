
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AuthGuard } from '@/components/auth/AuthGuard';

// Index page
import Index from '@/pages/Index';

// Dashboard
import { VisualDashboard } from '@/pages/Dashboard';

// Auth pages
import LoginPage from '@/pages/Auth/LoginPage';
import AnggotaLoginPage from '@/pages/Auth/AnggotaLoginPage';

// Master Data
import AnggotaList from '@/pages/Anggota/AnggotaList';
import AnggotaForm from '@/pages/Anggota/AnggotaForm';
import AnggotaDetail from '@/pages/Anggota/AnggotaDetail';
import UnitKerjaList from '@/pages/UnitKerja/UnitKerjaList';

// Transaksi
import TransaksiList from '@/pages/Transaksi/TransaksiList';
import TransaksiForm from '@/pages/Transaksi/TransaksiForm';

// Simpan
import SimpanList from '@/pages/Transaksi/Simpan/SimpanList';
import SimpanForm from '@/pages/Transaksi/Simpan/SimpanForm';
import SimpanDetailPage from '@/pages/Transaksi/Simpan/SimpanDetailPage';
import SimpanEditForm from '@/pages/Transaksi/Simpan/SimpanEditForm';

// Pinjam
import PinjamList from '@/pages/Transaksi/Pinjam/PinjamList';
import PinjamForm from '@/pages/Transaksi/Pinjam/PinjamForm';
import PinjamDetail from '@/pages/Transaksi/Pinjam/PinjamDetail';
import PinjamEditForm from '@/pages/Transaksi/Pinjam/PinjamEditForm';

// Pengajuan
import PengajuanList from '@/pages/Transaksi/Pengajuan/PengajuanList';
import PengajuanForm from '@/pages/Transaksi/Pengajuan/PengajuanForm';
import PengajuanDetail from '@/pages/Transaksi/Pengajuan/PengajuanDetail';
import PengajuanEditForm from '@/pages/Transaksi/Pengajuan/PengajuanEditForm';

// Angsuran
import AngsuranList from '@/pages/Transaksi/Angsuran/AngsuranList';
import AngsuranForm from '@/pages/Transaksi/Angsuran/AngsuranForm';
import AngsuranDetail from '@/pages/Transaksi/Angsuran/AngsuranDetail';
import AngsuranEditForm from '@/pages/Transaksi/Angsuran/AngsuranEditForm';

// Penarikan
import PenarikanList from '@/pages/Transaksi/Penarikan/PenarikanList';
import PenarikanForm from '@/pages/Transaksi/Penarikan/PenarikanForm';
import PenarikanDetailPage from '@/pages/Transaksi/Penarikan/PenarikanDetailPage';
import PenarikanEditForm from '@/pages/Transaksi/Penarikan/PenarikanEditForm';

// Other pages
import JenisPage from '@/pages/Transaksi/Jenis/JenisPage';
import LaporanPage from '@/pages/Keuangan/LaporanPage';
import KategoriTransaksi from '@/pages/Keuangan/KategoriTransaksi';
import TransaksiKeuangan from '@/pages/Keuangan/TransaksiList';
import LaporanKeuangan from '@/pages/Keuangan/LaporanKeuangan';
import QuickAccessPage from '@/pages/QuickAccess/QuickAccessPage';
import PengaturanPage from '@/pages/Pengaturan/PengaturanPage';
import PenggunaPenanPage from '@/pages/Pengaturan/PenggunaPenanPage';
import AlgoritmaPage from '@/pages/Pengaturan/AlgoritmaPage';
import AuditTrail from '@/pages/Pengaturan/AuditTrail';
import ResetData from '@/pages/Pengaturan/ResetData';
import NotFound from '@/pages/NotFound';
import Laporan from '@/pages/Laporan/Laporan';

// Akuntansi
import AkuntansiIndex from '@/pages/Akuntansi/index';
import AkuntansiTabs from '@/pages/Akuntansi/AkuntansiTabs';
import ChartOfAccounts from '@/pages/Akuntansi/ChartOfAccounts';
import JurnalUmum from '@/pages/Akuntansi/JurnalUmum';
import BukuBesar from '@/pages/Akuntansi/BukuBesar';
import LaporanKeuanganAkuntansi from '@/pages/Akuntansi/LaporanKeuangan';

// Import pages
import ImportAnggota from '@/pages/Import/ImportAnggota';
import ImportTransaksi from '@/pages/Import/ImportTransaksi';

// POS pages
import POSIndex from '@/pages/POS/POSIndex';
import Inventori from '@/pages/POS/Inventori';
import Pemasok from '@/pages/POS/Pemasok';
import Pembelian from '@/pages/POS/Pembelian';
import Penjualan from '@/pages/POS/Penjualan';
import PenjualanKasir from '@/pages/POS/PenjualanKasir';
import PenjualanList from '@/pages/POS/PenjualanList';
import PenjualanDetail from '@/pages/POS/PenjualanDetail';
import StokBarang from '@/pages/POS/StokBarang';
import KategoriBarang from '@/pages/POS/KategoriBarang';
import NamaKasir from '@/pages/POS/NamaKasir';
import KuitansiPembayaran from '@/pages/POS/KuitansiPembayaran';
import LaporanJualBeli from '@/pages/POS/LaporanJualBeli';
import LaporanRugiLaba from '@/pages/POS/LaporanRugiLaba';
import ReturPOS from '@/pages/POS/ReturPOS';
import RiwayatTransaksi from '@/pages/POS/RiwayatTransaksi';

// Manufaktur
import ManufakturDashboard from '@/pages/Manufaktur/ManufakturDashboard';
import BOMList from '@/pages/Manufaktur/BOMList';
import BOMForm from '@/pages/Manufaktur/BOMForm';
import BOMDetail from '@/pages/Manufaktur/BOMDetail';
import WorkOrderList from '@/pages/Manufaktur/WorkOrderList';
import WorkOrderForm from '@/pages/Manufaktur/WorkOrderForm';
import WorkOrderDetail from '@/pages/Manufaktur/WorkOrderDetail';
import ProductionPlanList from '@/pages/Manufaktur/ProductionPlanList';
import ProductionPlanForm from '@/pages/Manufaktur/ProductionPlanForm';
import ProductionPlanDetail from '@/pages/Manufaktur/ProductionPlanDetail';
import QualityControlList from '@/pages/Manufaktur/QualityControlList';
import QualityControlForm from '@/pages/Manufaktur/QualityControlForm';
import QualityControlDetail from '@/pages/Manufaktur/QualityControlDetail';
import InventoryList from '@/pages/Manufaktur/InventoryList';

export function AppRoutes() {
  return (
    <Routes>
      {/* Root route - handles authentication redirect */}
      <Route path="/" element={<Index />} />
      
      {/* Public routes - Login pages */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/anggota/login" element={<AnggotaLoginPage />} />

      {/* Protected routes - All other pages require authentication */}
      <Route path="/dashboard" element={
        <AuthGuard>
          <VisualDashboard />
        </AuthGuard>
      } />
      
      {/* Master Data Routes - Organized with specific routes first */}
      <Route path="/master/unit-kerja" element={
        <AuthGuard>
          <UnitKerjaList />
        </AuthGuard>
      } />
      
      {/* Master Anggota Routes - Most specific routes first */}
      <Route path="/master/anggota/tambah" element={
        <AuthGuard>
          <AnggotaForm />
        </AuthGuard>
      } />
      <Route path="/master/anggota/edit/:id" element={
        <AuthGuard>
          <AnggotaForm />
        </AuthGuard>
      } />
      <Route path="/master/anggota/:id" element={
        <AuthGuard>
          <AnggotaDetail />
        </AuthGuard>
      } />
      <Route path="/master/anggota" element={
        <AuthGuard>
          <AnggotaList />
        </AuthGuard>
      } />
      
      {/* Anggota Routes - Most specific routes first */}
      <Route path="/anggota/tambah" element={
        <AuthGuard>
          <AnggotaForm />
        </AuthGuard>
      } />
      <Route path="/anggota/edit/:id" element={
        <AuthGuard>
          <AnggotaForm />
        </AuthGuard>
      } />
      <Route path="/anggota/:id" element={
        <AuthGuard>
          <AnggotaDetail />
        </AuthGuard>
      } />
      <Route path="/anggota" element={
        <AuthGuard>
          <AnggotaList />
        </AuthGuard>
      } />
      
      {/* Main Transaksi Routes */}
      <Route path="/transaksi/tambah" element={
        <AuthGuard>
          <TransaksiForm />
        </AuthGuard>
      } />
      <Route path="/transaksi" element={
        <AuthGuard>
          <TransaksiList />
        </AuthGuard>
      } />
      
      {/* Transaksi Jenis Routes */}
      <Route path="/transaksi/jenis" element={
        <AuthGuard>
          <JenisPage />
        </AuthGuard>
      } />
      
      {/* Pengajuan Routes - Most specific routes first */}
      <Route path="/transaksi/pengajuan/tambah" element={
        <AuthGuard>
          <PengajuanForm />
        </AuthGuard>
      } />
      <Route path="/transaksi/pengajuan/:id/edit" element={
        <AuthGuard>
          <PengajuanEditForm />
        </AuthGuard>
      } />
      <Route path="/transaksi/pengajuan/:id" element={
        <AuthGuard>
          <PengajuanDetail />
        </AuthGuard>
      } />
      <Route path="/transaksi/pengajuan" element={
        <AuthGuard>
          <PengajuanList />
        </AuthGuard>
      } />
      
      {/* Simpan Routes - Most specific routes first - FIXED ORDER */}
      <Route path="/transaksi/simpan/tambah" element={
        <AuthGuard>
          <SimpanForm />
        </AuthGuard>
      } />
      <Route path="/transaksi/simpan/edit/:id" element={
        <AuthGuard>
          <SimpanEditForm />
        </AuthGuard>
      } />
      <Route path="/transaksi/simpan/:id" element={
        <AuthGuard>
          <SimpanDetailPage />
        </AuthGuard>
      } />
      <Route path="/transaksi/simpan" element={
        <AuthGuard>
          <SimpanList />
        </AuthGuard>
      } />
      
      {/* Pinjam Routes - Most specific routes first */}
      <Route path="/transaksi/pinjam/tambah" element={
        <AuthGuard>
          <PinjamForm />
        </AuthGuard>
      } />
      <Route path="/transaksi/pinjam/:id/edit" element={
        <AuthGuard>
          <PinjamEditForm />
        </AuthGuard>
      } />
      <Route path="/transaksi/pinjam/:id" element={
        <AuthGuard>
          <PinjamDetail />
        </AuthGuard>
      } />
      <Route path="/transaksi/pinjam" element={
        <AuthGuard>
          <PinjamList />
        </AuthGuard>
      } />
      
      {/* Penarikan Routes - Most specific routes first */}
      <Route path="/transaksi/penarikan/tambah" element={
        <AuthGuard>
          <PenarikanForm />
        </AuthGuard>
      } />
      <Route path="/transaksi/penarikan/:id/edit" element={
        <AuthGuard>
          <PenarikanEditForm />
        </AuthGuard>
      } />
      <Route path="/transaksi/penarikan/:id" element={
        <AuthGuard>
          <PenarikanDetailPage />
        </AuthGuard>
      } />
      <Route path="/transaksi/penarikan" element={
        <AuthGuard>
          <PenarikanList />
        </AuthGuard>
      } />
      
      {/* Angsuran Routes - Most specific routes first */}
      <Route path="/transaksi/angsuran/tambah" element={
        <AuthGuard>
          <AngsuranForm />
        </AuthGuard>
      } />
      <Route path="/transaksi/angsuran/:id/edit" element={
        <AuthGuard>
          <AngsuranEditForm />
        </AuthGuard>
      } />
      <Route path="/transaksi/angsuran/:id" element={
        <AuthGuard>
          <AngsuranDetail />
        </AuthGuard>
      } />
      <Route path="/transaksi/angsuran" element={
        <AuthGuard>
          <AngsuranList />
        </AuthGuard>
      } />

      {/* Shortcut Routes for Sidebar Navigation */}
      <Route path="/simpanan" element={
        <AuthGuard>
          <SimpanList />
        </AuthGuard>
      } />
      <Route path="/pinjaman" element={
        <AuthGuard>
          <PinjamList />
        </AuthGuard>
      } />

      {/* Laporan Routes */}
      <Route path="/laporan" element={
        <AuthGuard>
          <Laporan />
        </AuthGuard>
      } />

      {/* Keuangan Routes - Most specific first */}
      <Route path="/keuangan/kategori" element={
        <AuthGuard>
          <KategoriTransaksi />
        </AuthGuard>
      } />
      <Route path="/keuangan/transaksi" element={
        <AuthGuard>
          <TransaksiKeuangan />
        </AuthGuard>
      } />
      <Route path="/keuangan/laporan" element={
        <AuthGuard>
          <LaporanKeuangan />
        </AuthGuard>
      } />
      <Route path="/keuangan" element={
        <AuthGuard>
          <LaporanPage />
        </AuthGuard>
      } />

      {/* Quick Access */}
      <Route path="/akses-cepat" element={
        <AuthGuard>
          <QuickAccessPage />
        </AuthGuard>
      } />
      
      {/* Pengaturan Routes - Most specific first */}
      <Route path="/pengaturan/pengguna-peran" element={
        <AuthGuard>
          <PenggunaPenanPage />
        </AuthGuard>
      } />
      <Route path="/pengaturan/algoritma" element={
        <AuthGuard>
          <AlgoritmaPage />
        </AuthGuard>
      } />
      <Route path="/pengaturan/reset-data" element={
        <AuthGuard>
          <ResetData />
        </AuthGuard>
      } />
      <Route path="/pengaturan/audit-trail" element={
        <AuthGuard>
          <AuditTrail />
        </AuthGuard>
      } />
      <Route path="/pengaturan" element={
        <AuthGuard>
          <PengaturanPage />
        </AuthGuard>
      } />

      {/* Akuntansi Routes - Most specific routes first */}
      <Route path="/akuntansi/tabs" element={
        <AuthGuard>
          <AkuntansiTabs />
        </AuthGuard>
      } />
      <Route path="/akuntansi/chart-of-accounts" element={
        <AuthGuard>
          <ChartOfAccounts />
        </AuthGuard>
      } />
      <Route path="/akuntansi/jurnal-umum" element={
        <AuthGuard>
          <JurnalUmum />
        </AuthGuard>
      } />
      <Route path="/akuntansi/buku-besar" element={
        <AuthGuard>
          <BukuBesar />
        </AuthGuard>
      } />
      <Route path="/akuntansi/laporan-keuangan" element={
        <AuthGuard>
          <LaporanKeuanganAkuntansi />
        </AuthGuard>
      } />
      {/* ADD MISSING ALIAS ROUTES FOR AKUNTANSI */}
      <Route path="/akuntansi/jurnal" element={
        <AuthGuard>
          <JurnalUmum />
        </AuthGuard>
      } />
      <Route path="/akuntansi/laporan" element={
        <AuthGuard>
          <LaporanKeuanganAkuntansi />
        </AuthGuard>
      } />
      <Route path="/akuntansi" element={
        <AuthGuard>
          <AkuntansiIndex />
        </AuthGuard>
      } />

      {/* POS Routes - Most specific routes first */}
      <Route path="/pos/penjualan-list" element={
        <AuthGuard>
          <PenjualanList />
        </AuthGuard>
      } />
      <Route path="/pos/penjualan/:id" element={
        <AuthGuard>
          <PenjualanDetail />
        </AuthGuard>
      } />
      <Route path="/pos/inventori" element={
        <AuthGuard>
          <Inventori />
        </AuthGuard>
      } />
      <Route path="/pos/pemasok" element={
        <AuthGuard>
          <Pemasok />
        </AuthGuard>
      } />
      <Route path="/pos/pembelian" element={
        <AuthGuard>
          <Pembelian />
        </AuthGuard>
      } />
      <Route path="/pos/penjualan" element={
        <AuthGuard>
          <PenjualanKasir />
        </AuthGuard>
      } />
      <Route path="/pos/stok" element={
        <AuthGuard>
          <StokBarang />
        </AuthGuard>
      } />
      <Route path="/pos/kategori" element={
        <AuthGuard>
          <KategoriBarang />
        </AuthGuard>
      } />
      <Route path="/pos/kasir" element={
        <AuthGuard>
          <NamaKasir />
        </AuthGuard>
      } />
      <Route path="/pos/kuitansi" element={
        <AuthGuard>
          <KuitansiPembayaran />
        </AuthGuard>
      } />
      <Route path="/pos/laporan-jual-beli" element={
        <AuthGuard>
          <LaporanJualBeli />
        </AuthGuard>
      } />
      <Route path="/pos/laporan-rugi-laba" element={
        <AuthGuard>
          <LaporanRugiLaba />
        </AuthGuard>
      } />
      <Route path="/pos/retur" element={
        <AuthGuard>
          <ReturPOS />
        </AuthGuard>
      } />
      <Route path="/pos/riwayat" element={
        <AuthGuard>
          <RiwayatTransaksi />
        </AuthGuard>
      } />
      
      {/* POS Master Data placeholder route */}
      <Route path="/pos/master" element={
        <AuthGuard>
          <POSIndex />
        </AuthGuard>
      } />
      
      {/* POS Transaksi placeholder route */}
      <Route path="/pos/transaksi" element={
        <AuthGuard>
          <POSIndex />
        </AuthGuard>
      } />
      
      {/* POS Laporan placeholder route */}
      <Route path="/pos/laporan" element={
        <AuthGuard>
          <POSIndex />
        </AuthGuard>
      } />
      
      <Route path="/pos" element={
        <AuthGuard>
          <POSIndex />
        </AuthGuard>
      } />

      {/* Manufaktur Routes */}
      <Route path="/manufaktur" element={
        <AuthGuard><ManufakturDashboard /></AuthGuard>
      } />
      <Route path="/manufaktur/bom/tambah" element={
        <AuthGuard><BOMForm /></AuthGuard>
      } />
      <Route path="/manufaktur/bom/:id/edit" element={
        <AuthGuard><BOMForm /></AuthGuard>
      } />
      <Route path="/manufaktur/bom/:id" element={
        <AuthGuard><BOMDetail /></AuthGuard>
      } />
      <Route path="/manufaktur/bom" element={
        <AuthGuard><BOMList /></AuthGuard>
      } />

      {/* Manufaktur - Work Order Routes */}
      <Route path="/manufaktur/work-orders/tambah" element={
        <AuthGuard><WorkOrderForm /></AuthGuard>
      } />
      <Route path="/manufaktur/work-orders/:id/edit" element={
        <AuthGuard><WorkOrderForm /></AuthGuard>
      } />
      <Route path="/manufaktur/work-orders/:id" element={
        <AuthGuard><WorkOrderDetail /></AuthGuard>
      } />
      <Route path="/manufaktur/work-orders" element={
        <AuthGuard><WorkOrderList /></AuthGuard>
      } />

      {/* Manufaktur - Production Planning Routes */}
      <Route path="/manufaktur/production-plans/tambah" element={
        <AuthGuard><ProductionPlanForm /></AuthGuard>
      } />
      <Route path="/manufaktur/production-plans/:id/edit" element={
        <AuthGuard><ProductionPlanForm /></AuthGuard>
      } />
      <Route path="/manufaktur/production-plans/:id" element={
        <AuthGuard><ProductionPlanDetail /></AuthGuard>
      } />
      <Route path="/manufaktur/production-plans" element={
        <AuthGuard><ProductionPlanList /></AuthGuard>
      } />

      {/* Manufaktur - Quality Control Routes */}
      <Route path="/manufaktur/quality-control/tambah" element={
        <AuthGuard><QualityControlForm /></AuthGuard>
      } />
      <Route path="/manufaktur/quality-control/:id/edit" element={
        <AuthGuard><QualityControlForm /></AuthGuard>
      } />
      <Route path="/manufaktur/quality-control/:id" element={
        <AuthGuard><QualityControlDetail /></AuthGuard>
      } />
      <Route path="/manufaktur/quality-control" element={
        <AuthGuard><QualityControlList /></AuthGuard>
      } />

      {/* Manufaktur - Inventory Routes */}
      <Route path="/manufaktur/inventory" element={
        <AuthGuard><InventoryList /></AuthGuard>
      } />

      <Route path="/import/anggota" element={
        <AuthGuard>
          <ImportAnggota />
        </AuthGuard>
      } />
      <Route path="/import/transaksi" element={
        <AuthGuard>
          <ImportTransaksi />
        </AuthGuard>
      } />

      {/* 404 - Not Found - Must be last */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
