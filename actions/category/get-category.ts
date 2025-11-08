'use server';

import { supabaseClient } from '@/lib/supabase';

export async function getCategory(id: number) {
  const { data: category, error } = await supabaseClient
    .from('categories')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return { error: error.message };
  return { data: category };
}
