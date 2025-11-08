'use server';

import { supabaseClient } from '@/lib/supabase';

export async function getAllCategories() {
  const { data: categories, error } = await supabaseClient
    .from('categories')
    .select('*')
    .order('name_fa', { ascending: true });

  if (error) return { error: error.message };
  return { data: categories || [] };
}
