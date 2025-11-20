'use server';

import { supabaseClient } from '@/lib/supabase';

export async function getMostExpensiveProducts(limit?: number) {
  const { data: products, error } = await supabaseClient
    .from('products')
    .select(
      `
      *,
      category:categories(*),
      brand:brands(*)
    `,
    )
    .order('price', { ascending: false });

  if (error) return { error: error.message };

  const productsWithFinalPrice = (products || []).map((product) => {
    const price = Number(product.price) || 0;
    const discount = Number(product.discount) || 0;
    const finalPrice = price * (1 - discount / 100);
    return { ...product, finalPrice };
  });

  const sortedProducts = productsWithFinalPrice.sort(
    (a, b) => b.finalPrice - a.finalPrice,
  );

  const result = limit ? sortedProducts.slice(0, limit) : sortedProducts;
  return { data: result };
}
