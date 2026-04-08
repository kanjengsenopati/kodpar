
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import DataAnggota from '@/pages/Master/DataAnggota';
import TambahAnggota from '@/pages/Master/TambahAnggota';
import EditAnggota from '@/pages/Master/EditAnggota';
import DetailAnggota from '@/pages/Master/DetailAnggota';
import UnitKerja from '@/pages/Master/UnitKerja';
import Transaksi from '@/pages/Transaksi/Transaksi';
import JenisTransaksi from '@/pages/Transaksi/JenisTransaksi';
import Pengajuan from '@/pages/Transaksi/Pengajuan';
import TambahPengajuan from '@/pages/Transaksi/TambahPengajuan';
import EditPengajuan from '@/pages/Transaksi/EditPengajuan';
import DetailPengajuan from '@/pages/Transaksi/DetailPengajuan';
import TransaksiSimpan from '@/pages/Transaksi/TransaksiSimpan';
import TambahSimpan from '@/pages/Transaksi/TambahSimpan';
import EditSimpan from '@/pages/Transaksi/EditSimpan';
import TransaksiPinjam from '@/pages/Transaksi/TransaksiPinjam';
import TambahPinjam from '@/pages/Transaksi/TambahPinjam';
import EditPinjam from '@/pages/Transaksi/EditPinjam';
import TransaksiAngsuran from '@/pages/Transaksi/TransaksiAngsuran';
import TambahAngsuran from '@/pages/Transaksi/TambahAngsuran';
import EditAngsuran from '@/pages/Transaksi/EditAngsuran';
import TransaksiPenarikan from '@/pages/Transaksi/TransaksiPenarikan';
import TambahPenarikan from '@/pages/Transaksi/TambahPenarikan';
import EditPenarikan from '@/pages/Transaksi/EditPenarikan';
import Keuangan from '@/pages/Keuangan/Keuangan';
import KategoriTransaksi from '@/pages/Keuangan/KategoriTransaksi';
import TransaksiKeuangan from '@/pages/Keuangan/TransaksiKeuangan';
import TambahTransaksiKeuangan from '@/pages/Keuangan/TambahTransaksiKeuangan';
import EditTransaksiKeuangan from '@/pages/Keuangan/EditTransaksiKeuangan';
import LaporanArusKas from '@/pages/Keuangan/LaporanArusKas';
import Laporan from '@/pages/Laporan/Laporan';
import Akuntansi from '@/pages/Akuntansi/Akuntansi';
import JurnalUmum from '@/pages/Akuntansi/JurnalUmum';
import BukuBesar from '@/pages/Akuntansi/BukuBesar';
import NeracaSaldo from '@/pages/Akuntansi/NeracaSaldo';
import LabaRugi from '@/pages/Akuntansi/LabaRugi';
import Neraca from '@/pages/Akuntansi/Neraca';
import ArusKas from '@/pages/Akuntansi/ArusKas';
import ChartOfAccounts from '@/pages/Akuntansi/ChartOfAccounts';
import Pengaturan from '@/pages/Pengaturan/Pengaturan';
import ResetData from '@/pages/Pengaturan/ResetData';
import PenggunaPeran from '@/pages/Pengaturan/PenggunaPeran';
import Algoritma from '@/pages/Pengaturan/Algoritma';
import AuditTrail from '@/pages/Pengaturan/AuditTrail';
import ImportAnggota from '@/pages/Import/ImportAnggota';
import ImportTransaksi from '@/pages/Import/ImportTransaksi';
import AksesCepat from '@/pages/AksesCepat';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/akses-cepat" element={<AksesCepat />} />
      
      {/* Master Data Routes */}
      <Route path="/master/anggota" element={<DataAnggota />} />
      <Route path="/master/anggota/tambah" element={<TambahAnggota />} />
      <Route path="/master/anggota/edit/:id" element={<EditAnggota />} />
      <Route path="/master/anggota/detail/:id" element={<DetailAnggota />} />
      <Route path="/master/unit-kerja" element={<UnitKerja />} />
      
      {/* Transaksi Routes */}
      <Route path="/transaksi" element={<Transaksi />} />
      <Route path="/transaksi/jenis" element={<JenisTransaksi />} />
      <Route path="/transaksi/pengajuan" element={<Pengajuan />} />
      <Route path="/transaksi/pengajuan/tambah" element={<TambahPengajuan />} />
      <Route path="/transaksi/pengajuan/edit/:id" element={<EditPengajuan />} />
      <Route path="/transaksi/pengajuan/detail/:id" element={<DetailPengajuan />} />
      <Route path="/transaksi/simpan" element={<TransaksiSimpan />} />
      <Route path="/transaksi/simpan/tambah" element={<TambahSimpan />} />
      <Route path="/transaksi/simpan/edit/:id" element={<EditSimpan />} />
      <Route path="/transaksi/pinjam" element={<TransaksiPinjam />} />
      <Route path="/transaksi/pinjam/tambah" element={<TambahPinjam />} />
      <Route path="/transaksi/pinjam/edit/:id" element={<EditPinjam />} />
      <Route path="/transaksi/angsuran" element={<TransaksiAngsuran />} />
      <Route path="/transaksi/angsuran/tambah" element={<TambahAngsuran />} />
      <Route path="/transaksi/angsuran/edit/:id" element={<EditAngsuran />} />
      <Route path="/transaksi/penarikan" element={<TransaksiPenarikan />} />
      <Route path="/transaksi/penarikan/tambah" element={<TambahPenarikan />} />
      <Route path="/transaksi/penarikan/edit/:id" element={<EditPenarikan />} />
      
      {/* Keuangan Routes */}
      <Route path="/keuangan" element={<Keuangan />} />
      <Route path="/keuangan/kategori" element={<KategoriTransaksi />} />
      <Route path="/keuangan/transaksi" element={<TransaksiKeuangan />} />
      <Route path="/keuangan/transaksi/tambah" element={<TambahTransaksiKeuangan />} />
      <Route path="/keuangan/transaksi/edit/:id" element={<EditTransaksiKeuangan />} />
      <Route path="/keuangan/laporan" element={<LaporanArusKas />} />
      
      {/* Laporan Routes */}
      <Route path="/laporan" element={<Laporan />} />
      
      {/* Akuntansi Routes */}
      <Route path="/akuntansi" element={<Akuntansi />} />
      <Route path="/akuntansi/jurnal" element={<JurnalUmum />} />
      <Route path="/akuntansi/buku-besar" element={<BukuBesar />} />
      <Route path="/akuntansi/neraca-saldo" element={<NeracaSaldo />} />
      <Route path="/akuntansi/laba-rugi" element={<LabaRugi />} />
      <Route path="/akuntansi/neraca" element={<Neraca />} />
      <Route path="/akuntansi/arus-kas" element={<ArusKas />} />
      <Route path="/akuntansi/chart-of-accounts" element={<ChartOfAccounts />} />
      
      {/* Pengaturan Routes */}
      <Route path="/pengaturan" element={<Pengaturan />} />
      <Route path="/pengaturan/reset-data" element={<ResetData />} />
      <Route path="/pengaturan/pengguna-peran" element={<PenggunaPeran />} />
      <Route path="/pengaturan/algoritma" element={<Algoritma />} />
      <Route path="/pengaturan/audit-trail" element={<AuditTrail />} />
      
      {/* Import Routes */}
      <Route path="/import/anggota" element={<ImportAnggota />} />
      <Route path="/import/transaksi" element={<ImportTransaksi />} />
    </Routes>
  );
};
