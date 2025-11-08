'use server';

import { supabaseClient } from '@/lib/supabase';

export async function getAllUsers() {
  const { data: users, error } = await supabaseClient
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return { error: error.message };
  return { data: users };
}
