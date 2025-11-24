'use server';

import { supabaseClient } from '@/lib/supabase';

export async function deleteProduct(id: number) {
  if (process.env.NODE_ENV !== 'development') {
    return { error: 'دسترسی محدود شده است!' };
  }

  const { error } = await supabaseClient.from('products').delete().eq('id', id);

  if (error) return { error: error.message };
  return { data: { id } };
}
