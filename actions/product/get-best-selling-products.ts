'use server';

import { supabaseClient } from '@/lib/supabase';

export async function getBestSellingProducts(limit?: number) {
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

  const sortedProducts = (products || []).sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return dateB - dateA;
  });

  const result = limit ? sortedProducts.slice(0, limit) : sortedProducts;
  return { data: result };
}
