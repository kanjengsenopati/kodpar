-- 0. CLEAN SLATE (Optional for Seeding)
DROP TRIGGER IF EXISTS update_users_modtime ON users;
DROP TRIGGER IF EXISTS update_anggota_modtime ON anggota;
DROP TRIGGER IF EXISTS update_transaksi_modtime ON transaksi;
DROP TRIGGER IF EXISTS update_jadwal_modtime ON jadwal_angsuran;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS jurnal_detail CASCADE;
DROP TABLE IF EXISTS jurnal CASCADE;
DROP TABLE IF EXISTS coa CASCADE;
DROP TABLE IF EXISTS jadwal_angsuran CASCADE;
DROP TABLE IF EXISTS transaksi CASCADE;
DROP TABLE IF EXISTS anggota CASCADE;
-- 1. USERS
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,

    username TEXT UNIQUE NOT NULL,
    nama TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role_id TEXT NOT NULL,
    anggota_id UUID,
    aktif BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. ANGGOTA
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

-- 6. PERMISSIONS & ROLES
CREATE TABLE IF NOT EXISTS permissions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS roles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    permissions JSONB DEFAULT '[]'
);

-- 7. UNIT KERJA
CREATE TABLE IF NOT EXISTS unit_kerja (
    id UUID PRIMARY KEY,
    nama TEXT NOT NULL,
    kode TEXT UNIQUE,
    keterangan TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. SETTINGS (JSONB for flexibility)
CREATE TABLE IF NOT EXISTS settings (
    id TEXT PRIMARY KEY, -- usually 'global_config'
    config JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY,
    user_id UUID,
    username TEXT,
    action TEXT NOT NULL,
    resource TEXT NOT NULL,
    resource_id TEXT,
    details TEXT,
    ip_address TEXT,
    user_agent TEXT,
    device TEXT,
    browser TEXT,
    os TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. MASTER JENIS (Savings & Loan Types)
CREATE TABLE IF NOT EXISTS mst_jenis (
    id UUID PRIMARY KEY,
    kode TEXT UNIQUE NOT NULL,
    nama TEXT NOT NULL,
    jenis_transaksi TEXT NOT NULL,
    keterangan TEXT,
    persyaratan JSONB DEFAULT '[]',
    bunga_persen DECIMAL(5, 2) DEFAULT 0,
    wajib BOOLEAN DEFAULT FALSE,
    untuk_peminjam BOOLEAN DEFAULT FALSE,
    tenor_min INTEGER,
    tenor_max INTEGER,
    maksimal_pinjaman DECIMAL(15, 2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. JURNAL DETAILS (Double Entry)
CREATE TABLE IF NOT EXISTS jurnal_detail (

    id UUID PRIMARY KEY,
    jurnal_id UUID REFERENCES jurnal(id) ON DELETE CASCADE,
    coa_id TEXT REFERENCES coa(id),
    debit DECIMAL(15, 2) DEFAULT 0,
    kredit DECIMAL(15, 2) DEFAULT 0
);



-- 12. MASTER PRODUK (Retail & Inventory)
CREATE TABLE IF NOT EXISTS mst_produk (
    id UUID PRIMARY KEY,
    kode TEXT UNIQUE NOT NULL,
    nama TEXT NOT NULL,
    kategori TEXT,
    harga_beli DECIMAL(15, 2) DEFAULT 0,
    harga_jual DECIMAL(15, 2) DEFAULT 0,
    stok DECIMAL(15, 2) DEFAULT 0,
    satuan TEXT DEFAULT 'pcs',
    deskripsi TEXT,
    gambar TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. MASTER PEMASOK (Suppliers)
CREATE TABLE IF NOT EXISTS mst_pemasok (
    id UUID PRIMARY KEY,
    nama TEXT NOT NULL,
    alamat TEXT,
    telepon TEXT,
    email TEXT,
    kontak TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. POS PENJUALAN (Headers)
CREATE TABLE IF NOT EXISTS pos_penjualan (
    id UUID PRIMARY KEY,
    nomor_transaksi TEXT UNIQUE NOT NULL,
    tanggal TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    kasir_id UUID,
    subtotal DECIMAL(15, 2) DEFAULT 0,
    diskon DECIMAL(15, 2) DEFAULT 0,
    pajak DECIMAL(15, 2) DEFAULT 0,
    total DECIMAL(15, 2) DEFAULT 0,
    dibayar DECIMAL(15, 2) DEFAULT 0,
    kembalian DECIMAL(15, 2) DEFAULT 0,
    metode_pembayaran TEXT,
    status TEXT DEFAULT 'sukses',
    catatan TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. POS PENJUALAN ITEMS (Details)
CREATE TABLE IF NOT EXISTS pos_penjualan_item (
    id UUID PRIMARY KEY,
    penjualan_id UUID REFERENCES pos_penjualan(id) ON DELETE CASCADE,
    produk_id UUID REFERENCES mst_produk(id),
    jumlah DECIMAL(15, 2) NOT NULL,
    harga_satuan DECIMAL(15, 2) NOT NULL,
    total DECIMAL(15, 2) NOT NULL,
    diskon DECIMAL(15, 2) DEFAULT 0
);

-- 16. MANUFAKTUR BOM (Headers)
CREATE TABLE IF NOT EXISTS mfg_bom (
    id UUID PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    product_name TEXT NOT NULL,
    product_code TEXT,
    description TEXT,
    category TEXT,
    total_material_cost DECIMAL(15, 2) DEFAULT 0,
    overhead_cost DECIMAL(15, 2) DEFAULT 0,
    labor_cost DECIMAL(15, 2) DEFAULT 0,
    total_cost DECIMAL(15, 2) DEFAULT 0,
    output_quantity DECIMAL(15, 2) DEFAULT 1,
    output_unit TEXT DEFAULT 'pcs',
    status TEXT DEFAULT 'Draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 17. MANUFAKTUR BOM ITEMS (Components)
CREATE TABLE IF NOT EXISTS mfg_bom_item (
    id UUID PRIMARY KEY,
    bom_id UUID REFERENCES mfg_bom(id) ON DELETE CASCADE,
    material_name TEXT NOT NULL,
    material_code TEXT,
    quantity DECIMAL(15, 2) NOT NULL,
    unit TEXT,
    unit_cost DECIMAL(15, 2) DEFAULT 0,
    total_cost DECIMAL(15, 2) DEFAULT 0
);

-- 18. MANUFAKTUR WORK ORDERS
CREATE TABLE IF NOT EXISTS mfg_work_order (
    id UUID PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    bom_id UUID REFERENCES mfg_bom(id),
    quantity DECIMAL(15, 2) NOT NULL,
    status TEXT DEFAULT 'Draft',
    priority TEXT DEFAULT 'Medium',
    start_date DATE,
    due_date DATE,
    estimated_cost DECIMAL(15, 2) DEFAULT 0,
    actual_cost DECIMAL(15, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 19. POS PEMBELIAN (Purchases from Suppliers)
CREATE TABLE IF NOT EXISTS pos_pembelian (
    id UUID PRIMARY KEY,
    nomor_transaksi TEXT UNIQUE NOT NULL,
    tanggal DATE NOT NULL,
    pemasok_id UUID REFERENCES mst_pemasok(id),
    subtotal DECIMAL(15, 2) DEFAULT 0,
    diskon DECIMAL(15, 2) DEFAULT 0,
    ppn DECIMAL(15, 2) DEFAULT 0,
    total DECIMAL(15, 2) DEFAULT 0,
    status TEXT DEFAULT 'proses',
    catatan TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pos_pembelian_item (
    id UUID PRIMARY KEY,
    pembelian_id UUID REFERENCES pos_pembelian(id) ON DELETE CASCADE,
    produk_id UUID REFERENCES mst_produk(id),
    jumlah DECIMAL(15, 2) NOT NULL,
    harga_satuan DECIMAL(15, 2) NOT NULL,
    total DECIMAL(15, 2) NOT NULL
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
