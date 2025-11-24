'use server';

import { supabaseClient } from '@/lib/supabase';
import { TProduct } from '@/types/product';

export async function updateProduct(
  id: number,
  data: Partial<Omit<TProduct, 'id' | 'created_at' | 'updated_at'>>,
) {
  if (process.env.NODE_ENV !== 'development') {
    return { error: 'دسترسی محدود شده است!' };
  }

  const { category, brand, ...productData } = data;
  const updateData: any = { ...productData };
  if (category) {
    updateData.category_id = category.id;
  }
  if (brand) {
    updateData.brand_id = brand.id;
  }

  const { data: product, error } = await supabaseClient
    .from('products')
    .update(updateData)
    .eq('id', id)
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
