-- Koperasi SaaS Database Schema (PostgreSQL)
-- Run this script in your Neon.tech SQL Console

-- 1. Create TRANSAKSI table with UUID Primary Key
-- We use TEXT or UUID for 'id' to match client-side UUID v7
CREATE TABLE IF NOT EXISTS transaksi (
    id UUID PRIMARY KEY,
    nomor_transaksi TEXT UNIQUE NOT NULL,
    tanggal DATE NOT NULL,
    jenis TEXT NOT NULL CHECK (jenis IN ('Simpan', 'Pinjam', 'Angsuran', 'Penarikan')),
    kategori TEXT,
    jumlah DECIMAL(15, 2) NOT NULL DEFAULT 0,
    anggota_id UUID NOT NULL,
    keterangan TEXT,
    nominal_pokok DECIMAL(15, 2) DEFAULT 0,
    nominal_jasa DECIMAL(15, 2) DEFAULT 0,
    status TEXT DEFAULT 'Sukses',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create index for performance
CREATE INDEX IF NOT EXISTS idx_transaksi_anggota ON transaksi(anggota_id);
CREATE INDEX IF NOT EXISTS idx_transaksi_tanggal ON transaksi(tanggal);

-- 3. Trigger for automatic updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_transaksi_modtime
    BEFORE UPDATE ON transaksi
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
