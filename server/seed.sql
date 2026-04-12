-- Koperasi SaaS Seeding Script (Master Data)
-- Primary Single Source of Truth for initial setup

-- 1. ROLES & PERMISSIONS
INSERT INTO permissions (id, name, description) VALUES
('perm_anggota_read', 'Lihat Anggota', 'Melihat data anggota'),
('perm_anggota_create', 'Tambah Anggota', 'Menambah anggota baru'),
('perm_anggota_update', 'Edit Anggota', 'Mengubah data anggota'),
('perm_anggota_delete', 'Hapus Anggota', 'Menghapus anggota'),
('perm_transaksi_read', 'Lihat Transaksi', 'Melihat transaksi'),
('perm_transaksi_create', 'Tambah Transaksi', 'Membuat transaksi baru'),
('perm_transaksi_update', 'Edit Transaksi', 'Mengubah data transaksi'),
('perm_laporan_read', 'Lihat Laporan', 'Melihat laporan'),
('perm_laporan_export', 'Export Laporan', 'Mengexport laporan'),
('perm_users_read', 'Lihat Pengguna', 'Melihat daftar pengguna'),
('perm_pengaturan_read', 'Lihat Pengaturan', 'Melihat pengaturan'),
('perm_pengaturan_update', 'Ubah Pengaturan', 'Mengubah pengaturan')
ON CONFLICT (id) DO NOTHING;

INSERT INTO roles (id, name, description, permissions) VALUES

('role_superadmin', 'Super Admin', 'Akses penuh ke semua fitur sistem', '["*"]'),
('role_admin', 'Admin', 'Akses untuk mengelola data koperasi', '["perm_anggota_read", "perm_anggota_create", "perm_anggota_update", "perm_transaksi_read", "perm_transaksi_create", "perm_transaksi_update", "perm_laporan_read", "perm_laporan_export", "perm_pos_read", "perm_pos_sell", "perm_pos_inventory", "perm_users_read", "perm_pengaturan_read"]'),
('role_kasir', 'Kasir', 'Akses untuk melakukan transaksi penjualan', '["perm_pos_read", "perm_pos_sell"]'),
('role_anggota', 'Anggota', 'Akses data pribadi anggota', '["view_own_data", "update_own_profile"]')
ON CONFLICT (id) DO NOTHING;

-- 2. GLOBAL SETTINGS (Initial State)
INSERT INTO settings (id, config) VALUES
('global_config', '{
  "sukuBunga": {
    "pinjaman": 1.5,
    "simpanan": 0.5,
    "metodeBunga": "flat",
    "metodePembulatan": "none",
    "danaResikoKredit": {"enabled": true, "persentase": 2.0, "autoDeduction": true},
    "simpananWajibKredit": {"enabled": true, "persentase": 5.0, "autoDeduction": true}
  },
  "tenor": {"minTenor": 3, "maxTenor": 36, "defaultTenor": 12},
  "shu": {
    "distribution": {
      "rekening_penyimpan": 25, "rekening_berjasa": 25, "pengurus": 10, "dana_karyawan": 5,
      "dana_pendidikan": 10, "dana_pembangunan_daerah": 2.5, "dana_sosial": 2.5, "cadangan": 20
    }
  },
  "profil": {"namaKoperasi": "Koperasi-ERP", "alamat": "", "telepon": ""}
}')
ON CONFLICT (id) DO NOTHING;

-- 3. UNIT KERJA
INSERT INTO unit_kerja (id, nama, kode) VALUES
('018e6a12-8c1d-7a01-8000-000000000801', 'SDN Jatilor 01', 'UK-001'),
('018e6a12-8c1d-7a01-8000-000000000802', 'SDN Bringin', 'UK-002'),
('018e6a12-8c1d-7a01-8000-000000000803', 'SDN Klampok 01', 'UK-003')
ON CONFLICT (id) DO NOTHING;

