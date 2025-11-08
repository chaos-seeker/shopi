'use server';

import { supabaseClient } from '@/lib/supabase';

export async function deleteCategory(id: number) {
  const { error } = await supabaseClient
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) return { error: error.message };
  return { data: { id } };
}

