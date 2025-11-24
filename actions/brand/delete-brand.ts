'use server';

import { supabaseClient } from '@/lib/supabase';

export async function deleteBrand(id: number) {
  if (process.env.NODE_ENV !== 'development') {
    return { error: 'دسترسی محدود شده است!' };
  }

  const { error } = await supabaseClient.from('brands').delete().eq('id', id);

  if (error) return { error: error.message };
  return { data: { id } };
}
