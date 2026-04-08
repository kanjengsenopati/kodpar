import { ExtendedUser } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";
import { recordFailedAttempt, clearFailedAttempts } from "./rateLimiting";

/**
 * Handle Supabase authentication for real users
 */
export const handleSupabaseLogin = async (email: string, password: string): Promise<ExtendedUser> => {
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (authError) {
    recordFailedAttempt(email);
    throw new Error("Invalid email or password");
  }

  // Get user profile from database
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authData.user.id)
    .single();

  if (profileError) {
    recordFailedAttempt(email);
    throw new Error("Profile not found");
  }

  // Get role information
  const { data: role } = await supabase
    .from('roles')
    .select('*')
    .eq('id', profile.role_id)
    .single();

  const extendedUser: ExtendedUser = {
    id: profile.id,
    username: profile.username || profile.email,
    nama: profile.nama,
    email: profile.email,
    roleId: profile.role_id,
    aktif: profile.aktif,
    lastLogin: new Date().toISOString(),
    createdAt: profile.created_at,
    updatedAt: profile.updated_at,
    role: role ? {
      id: role.id,
      name: role.name,
      permissions: role.permissions || []
    } : undefined
  };

  clearFailedAttempts(email);
  return extendedUser;
};