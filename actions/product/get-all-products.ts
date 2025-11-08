'use server';

import { supabaseClient } from '@/lib/supabase';

export async function getAllProducts() {
  const { data: products, error } = await supabaseClient
    .from('products')
    .select(
      `
      *,
      category:categories(*),
      brand:brands(*)
    `,
    )
    .order('created_at', { ascending: false });

  if (error) return { error: error.message };
  return { data: products };
}

