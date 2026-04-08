-- Update adminkpri@email.com to be super admin
UPDATE public.profiles 
SET role_id = 'role_superadmin'
WHERE email = 'adminkpri@email.com';

-- If the profile doesn't exist, create it
INSERT INTO public.profiles (id, email, username, nama, role_id, aktif)
SELECT 
    gen_random_uuid(),
    'adminkpri@email.com',
    'adminkpri',
    'Admin KPRI',
    'role_superadmin',
    true
WHERE NOT EXISTS (
    SELECT 1 FROM public.profiles WHERE email = 'adminkpri@email.com'
);