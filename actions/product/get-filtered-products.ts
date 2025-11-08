'use server';

import { supabaseClient } from '@/lib/supabase';

interface GetFilteredProductsParams {
  text?: string;
  categorySlugs?: string[];
  brandSlugs?: string[];
  sort?: 'newest' | 'highest' | 'lowest';
}

export async function getFilteredProducts(
  params: GetFilteredProductsParams = {},
) {
  const { text, categorySlugs, brandSlugs, sort = 'newest' } = params;

  let categoryIds: number[] | undefined;
  if (categorySlugs && categorySlugs.length > 0) {
    const { data: categories } = await supabaseClient
      .from('categories')
      .select('id')
      .in('slug', categorySlugs);

    if (categories && categories.length > 0) {
      categoryIds = categories.map((cat) => cat.id);
    } else {
      return { data: [] };
    }
  }

  let brandIds: number[] | undefined;
  if (brandSlugs && brandSlugs.length > 0) {
    const { data: brands } = await supabaseClient
      .from('brands')
      .select('id')
      .in('slug', brandSlugs);

    if (brands && brands.length > 0) {
      brandIds = brands.map((brand) => brand.id);
    } else {
      return { data: [] };
    }
  }

  let query = supabaseClient.from('products').select(
    `
      *,
      category:categories(*),
      brand:brands(*)
    `,
  );

  if (text) {
    query = query.or(
      `name_fa.ilike.%${text}%,name_en.ilike.%${text}%,description.ilike.%${text}%`,
    );
  }

  if (categoryIds && categoryIds.length > 0) {
    query = query.in('category_id', categoryIds);
  }

  if (brandIds && brandIds.length > 0) {
    query = query.in('brand_id', brandIds);
  }

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
