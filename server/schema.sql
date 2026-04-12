-- Koperasi SaaS Database Schema (PostgreSQL) - COMPREHENSIVE
-- Single Source of Truth for Kanjeng Senopati Koperasi

-- 0. CLEAN SLATE (Optional for Seeding)
DROP TABLE IF EXISTS jurnal_detail CASCADE;
DROP TABLE IF EXISTS jurnal CASCADE;
DROP TABLE IF EXISTS coa CASCADE;
DROP TABLE IF EXISTS jadwal_angsuran CASCADE;
DROP TABLE IF EXISTS transaksi CASCADE;
DROP TABLE IF EXISTS anggota CASCADE;

-- 1. ANGGOTA
CREATE TABLE IF NOT EXISTS anggota (

    id UUID PRIMARY KEY,
    no_anggota TEXT UNIQUE NOT NULL,
    nama TEXT NOT NULL,
    nip TEXT,
    alamat TEXT,
    no_hp TEXT,
    jenis_kelamin TEXT,
    status TEXT DEFAULT 'active',
    unit_kerja TEXT,
    tanggal_bergabung DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. TRANSAKSI
CREATE TABLE IF NOT EXISTS transaksi (
    id UUID PRIMARY KEY,
    nomor_transaksi TEXT UNIQUE NOT NULL,
    tanggal DATE NOT NULL,
    jenis TEXT NOT NULL CHECK (jenis IN ('Simpan', 'Pinjam', 'Angsuran', 'Penarikan')),
    kategori TEXT,
    jumlah DECIMAL(15, 2) NOT NULL DEFAULT 0,
    anggota_id UUID NOT NULL REFERENCES anggota(id),
    keterangan TEXT,
    nominal_pokok DECIMAL(15, 2) DEFAULT 0,
    nominal_jasa DECIMAL(15, 2) DEFAULT 0,
    status TEXT DEFAULT 'Sukses',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. JADWAL ANGSURAN (Master Tagihan)
CREATE TABLE IF NOT EXISTS jadwal_angsuran (
    id UUID PRIMARY KEY,
    loan_id UUID NOT NULL REFERENCES transaksi(id) ON DELETE CASCADE,
    anggota_id UUID NOT NULL REFERENCES anggota(id),
    angsuran_ke INTEGER NOT NULL,
    periode TEXT,
    tanggal_jatuh_tempo DATE NOT NULL,
    nominal_pokok DECIMAL(15, 2) NOT NULL,
    nominal_jasa DECIMAL(15, 2) NOT NULL,
    total_tagihan DECIMAL(15, 2) NOT NULL,
    status TEXT DEFAULT 'BELUM_BAYAR',
    tanggal_bayar DATE,
    transaksi_id UUID, -- Referensi ke transaksi pelunasan
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. CHART OF ACCOUNTS (COA)
CREATE TABLE IF NOT EXISTS coa (
    id TEXT PRIMARY KEY,
    kode TEXT UNIQUE NOT NULL,

    nama TEXT NOT NULL,
    jenis TEXT NOT NULL,
    kategori TEXT,
    saldo_normal TEXT CHECK (saldo_normal IN ('DEBIT', 'KREDIT')),
    saldo_awal DECIMAL(15, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- 5. JURNAL (SAK-EP Compliance)
CREATE TABLE IF NOT EXISTS jurnal (
    id UUID PRIMARY KEY,
    nomor_jurnal TEXT UNIQUE NOT NULL,
    tanggal DATE NOT NULL,
    deskripsi TEXT,
    referensi TEXT,
    status TEXT DEFAULT 'POSTED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. JURNAL DETAILS (Double Entry)
CREATE TABLE IF NOT EXISTS jurnal_detail (
    id UUID PRIMARY KEY,
    jurnal_id UUID REFERENCES jurnal(id) ON DELETE CASCADE,
    coa_id TEXT REFERENCES coa(id),
    debit DECIMAL(15, 2) DEFAULT 0,
    kredit DECIMAL(15, 2) DEFAULT 0
);


-- INDEXES
CREATE INDEX IF NOT EXISTS idx_transaksi_anggota ON transaksi(anggota_id);
CREATE INDEX IF NOT EXISTS idx_jadwal_loan ON jadwal_angsuran(loan_id);
CREATE INDEX IF NOT EXISTS idx_jadwal_anggota ON jadwal_angsuran(anggota_id);


-- UPDATED_AT TRIGGER
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_anggota_modtime BEFORE UPDATE ON anggota FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_transaksi_modtime BEFORE UPDATE ON transaksi FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_jadwal_modtime BEFORE UPDATE ON jadwal_angsuran FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
