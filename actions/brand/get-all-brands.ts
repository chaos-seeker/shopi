'use server';

import { supabaseClient } from '@/lib/supabase';

export async function getAllBrands() {
  const { data: brands, error } = await supabaseClient
    .from('brands')
    .select('*')
    .order('name_fa', { ascending: true });

  if (error) return { error: error.message };
  return { data: brands || [] };
}
