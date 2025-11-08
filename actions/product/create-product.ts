'use server';

import { supabaseClient } from '@/lib/supabase';
import { TProduct } from '@/types/product';

export async function createProduct(
  data: Omit<TProduct, 'id' | 'created_at' | 'updated_at'>,
) {
  const { category, ...productData } = data;
  const { data: product, error } = await supabaseClient
    .from('products')
    .insert([{ ...productData, category_id: category.id }])
    .select(
      `
      *,
      category:categories(*)
    `,
    )
    .single();

  if (error) return { error: error.message };
  return { data: product };
}
