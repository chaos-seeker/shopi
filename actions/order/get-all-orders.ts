'use server';

import { supabaseClient } from '@/lib/supabase';

export async function getAllOrders() {
  const { data: orders, error } = await supabaseClient
    .from('orders')
    .select(
      `
      *,
      user:users(*)
    `,
    )
    .order('created_at', { ascending: false });

  if (error) return { error: error.message };
  return { data: orders };
}
