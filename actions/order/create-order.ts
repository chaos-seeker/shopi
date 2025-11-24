'use server';

import { supabaseClient } from '@/lib/supabase';
import { TOrder } from '@/types/order';

export async function createOrder(
  data: Omit<TOrder, 'id' | 'created_at' | 'updated_at'>,
) {
  if (process.env.NODE_ENV !== 'development') {
    return { error: 'دسترسی محدود شده است!' };
  }

  const { user, ...orderData } = data;
  const { data: order, error } = await supabaseClient
    .from('orders')
    .insert([{ ...orderData, user_id: user.id }])
    .select(
      `
      *,
      user:users(*)
    `,
    )
    .single();

  if (error) return { error: error.message };
  return { data: order };
}
