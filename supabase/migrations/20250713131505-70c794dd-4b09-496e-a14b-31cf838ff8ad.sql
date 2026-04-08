-- Phase 1: Core Database Schema Migration for KPRI BANGUN System

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE public.app_role AS ENUM ('superadmin', 'admin', 'staff', 'anggota');
CREATE TYPE public.jenis_kelamin AS ENUM ('Laki-laki', 'Perempuan');
CREATE TYPE public.status_pernikahan AS ENUM ('Belum Menikah', 'Menikah', 'Cerai');
CREATE TYPE public.jenis_transaksi AS ENUM ('SIMPANAN', 'PENARIKAN', 'PINJAMAN', 'ANGSURAN');
CREATE TYPE public.status_pengajuan AS ENUM ('PENDING', 'DISETUJUI', 'DITOLAK');
CREATE TYPE public.jenis_akun AS ENUM ('ASET', 'KEWAJIBAN', 'MODAL', 'PENDAPATAN', 'BEBAN');

-- 1. User Profiles Table (linked to auth.users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    nama TEXT NOT NULL,
    email TEXT NOT NULL,
    foto TEXT,
    jabatan TEXT,
    no_hp TEXT,
    alamat TEXT,
    role_id TEXT NOT NULL DEFAULT 'anggota',
    anggota_id TEXT,
    aktif BOOLEAN NOT NULL DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 2. User Roles Table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    assigned_by UUID REFERENCES auth.users(id),
    UNIQUE (user_id, role)
);

-- 3. Permissions Table
CREATE TABLE public.permissions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    module TEXT NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('read', 'create', 'update', 'delete', 'all')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 4. Role Permissions Table
CREATE TABLE public.role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role app_role NOT NULL,
    permission_id TEXT REFERENCES public.permissions(id) ON DELETE CASCADE,
    granted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE (role, permission_id)
);

