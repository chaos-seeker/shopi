'use server';

import { supabaseClient } from '@/lib/supabase';

export async function getAllBrands() {
  const { data: brands, error } = await supabaseClient
    .from('brands')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return { error: error.message };
  return { data: brands };
}

