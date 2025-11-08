'use server';

import { supabaseClient } from '@/lib/supabase';

export async function getProduct(id: number) {
  const { data: product, error } = await supabaseClient
    .from('products')
    .select(
      `
      *,
      category:categories(*),
      brand:brands(*)
    `,
    )
    .eq('id', id)
    .single();

  if (error) return { error: error.message };
  return { data: product };
}

