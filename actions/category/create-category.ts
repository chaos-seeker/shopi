'use server';

import { supabaseClient } from '@/lib/supabase';
import { TCategory } from '@/types/category';

export async function createCategory(
  data: Omit<TCategory, 'id' | 'created_at' | 'updated_at'>,
) {
  const { data: category, error } = await supabaseClient
    .from('categories')
    .insert([data])
    .select()
    .single();

  if (error) return { error: error.message };
  return { data: category };
}
