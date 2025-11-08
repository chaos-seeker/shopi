'use server';

import { supabaseClient } from '@/lib/supabase';

export async function getAllCategories() {
  const { data: categories, error } = await supabaseClient
    .from('categories')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return { error: error.message };
  return { data: categories };
}

