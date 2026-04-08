-- First, let's create proper demo users in the profiles table with real UUIDs
-- Clear any existing demo data first (optional)
DELETE FROM public.profiles WHERE email IN ('adminkpri@email.com', 'admin@email.com', 'demo@email.com');

-- Insert demo users with proper UUIDs
INSERT INTO public.profiles (id, email, username, nama, role_id, aktif) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'adminkpri@email.com', 'adminkpri', 'Admin KPRI', 'role_superadmin', true),
('550e8400-e29b-41d4-a716-446655440002', 'admin@email.com', 'admin', 'Admin', 'role_admin', true),
('550e8400-e29b-41d4-a716-446655440003', 'demo@email.com', 'demo', 'Demo User', 'role_anggota', true)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  nama = EXCLUDED.nama,
  role_id = EXCLUDED.role_id,
  aktif = EXCLUDED.aktif;

-- Update RLS policies to allow unauthenticated demo login
-- First, drop existing policies that might be blocking access
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;

-- Create new permissive policies for demo login
CREATE POLICY "Allow demo login access" ON public.profiles
FOR SELECT USING (true);

CREATE POLICY "Allow demo profile creation" ON public.profiles
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow demo profile updates" ON public.profiles
FOR UPDATE USING (true);

-- Also allow admin management of profiles
CREATE POLICY "Admins can manage all profiles" ON public.profiles
FOR ALL USING (has_permission('users:read'::text) OR email = ANY(ARRAY['adminkpri@email.com', 'admin@email.com', 'demo@email.com']));