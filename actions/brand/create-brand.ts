'use server';

import { supabaseClient } from '@/lib/supabase';
import { TBrand } from '@/types/brand';

export async function createBrand(
  data: Omit<TBrand, 'id' | 'created_at' | 'updated_at'>,
) {
  const { data: brand, error } = await supabaseClient
    .from('brands')
    .insert([data])
    .select()
    .single();

  if (error) return { error: error.message };
  return { data: brand };
}

