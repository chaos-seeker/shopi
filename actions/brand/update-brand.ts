'use server';

import { supabaseClient } from '@/lib/supabase';
import { TBrand } from '@/types/brand';

export async function updateBrand(
  id: number,
  data: Partial<Omit<TBrand, 'id' | 'created_at' | 'updated_at'>>,
) {
  if (process.env.NODE_ENV !== 'development') {
    return { error: 'دسترسی محدود شده است!' };
  }

  const { data: brand, error } = await supabaseClient
    .from('brands')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) return { error: error.message };
  return { data: brand };
}