-- 4. MASTER JENIS (Loan & Savings Products)
INSERT INTO mst_jenis (id, kode, nama, jenis_transaksi, keterangan, bunga_persen, wajib, untuk_peminjam, tenor_min, tenor_max, maksimal_pinjaman, is_active) VALUES
('018e6a12-8c1d-7a01-8000-000000000501', 'SP/POKOK', 'Simpanan Pokok', 'Simpanan', 'Simpanan wajib saat masuk', 0, TRUE, FALSE, NULL, NULL, NULL, TRUE),
('018e6a12-8c1d-7a01-8000-000000000502', 'SP/WAJIB', 'Simpanan Wajib', 'Simpanan', 'Simpanan rutin bulanan', 0.5, TRUE, FALSE, NULL, NULL, NULL, TRUE),
('018e6a12-8c1d-7a01-8000-000000000503', 'SP/SUKARELA', 'Simpanan Sukarela', 'Simpanan', 'Simpanan sukarela', 1.0, FALSE, FALSE, NULL, NULL, NULL, TRUE),
('018e6a12-8c1d-7a01-8000-000000000601', 'PJ/REGULER', 'Reguler', 'Pinjaman', 'Pinjaman bunga standar', 1.5, FALSE, TRUE, 3, 24, 20000000, TRUE),
('018e6a12-8c1d-7a01-8000-000000000602', 'PJ/SERTIFIKASI', 'Sertifikasi', 'Pinjaman', 'Pinjaman sertifikasi', 1.0, FALSE, TRUE, 6, 36, 50000000, TRUE),
('018e6a12-8c1d-7a01-8000-000000000603', 'PJ/MUSIMAN', 'Musiman', 'Pinjaman', 'Pinjaman jangka pendek', 2.0, FALSE, TRUE, 1, 6, 10000000, TRUE)
ON CONFLICT (id) DO NOTHING;

-- 5. SEED COA (Chart of Accounts)
INSERT INTO coa (id, kode, nama, jenis, kategori, saldo_normal) VALUES

('coa-kas', '1000', 'KAS', 'ASET', 'Aset Lancar', 'DEBIT'),
('coa-piutang-anggota', '1100', 'PIUTANG ANGGOTA', 'ASET', 'Aset Lancar', 'DEBIT'),
('coa-cadangan-kerugian-piutang', '1190', 'CADANGAN KERUGIAN PIUTANG', 'ASET', 'Aset Lancar', 'KREDIT'),
('coa-investasi', '1200', 'INVESTASI JANGKA PANJANG', 'ASET', 'Aset Tetap', 'DEBIT'),
('coa-simpanan-sukarela', '2100', 'SIMPANAN SUKARELA', 'KEWAJIBAN', 'Kewajiban Lancar', 'KREDIT'),
('coa-utang-usaha', '2200', 'UTANG USAHA', 'KEWAJIBAN', 'Kewajiban Lancar', 'KREDIT'),
('coa-simpanan-pokok', '3100', 'SIMPANAN POKOK', 'MODAL', 'Modal', 'KREDIT'),
('coa-simpanan-wajib', '3200', 'SIMPANAN WAJIB', 'MODAL', 'Modal', 'KREDIT'),
('coa-modal-dasar', '3000', 'MODAL DASAR', 'MODAL', 'Modal', 'KREDIT'),
('coa-cadangan-umum', '3300', 'CADANGAN UMUM', 'MODAL', 'Modal', 'KREDIT'),
('coa-pendapatan-jasa-pinjaman', '4000', 'PENDAPATAN JASA PINJAMAN', 'PENDAPATAN', 'Pendapatan Operasional', 'KREDIT'),
('coa-pendapatan-lain', '4100', 'PENDAPATAN LAIN-LAIN', 'PENDAPATAN', 'Pendapatan Non-Operasional', 'KREDIT'),
('coa-beban-operasional', '5000', 'BEBAN OPERASIONAL', 'BEBAN', 'Beban Operasional', 'DEBIT'),
('coa-beban-administrasi', '5100', 'BEBAN ADMINISTRASI', 'BEBAN', 'Beban Operasional', 'DEBIT')
ON CONFLICT (id) DO NOTHING;

