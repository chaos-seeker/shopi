'use server';

import { supabaseClient } from '@/lib/supabase';
import { TCategory } from '@/types/category';

export async function updateCategory(
  id: number,
  data: Partial<Omit<TCategory, 'id' | 'created_at' | 'updated_at'>>,
) {
  if (process.env.NODE_ENV !== 'development') {
    return { error: 'دسترسی محدود شده است!' };
  }

  const { data: category, error } = await supabaseClient
    .from('categories')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) return { error: error.message };
  return { data: category };
}
