-- Phase 3: Initial Data Seeding (Fixed constraint issue)

-- Create permissions table (referenced in the seeding but doesn't exist)
CREATE TABLE IF NOT EXISTS public.permissions (
    id text PRIMARY KEY,
    name text NOT NULL,
    description text,
    module text NOT NULL,
    action text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create role_permissions junction table
CREATE TABLE IF NOT EXISTS public.role_permissions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    role text NOT NULL,
    permission_id text NOT NULL REFERENCES public.permissions(id),
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE(role, permission_id)
);

-- Enable RLS on new tables
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- RLS policies for permissions
CREATE POLICY "Users can view permissions" ON public.permissions
FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage permissions" ON public.permissions
FOR ALL USING (has_permission('roles:create'));

-- RLS policies for role_permissions
CREATE POLICY "Users can view role_permissions" ON public.role_permissions
FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage role_permissions" ON public.role_permissions
FOR ALL USING (has_permission('roles:create'));

-- Insert default permissions
INSERT INTO public.permissions (id, name, description, module, action) VALUES
-- User Management
('user_management_read', 'View Users', 'Can view user list and details', 'user_management', 'read'),
('user_management_create', 'Create Users', 'Can create new users', 'user_management', 'create'),
('user_management_update', 'Update Users', 'Can update user information', 'user_management', 'update'),
('user_management_delete', 'Delete Users', 'Can delete users', 'user_management', 'delete'),

-- Anggota Management
('anggota_read', 'View Members', 'Can view member list and details', 'anggota', 'read'),
('anggota_create', 'Create Members', 'Can register new members', 'anggota', 'create'),
('anggota_update', 'Update Members', 'Can update member information', 'anggota', 'update'),
('anggota_delete', 'Delete Members', 'Can delete members', 'anggota', 'delete'),

-- Transactions
('transaksi_read', 'View Transactions', 'Can view transaction history', 'transaksi', 'read'),
('transaksi_create', 'Create Transactions', 'Can process new transactions', 'transaksi', 'create'),
('transaksi_update', 'Update Transactions', 'Can modify transactions', 'transaksi', 'update'),
('transaksi_delete', 'Delete Transactions', 'Can delete transactions', 'transaksi', 'delete'),

-- Loan Applications
('pengajuan_read', 'View Applications', 'Can view loan applications', 'pengajuan', 'read'),
('pengajuan_create', 'Create Applications', 'Can submit loan applications', 'pengajuan', 'create'),
('pengajuan_update', 'Process Applications', 'Can approve/reject applications', 'pengajuan', 'update'),

-- Accounting
('accounting_read', 'View Financial Data', 'Can view financial reports', 'accounting', 'read'),
('accounting_create', 'Create Journal Entries', 'Can create journal entries', 'accounting', 'create'),
('accounting_update', 'Update Financial Data', 'Can modify financial records', 'accounting', 'update'),

-- POS System
('pos_read', 'View POS Data', 'Can view sales and inventory', 'pos', 'read'),
('pos_create', 'Process Sales', 'Can process sales transactions', 'pos', 'create'),
('pos_update', 'Update Inventory', 'Can update inventory and products', 'pos', 'update'),

-- Reports
('reports_financial', 'Financial Reports', 'Can access financial reports', 'reports', 'read'),
('reports_operational', 'Operational Reports', 'Can access operational reports', 'reports', 'read'),

-- Settings
('settings_read', 'View Settings', 'Can view system settings', 'settings', 'read'),
('settings_update', 'Update Settings', 'Can modify system settings', 'settings', 'update'),

-- Own Data Access
('view_own_data', 'View Own Data', 'Can view own transactions and data', 'self', 'read'),
('update_own_profile', 'Update Own Profile', 'Can update own profile', 'self', 'update')
ON CONFLICT (id) DO NOTHING;

-- Assign permissions to roles
INSERT INTO public.role_permissions (role, permission_id) VALUES
-- Superadmin - all permissions
('superadmin', 'user_management_read'),
('superadmin', 'user_management_create'),
('superadmin', 'user_management_update'),
('superadmin', 'user_management_delete'),
('superadmin', 'anggota_read'),
('superadmin', 'anggota_create'),
('superadmin', 'anggota_update'),
('superadmin', 'anggota_delete'),
('superadmin', 'transaksi_read'),
('superadmin', 'transaksi_create'),
('superadmin', 'transaksi_update'),
('superadmin', 'transaksi_delete'),
('superadmin', 'pengajuan_read'),
('superadmin', 'pengajuan_create'),
('superadmin', 'pengajuan_update'),
('superadmin', 'accounting_read'),
('superadmin', 'accounting_create'),
('superadmin', 'accounting_update'),
('superadmin', 'pos_read'),
('superadmin', 'pos_create'),
('superadmin', 'pos_update'),
('superadmin', 'reports_financial'),
('superadmin', 'reports_operational'),
('superadmin', 'settings_read'),
('superadmin', 'settings_update'),

-- Admin - most permissions except user management
('admin', 'anggota_read'),
('admin', 'anggota_create'),
('admin', 'anggota_update'),
('admin', 'transaksi_read'),
('admin', 'transaksi_create'),
('admin', 'transaksi_update'),
('admin', 'pengajuan_read'),
('admin', 'pengajuan_create'),
('admin', 'pengajuan_update'),
('admin', 'accounting_read'),
('admin', 'accounting_create'),
('admin', 'accounting_update'),
('admin', 'pos_read'),
('admin', 'pos_create'),
('admin', 'pos_update'),
('admin', 'reports_financial'),
('admin', 'reports_operational'),
('admin', 'settings_read'),

-- Staff - operational permissions
('staff', 'anggota_read'),
('staff', 'anggota_create'),
('staff', 'anggota_update'),
('staff', 'transaksi_read'),
('staff', 'transaksi_create'),
('staff', 'transaksi_update'),
('staff', 'pengajuan_read'),
('staff', 'pengajuan_update'),
('staff', 'pos_read'),
('staff', 'pos_create'),
('staff', 'pos_update'),
('staff', 'reports_operational'),

-- Anggota - limited permissions
('anggota', 'view_own_data'),
('anggota', 'update_own_profile'),
('anggota', 'pengajuan_create')
ON CONFLICT (role, permission_id) DO NOTHING;

-- Insert default unit kerja (adjusted for existing schema)
INSERT INTO public.unit_kerja (nama, keterangan) VALUES
('Sekretariat', 'Unit Sekretariat KPRI'),
('Bagian Keuangan', 'Unit Bagian Keuangan'),
('Bagian Pelayanan', 'Unit Bagian Pelayanan Anggota'),
('Unit Umum', 'Unit Kerja Umum')
ON CONFLICT DO NOTHING;

-- Insert default chart of accounts (adjusted for existing schema)
INSERT INTO public.chart_of_accounts (id, kode_akun, nama_akun, tipe_akun, level, saldo_normal) VALUES
-- ASET
('aset_main', '1', 'ASET', 'ASET', 1, 'DEBIT'),
('aset_lancar', '11', 'ASET LANCAR', 'ASET', 2, 'DEBIT'),
('kas', '111', 'Kas', 'ASET', 3, 'DEBIT'),
('bank', '112', 'Bank', 'ASET', 3, 'DEBIT'),
('piutang', '113', 'Piutang Anggota', 'ASET', 3, 'DEBIT'),
('persediaan', '114', 'Persediaan Barang', 'ASET', 3, 'DEBIT'),
('aset_tetap', '12', 'ASET TETAP', 'ASET', 2, 'DEBIT'),
('tanah', '121', 'Tanah', 'ASET', 3, 'DEBIT'),
('bangunan', '122', 'Bangunan', 'ASET', 3, 'DEBIT'),
('peralatan', '123', 'Peralatan', 'ASET', 3, 'DEBIT'),

-- KEWAJIBAN
('kewajiban_main', '2', 'KEWAJIBAN', 'KEWAJIBAN', 1, 'KREDIT'),
('kewajiban_lancar', '21', 'KEWAJIBAN LANCAR', 'KEWAJIBAN', 2, 'KREDIT'),
('utang_dagang', '211', 'Utang Dagang', 'KEWAJIBAN', 3, 'KREDIT'),
('utang_bank', '212', 'Utang Bank', 'KEWAJIBAN', 3, 'KREDIT'),
('simpanan_anggota', '213', 'Simpanan Anggota', 'KEWAJIBAN', 3, 'KREDIT'),

-- MODAL
('modal_main', '3', 'MODAL', 'MODAL', 1, 'KREDIT'),
('modal_koperasi', '31', 'MODAL KOPERASI', 'MODAL', 2, 'KREDIT'),
('simpanan_pokok', '311', 'Simpanan Pokok', 'MODAL', 3, 'KREDIT'),
('simpanan_wajib', '312', 'Simpanan Wajib', 'MODAL', 3, 'KREDIT'),
('modal_cadangan', '313', 'Modal Cadangan', 'MODAL', 3, 'KREDIT'),
('shu_tahun_berjalan', '314', 'SHU Tahun Berjalan', 'MODAL', 3, 'KREDIT'),

-- PENDAPATAN
('pendapatan_main', '4', 'PENDAPATAN', 'PENDAPATAN', 1, 'KREDIT'),
('pendapatan_usaha', '41', 'PENDAPATAN USAHA', 'PENDAPATAN', 2, 'KREDIT'),
('pendapatan_bunga', '411', 'Pendapatan Bunga Pinjaman', 'PENDAPATAN', 3, 'KREDIT'),
('pendapatan_penjualan', '412', 'Pendapatan Penjualan', 'PENDAPATAN', 3, 'KREDIT'),
('pendapatan_admin', '413', 'Pendapatan Administrasi', 'PENDAPATAN', 3, 'KREDIT'),

-- BEBAN
('beban_main', '5', 'BEBAN', 'BIAYA', 1, 'DEBIT'),
('beban_operasional', '51', 'BEBAN OPERASIONAL', 'BIAYA', 2, 'DEBIT'),
('beban_gaji', '511', 'Beban Gaji', 'BIAYA', 3, 'DEBIT'),
('beban_listrik', '512', 'Beban Listrik', 'BIAYA', 3, 'DEBIT'),
('beban_telepon', '513', 'Beban Telepon', 'BIAYA', 3, 'DEBIT'),
('beban_admin', '514', 'Beban Administrasi', 'BIAYA', 3, 'DEBIT'),
('beban_penyusutan', '515', 'Beban Penyusutan', 'BIAYA', 3, 'DEBIT')
ON CONFLICT (id) DO NOTHING;

-- Set parent relationships
UPDATE public.chart_of_accounts SET parent_id = 'aset_main' WHERE id IN ('aset_lancar', 'aset_tetap');
UPDATE public.chart_of_accounts SET parent_id = 'aset_lancar' WHERE id IN ('kas', 'bank', 'piutang', 'persediaan');
UPDATE public.chart_of_accounts SET parent_id = 'aset_tetap' WHERE id IN ('tanah', 'bangunan', 'peralatan');
UPDATE public.chart_of_accounts SET parent_id = 'kewajiban_main' WHERE id = 'kewajiban_lancar';
UPDATE public.chart_of_accounts SET parent_id = 'kewajiban_lancar' WHERE id IN ('utang_dagang', 'utang_bank', 'simpanan_anggota');
UPDATE public.chart_of_accounts SET parent_id = 'modal_main' WHERE id = 'modal_koperasi';
UPDATE public.chart_of_accounts SET parent_id = 'modal_koperasi' WHERE id IN ('simpanan_pokok', 'simpanan_wajib', 'modal_cadangan', 'shu_tahun_berjalan');
UPDATE public.chart_of_accounts SET parent_id = 'pendapatan_main' WHERE id = 'pendapatan_usaha';
UPDATE public.chart_of_accounts SET parent_id = 'pendapatan_usaha' WHERE id IN ('pendapatan_bunga', 'pendapatan_penjualan', 'pendapatan_admin');
UPDATE public.chart_of_accounts SET parent_id = 'beban_main' WHERE id = 'beban_operasional';
UPDATE public.chart_of_accounts SET parent_id = 'beban_operasional' WHERE id IN ('beban_gaji', 'beban_listrik', 'beban_telepon', 'beban_admin', 'beban_penyusutan');

-- Insert default transaction categories (using correct tipe values)
INSERT INTO public.kategori_transaksi (nama, tipe, deskripsi) VALUES
('Simpanan Pokok', 'Pemasukan', 'Setoran simpanan pokok anggota'),
('Simpanan Wajib', 'Pemasukan', 'Setoran simpanan wajib anggota'),
('Simpanan Sukarela', 'Pemasukan', 'Setoran simpanan sukarela anggota'),
('Pinjaman Reguler', 'Pengeluaran', 'Pinjaman reguler anggota'),
('Angsuran Pokok', 'Pemasukan', 'Pembayaran angsuran pokok pinjaman'),
('Angsuran Bunga', 'Pemasukan', 'Pembayaran bunga pinjaman'),
('Administrasi', 'Pemasukan', 'Biaya administrasi'),
('Operasional', 'Pengeluaran', 'Biaya operasional koperasi')
ON CONFLICT DO NOTHING;

-- Insert default system settings (adjusted for existing schema)
INSERT INTO public.pengaturan (id, key, value, deskripsi, kategori, tipe) VALUES
('nama_koperasi', 'nama_koperasi', 'KPRI BANGUN', 'Nama Koperasi', 'umum', 'string'),
('alamat_koperasi', 'alamat_koperasi', 'Jl. Contoh No. 123, Jakarta', 'Alamat Koperasi', 'umum', 'string'),
('telepon_koperasi', 'telepon_koperasi', '021-12345678', 'Nomor Telepon Koperasi', 'umum', 'string'),
('email_koperasi', 'email_koperasi', 'info@kpribangun.co.id', 'Email Koperasi', 'umum', 'string'),
('bunga_pinjaman_default', 'bunga_pinjaman_default', '12', 'Bunga pinjaman default per tahun (%)', 'keuangan', 'string'),
('simpanan_pokok_minimum', 'simpanan_pokok_minimum', '100000', 'Simpanan pokok minimum', 'keuangan', 'string'),
('simpanan_wajib_minimum', 'simpanan_wajib_minimum', '50000', 'Simpanan wajib minimum per bulan', 'keuangan', 'string'),
('denda_keterlambatan', 'denda_keterlambatan', '2', 'Denda keterlambatan angsuran per hari (%)', 'keuangan', 'string'),
('batas_pinjaman_maksimal', 'batas_pinjaman_maksimal', '10000000', 'Batas pinjaman maksimal', 'keuangan', 'string'),
('tahun_buku', 'tahun_buku', '2024', 'Tahun buku aktif', 'akuntansi', 'string')
ON CONFLICT (id) DO NOTHING;

-- Function to generate transaction numbers
CREATE OR REPLACE FUNCTION public.generate_transaction_number(prefix TEXT)
RETURNS TEXT AS $$
DECLARE
    next_num INTEGER;
    formatted_num TEXT;
BEGIN
    -- Get the next sequence number for today
    SELECT COALESCE(MAX(CAST(SUBSTRING(id FROM LENGTH(prefix) + 9) AS INTEGER)), 0) + 1
    INTO next_num
    FROM public.transaksi
    WHERE id LIKE prefix || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '%';
    
    -- Format the number with leading zeros
    formatted_num := LPAD(next_num::TEXT, 4, '0');
    
    RETURN prefix || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || formatted_num;
END;
$$ LANGUAGE plpgsql;