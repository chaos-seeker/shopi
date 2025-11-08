'use server';

import { supabaseClient } from '@/lib/supabase';

export async function getProductBySlug(slug: string) {
  const { data: product, error } = await supabaseClient
    .from('products')
    .select(
      `
      *,
      category:categories(*),
      brand:brands(*)
    `,
    )
    .eq('slug', slug)
    .single();

  if (error) return { error: error.message };
  return { data: product };
}