-- 6. MASTER PRODUK (Retail Seed)
INSERT INTO mst_produk (id, kode, nama, kategori, harga_beli, harga_jual, stok, satuan) VALUES
('018e6a12-8c1d-7a01-8000-000000000701', 'PRD001', 'Beras Premium 5kg', 'Sembako', 60000, 68000, 50, 'pack'),
('018e6a12-8c1d-7a01-8000-000000000702', 'PRD002', 'Minyak Goreng 2L', 'Sembako', 28000, 32000, 100, 'btl'),
('018e6a12-8c1d-7a01-8000-000000000703', 'PRD003', 'Gula Pasir 1kg', 'Sembako', 14000, 16000, 200, 'kg'),
('018e6a12-8c1d-7a01-8000-000000000704', 'PRD004', 'Kopi Bubuk 200g', 'Minuman', 12000, 15000, 80, 'pcs')
ON CONFLICT (id) DO NOTHING;

-- 7. MASTER PEMASOK
INSERT INTO mst_pemasok (id, nama, alamat, telepon, email) VALUES
('018e6a12-8c1d-7a01-8000-000000000901', 'PT. Pangan Makmur', 'Jakarta', '021-123456', 'sales@panganmakmur.com'),
('018e6a12-8c1d-7a01-8000-000000000902', 'CV. Sumber Sembako', 'Semarang', '024-765432', 'info@sumbersembako.com')
ON CONFLICT (id) DO NOTHING;

-- 8. MANUFAKTUR BOM (Template Seed)
INSERT INTO mfg_bom (id, code, product_name, product_code, category, total_cost, output_quantity, output_unit, status) VALUES
('018e6a12-8c1d-7a01-8000-000000001001', 'BOM-001', 'Roti Tawar Gandum', 'FG-ROTI-01', 'Makanan', 12000, 1, 'pcs', 'Active')
ON CONFLICT (id) DO NOTHING;

INSERT INTO mfg_bom_item (id, bom_id, material_name, material_code, quantity, unit, unit_cost, total_cost) VALUES
('018e6a12-8c1d-7a01-8000-000000001002', '018e6a12-8c1d-7a01-8000-000000001001', 'Tepung Gandum', 'RM-TPG-01', 0.5, 'kg', 10000, 5000),
('018e6a12-8c1d-7a01-8000-000000001003', '018e6a12-8c1d-7a01-8000-000000001001', 'Ragi', 'RM-RAGI-01', 10, 'gram', 200, 2000),
('018e6a12-8c1d-7a01-8000-000000001004', '018e6a12-8c1d-7a01-8000-000000001001', 'Gula Pasir', 'PRD003', 0.1, 'kg', 14000, 1400)
ON CONFLICT (id) DO NOTHING;

-- 9. SEED ANGGOTA (Initial Members)

INSERT INTO anggota (id, no_anggota, nama, nip, alamat, no_hp, jenis_kelamin, status, unit_kerja, tanggal_bergabung) VALUES
('018e6a12-8c1d-7a01-8000-000000000001', 'AG/2026/0001', 'MARIYEM', '197201011998031001', 'DESA JATILOR', '0812345678', 'P', 'active', 'SDN Jatilor 01', '2023-01-15'),
('018e6a12-8c1d-7a01-8000-000000000002', 'AG/2026/0002', 'MASKUN ROZAK', '198201011998031001', 'DESA BRINGIN', '0823456789', 'L', 'active', 'SDN Bringin', '2023-02-20'),
('018e6a12-8c1d-7a01-8000-000000000003', 'AG/2026/0003', 'AHMAD NURALIMIN', '198801011998031001', 'DESA KLAMPOK', '08345678912', 'L', 'active', 'SDN Klampok 01', '2023-03-10'),
('018e6a12-8c1d-7a01-8000-000000000004', 'AG/2026/0004', 'DJAKA KUMALATARTO, S.Pd, M.Pd', '197002161210012345', 'Desa Ketitang, Godong', '08123456789', 'L', 'active', 'SD Negeri Ketitang', '2023-04-01')
ON CONFLICT (id) DO NOTHING;
