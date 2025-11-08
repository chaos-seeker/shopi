'use server';

import { supabaseClient } from '@/lib/supabase';

interface GetFilteredProductsParams {
  text?: string;
  categoryIds?: number[];
  brandIds?: number[];
  sort?: 'newest' | 'highest' | 'lowest';
}

export async function getFilteredProducts(
  params: GetFilteredProductsParams = {},
) {
  const { text, categoryIds, brandIds, sort = 'newest' } = params;

  let query = supabaseClient.from('products').select(
    `
      *,
      category:categories(*),
      brand:brands(*)
    `,
  );

  // Filter by search text
  if (text) {
    query = query.or(
      `name_fa.ilike.%${text}%,name_en.ilike.%${text}%,description.ilike.%${text}%`,
    );
  }

  // Filter by categories
  if (categoryIds && categoryIds.length > 0) {
    query = query.in('category_id', categoryIds);
  }

  // Filter by brands
  if (brandIds && brandIds.length > 0) {
    query = query.in('brand_id', brandIds);
  }

  // Sort
  switch (sort) {
    case 'newest':
      query = query.order('created_at', { ascending: false });
      break;
    case 'highest':
      query = query.order('price', { ascending: false });
      break;
    case 'lowest':
      query = query.order('price', { ascending: true });
      break;
    default:
      query = query.order('created_at', { ascending: false });
  }

  const { data: products, error } = await query;

  if (error) return { error: error.message };
  return { data: products || [] };
}
