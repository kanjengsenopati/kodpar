-- Phase 2: Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unit_kerja ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anggota ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kategori_transaksi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaksi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pengajuan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chart_of_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jurnal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jurnal_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produk ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pemasok ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pembelian ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.detail_pembelian ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.penjualan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.detail_penjualan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pengaturan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_trail ENABLE ROW LEVEL SECURITY;

-- Security definer functions to avoid infinite recursion
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT COALESCE(
    (SELECT role::text FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1),
    'anggota'
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.has_role(_role TEXT)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role::text = _role
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.get_user_anggota_id()
RETURNS TEXT AS $$
  SELECT anggota_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can insert profiles" ON public.profiles
  FOR INSERT WITH CHECK (public.has_role('admin') OR public.has_role('superadmin'));

-- User roles policies
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (user_id = auth.uid() OR public.has_role('admin') OR public.has_role('superadmin'));

CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL USING (public.has_role('admin') OR public.has_role('superadmin'));

-- Permissions and role permissions - read-only for most users
CREATE POLICY "All authenticated users can view permissions" ON public.permissions
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "All authenticated users can view role permissions" ON public.role_permissions
  FOR SELECT USING (auth.role() = 'authenticated');

-- Unit kerja policies
CREATE POLICY "All authenticated users can view unit kerja" ON public.unit_kerja
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage unit kerja" ON public.unit_kerja
  FOR ALL USING (public.has_role('admin') OR public.has_role('superadmin'));

-- Anggota policies
CREATE POLICY "All authenticated users can view anggota" ON public.anggota
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Anggota can view own data" ON public.anggota
  FOR SELECT USING (id = public.get_user_anggota_id());

CREATE POLICY "Staff can manage anggota" ON public.anggota
  FOR ALL USING (public.has_role('staff') OR public.has_role('admin') OR public.has_role('superadmin'));

-- Kategori transaksi policies
CREATE POLICY "All authenticated users can view kategori transaksi" ON public.kategori_transaksi
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Staff can manage kategori transaksi" ON public.kategori_transaksi
  FOR ALL USING (public.has_role('staff') OR public.has_role('admin') OR public.has_role('superadmin'));

-- Transaksi policies
CREATE POLICY "Users can view related transaksi" ON public.transaksi
  FOR SELECT USING (
    anggota_id = public.get_user_anggota_id() OR 
    public.has_role('staff') OR 
    public.has_role('admin') OR 
    public.has_role('superadmin')
  );

CREATE POLICY "Staff can manage transaksi" ON public.transaksi
  FOR ALL USING (public.has_role('staff') OR public.has_role('admin') OR public.has_role('superadmin'));

-- Pengajuan policies
CREATE POLICY "Users can view own pengajuan" ON public.pengajuan
  FOR SELECT USING (
    anggota_id = public.get_user_anggota_id() OR 
    public.has_role('staff') OR 
    public.has_role('admin') OR 
    public.has_role('superadmin')
  );

CREATE POLICY "Anggota can create pengajuan" ON public.pengajuan
  FOR INSERT WITH CHECK (anggota_id = public.get_user_anggota_id());

CREATE POLICY "Staff can manage pengajuan" ON public.pengajuan
  FOR ALL USING (public.has_role('staff') OR public.has_role('admin') OR public.has_role('superadmin'));

-- Chart of accounts policies
CREATE POLICY "All authenticated users can view chart of accounts" ON public.chart_of_accounts
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage chart of accounts" ON public.chart_of_accounts
  FOR ALL USING (public.has_role('admin') OR public.has_role('superadmin'));

-- Journal entries policies
CREATE POLICY "Staff can view journal entries" ON public.jurnal_entries
  FOR SELECT USING (public.has_role('staff') OR public.has_role('admin') OR public.has_role('superadmin'));

CREATE POLICY "Staff can manage journal entries" ON public.jurnal_entries
  FOR ALL USING (public.has_role('staff') OR public.has_role('admin') OR public.has_role('superadmin'));

-- Journal details policies
CREATE POLICY "Staff can view journal details" ON public.jurnal_details
  FOR SELECT USING (public.has_role('staff') OR public.has_role('admin') OR public.has_role('superadmin'));

CREATE POLICY "Staff can manage journal details" ON public.jurnal_details
  FOR ALL USING (public.has_role('staff') OR public.has_role('admin') OR public.has_role('superadmin'));

-- Produk policies
CREATE POLICY "All authenticated users can view produk" ON public.produk
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Staff can manage produk" ON public.produk
  FOR ALL USING (public.has_role('staff') OR public.has_role('admin') OR public.has_role('superadmin'));

-- Pemasok policies
CREATE POLICY "Staff can view pemasok" ON public.pemasok
  FOR SELECT USING (public.has_role('staff') OR public.has_role('admin') OR public.has_role('superadmin'));

CREATE POLICY "Staff can manage pemasok" ON public.pemasok
  FOR ALL USING (public.has_role('staff') OR public.has_role('admin') OR public.has_role('superadmin'));

-- Pembelian policies
CREATE POLICY "Staff can view pembelian" ON public.pembelian
  FOR SELECT USING (public.has_role('staff') OR public.has_role('admin') OR public.has_role('superadmin'));

CREATE POLICY "Staff can manage pembelian" ON public.pembelian
  FOR ALL USING (public.has_role('staff') OR public.has_role('admin') OR public.has_role('superadmin'));

-- Detail pembelian policies
CREATE POLICY "Staff can view detail pembelian" ON public.detail_pembelian
  FOR SELECT USING (public.has_role('staff') OR public.has_role('admin') OR public.has_role('superadmin'));

CREATE POLICY "Staff can manage detail pembelian" ON public.detail_pembelian
  FOR ALL USING (public.has_role('staff') OR public.has_role('admin') OR public.has_role('superadmin'));

-- Penjualan policies
CREATE POLICY "Staff can view penjualan" ON public.penjualan
  FOR SELECT USING (public.has_role('staff') OR public.has_role('admin') OR public.has_role('superadmin'));

CREATE POLICY "Staff can manage penjualan" ON public.penjualan
  FOR ALL USING (public.has_role('staff') OR public.has_role('admin') OR public.has_role('superadmin'));

-- Detail penjualan policies
CREATE POLICY "Staff can view detail penjualan" ON public.detail_penjualan
  FOR SELECT USING (public.has_role('staff') OR public.has_role('admin') OR public.has_role('superadmin'));

CREATE POLICY "Staff can manage detail penjualan" ON public.detail_penjualan
  FOR ALL USING (public.has_role('staff') OR public.has_role('admin') OR public.has_role('superadmin'));

-- Pengaturan policies
CREATE POLICY "All authenticated users can view pengaturan" ON public.pengaturan
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage pengaturan" ON public.pengaturan
  FOR ALL USING (public.has_role('admin') OR public.has_role('superadmin'));

-- Audit trail policies (read-only for admins)
CREATE POLICY "Admins can view audit trail" ON public.audit_trail
  FOR SELECT USING (public.has_role('admin') OR public.has_role('superadmin'));

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, nama, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'nama', NEW.email),
    NEW.email
  );
  
  -- Assign default role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'anggota');
  
  RETURN NEW;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();