'use server';

import { supabaseClient } from '@/lib/supabase';

export async function getBrand(id: number) {
  const { data: brand, error } = await supabaseClient
    .from('brands')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return { error: error.message };
  return { data: brand };
}

