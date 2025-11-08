'use server';

import { supabaseClient } from '@/lib/supabase';

export async function getUserOrders(userId: number) {
  const { data: orders, error } = await supabaseClient
    .from('orders')
    .select(
      `
      *,
      user:users(*)
    `,
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) return { error: error.message };
  return { data: orders };
}
