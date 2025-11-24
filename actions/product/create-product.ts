'use server';

import { supabaseClient } from '@/lib/supabase';
import { TProduct } from '@/types/product';

export async function createProduct(
  data: Omit<TProduct, 'id' | 'created_at' | 'updated_at'>,
) {
  if (process.env.NODE_ENV !== 'development') {
    return { error: 'دسترسی محدود شده است!' };
  }

  const { category, brand, ...productData } = data;
  const { data: product, error } = await supabaseClient
    .from('products')
    .insert([{ ...productData, category_id: category.id, brand_id: brand.id }])
    .select(
      `
      *,
      category:categories(*),
      brand:brands(*)
    `,
    )
    .single();

  if (error) return { error: error.message };
  return { data: product };
}