-- 5. Unit Kerja (Work Units)
CREATE TABLE public.unit_kerja (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode TEXT UNIQUE NOT NULL,
    nama TEXT NOT NULL,
    deskripsi TEXT,
    aktif BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 6. Anggota (Members)
CREATE TABLE public.anggota (
    id TEXT PRIMARY KEY,
    nama TEXT NOT NULL,
    nip TEXT,
    jenis_kelamin jenis_kelamin,
    tempat_lahir TEXT,
    tanggal_lahir DATE,
    alamat TEXT,
    no_hp TEXT,
    email TEXT,
    status_pernikahan status_pernikahan,
    nama_pasangan TEXT,
    unit_kerja_id UUID REFERENCES public.unit_kerja(id),
    foto TEXT,
    tanggal_bergabung DATE NOT NULL DEFAULT CURRENT_DATE,
    status_keanggotaan TEXT NOT NULL DEFAULT 'AKTIF',
    simpanan_pokok DECIMAL(15,2) NOT NULL DEFAULT 0,
    simpanan_wajib DECIMAL(15,2) NOT NULL DEFAULT 0,
    simpanan_sukarela DECIMAL(15,2) NOT NULL DEFAULT 0,
    total_simpanan DECIMAL(15,2) NOT NULL DEFAULT 0,
    total_pinjaman DECIMAL(15,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 7. Kategori Transaksi
CREATE TABLE public.kategori_transaksi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama TEXT NOT NULL,
    jenis jenis_transaksi NOT NULL,
    deskripsi TEXT,
    akun_debit TEXT,
    akun_kredit TEXT,
    aktif BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 8. Transaksi (Main Transactions)
CREATE TABLE public.transaksi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nomor_transaksi TEXT UNIQUE NOT NULL,
    anggota_id TEXT NOT NULL REFERENCES public.anggota(id),
    jenis jenis_transaksi NOT NULL,
    kategori_id UUID REFERENCES public.kategori_transaksi(id),
    jumlah DECIMAL(15,2) NOT NULL,
    deskripsi TEXT,
    tanggal_transaksi TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    petugas_id UUID REFERENCES auth.users(id),
    status TEXT NOT NULL DEFAULT 'COMPLETED',
    jurnal_id UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 9. Pengajuan (Loan Applications)
CREATE TABLE public.pengajuan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nomor_pengajuan TEXT UNIQUE NOT NULL,
    anggota_id TEXT NOT NULL REFERENCES public.anggota(id),
    jenis_pengajuan TEXT NOT NULL,
    jumlah_pengajuan DECIMAL(15,2) NOT NULL,
    tujuan TEXT,
    jangka_waktu INTEGER, -- in months
    tingkat_bunga DECIMAL(5,4),
    status status_pengajuan NOT NULL DEFAULT 'PENDING',
    tanggal_pengajuan TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    tanggal_diproses TIMESTAMP WITH TIME ZONE,
    diproses_oleh UUID REFERENCES auth.users(id),
    catatan_persetujuan TEXT,
    agunan TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 10. Chart of Accounts (for SAK ETAP compliance)
CREATE TABLE public.chart_of_accounts (
    kode TEXT PRIMARY KEY,
    nama TEXT NOT NULL,
    jenis_akun jenis_akun NOT NULL,
    parent_kode TEXT REFERENCES public.chart_of_accounts(kode),
    level INTEGER NOT NULL DEFAULT 1,
    saldo_normal TEXT NOT NULL CHECK (saldo_normal IN ('DEBIT', 'KREDIT')),
    aktif BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 11. Jurnal Entries
CREATE TABLE public.jurnal_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nomor_jurnal TEXT UNIQUE NOT NULL,
    tanggal_jurnal DATE NOT NULL,
    deskripsi TEXT NOT NULL,
    referensi TEXT,
    total_debit DECIMAL(15,2) NOT NULL DEFAULT 0,
    total_kredit DECIMAL(15,2) NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'DRAFT',
    dibuat_oleh UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 12. Jurnal Details
CREATE TABLE public.jurnal_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    jurnal_id UUID NOT NULL REFERENCES public.jurnal_entries(id) ON DELETE CASCADE,
    akun_kode TEXT NOT NULL REFERENCES public.chart_of_accounts(kode),
    deskripsi TEXT,
    debit DECIMAL(15,2) NOT NULL DEFAULT 0,
    kredit DECIMAL(15,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 13. Produk (Inventory/Products for POS)
CREATE TABLE public.produk (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode_produk TEXT UNIQUE NOT NULL,
    nama TEXT NOT NULL,
    deskripsi TEXT,
    kategori TEXT,
    satuan TEXT NOT NULL,
    harga_beli DECIMAL(15,2),
    harga_jual DECIMAL(15,2) NOT NULL,
    stok_minimum INTEGER DEFAULT 0,
    stok_saat_ini INTEGER DEFAULT 0,
    foto TEXT,
    aktif BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 14. Pemasok (Suppliers)
CREATE TABLE public.pemasok (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode_pemasok TEXT UNIQUE NOT NULL,
    nama TEXT NOT NULL,
    alamat TEXT,
    no_hp TEXT,
    email TEXT,
    kontak_person TEXT,
    aktif BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 15. Pembelian (Purchases)
CREATE TABLE public.pembelian (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nomor_pembelian TEXT UNIQUE NOT NULL,
    pemasok_id UUID REFERENCES public.pemasok(id),
    tanggal_pembelian DATE NOT NULL,
    total_pembelian DECIMAL(15,2) NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'PENDING',
    petugas_id UUID REFERENCES auth.users(id),
    catatan TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 16. Detail Pembelian
CREATE TABLE public.detail_pembelian (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pembelian_id UUID NOT NULL REFERENCES public.pembelian(id) ON DELETE CASCADE,
    produk_id UUID NOT NULL REFERENCES public.produk(id),
    jumlah INTEGER NOT NULL,
    harga_satuan DECIMAL(15,2) NOT NULL,
    subtotal DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 17. Penjualan (Sales)
CREATE TABLE public.penjualan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nomor_penjualan TEXT UNIQUE NOT NULL,
    anggota_id TEXT REFERENCES public.anggota(id),
    tanggal_penjualan TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    total_penjualan DECIMAL(15,2) NOT NULL DEFAULT 0,
    diskon DECIMAL(15,2) DEFAULT 0,
    total_bayar DECIMAL(15,2) NOT NULL,
    metode_pembayaran TEXT NOT NULL DEFAULT 'TUNAI',
    kasir_id UUID REFERENCES auth.users(id),
    status TEXT NOT NULL DEFAULT 'COMPLETED',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 18. Detail Penjualan
CREATE TABLE public.detail_penjualan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    penjualan_id UUID NOT NULL REFERENCES public.penjualan(id) ON DELETE CASCADE,
    produk_id UUID NOT NULL REFERENCES public.produk(id),
    jumlah INTEGER NOT NULL,
    harga_satuan DECIMAL(15,2) NOT NULL,
    subtotal DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 19. Pengaturan (System Settings)
CREATE TABLE public.pengaturan (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    deskripsi TEXT,
    kategori TEXT,
    tipe_data TEXT NOT NULL DEFAULT 'string',
    updated_by UUID REFERENCES auth.users(id),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 20. Audit Trail
CREATE TABLE public.audit_trail (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tabel_name TEXT NOT NULL,
    action TEXT NOT NULL,
    data_lama JSONB,
    data_baru JSONB,
    user_id UUID REFERENCES auth.users(id),
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_profiles_username ON public.profiles(username);
CREATE INDEX idx_profiles_anggota_id ON public.profiles(anggota_id);
CREATE INDEX idx_anggota_unit_kerja ON public.anggota(unit_kerja_id);
CREATE INDEX idx_transaksi_anggota ON public.transaksi(anggota_id);
CREATE INDEX idx_transaksi_tanggal ON public.transaksi(tanggal_transaksi);
CREATE INDEX idx_jurnal_tanggal ON public.jurnal_entries(tanggal_jurnal);
CREATE INDEX idx_penjualan_tanggal ON public.penjualan(tanggal_penjualan);
CREATE INDEX idx_audit_timestamp ON public.audit_trail(timestamp);

-- Update timestamps trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_anggota_updated_at BEFORE UPDATE ON public.anggota FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_unit_kerja_updated_at BEFORE UPDATE ON public.unit_kerja FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_transaksi_updated_at BEFORE UPDATE ON public.transaksi FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pengajuan_updated_at BEFORE UPDATE ON public.pengajuan FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_chart_of_accounts_updated_at BEFORE UPDATE ON public.chart_of_accounts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_jurnal_entries_updated_at BEFORE UPDATE ON public.jurnal_entries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_produk_updated_at BEFORE UPDATE ON public.produk FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pemasok_updated_at BEFORE UPDATE ON public.pemasok FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pembelian_updated_at BEFORE UPDATE ON public.pembelian FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();