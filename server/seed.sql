-- Koperasi SaaS Seeding Script (Master Data)
-- Primary Single Source of Truth for initial setup

-- 1. SEED COA (Chart of Accounts)
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

-- 3. SEED ANGGOTA (Initial Members)
INSERT INTO anggota (id, no_anggota, nama, nip, alamat, no_hp, jenis_kelamin, status, unit_kerja, tanggal_bergabung) VALUES
('018e6a12-8c1d-7a01-8000-000000000001', 'AG/2026/0001', 'MARIYEM', '197201011998031001', 'DESA JATILOR', '0812345678', 'P', 'active', 'SDN Jatilor 01', '2023-01-15'),
('018e6a12-8c1d-7a01-8000-000000000002', 'AG/2026/0002', 'MASKUN ROZAK', '198201011998031001', 'DESA BRINGIN', '0823456789', 'L', 'active', 'SDN Bringin', '2023-02-20'),
('018e6a12-8c1d-7a01-8000-000000000003', 'AG/2026/0003', 'AHMAD NURALIMIN', '198801011998031001', 'DESA KLAMPOK', '08345678912', 'L', 'active', 'SDN Klampok 01', '2023-03-10'),
('018e6a12-8c1d-7a01-8000-000000000004', 'AG/2026/0004', 'DJAKA KUMALATARTO, S.Pd, M.Pd', '197002161210012345', 'Desa Ketitang, Godong', '08123456789', 'L', 'active', 'SD Negeri Ketitang', '2023-04-01')
ON CONFLICT (id) DO NOTHING;
