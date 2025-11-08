'use server';

import { supabaseClient } from '@/lib/supabase';
import { randomBytes, scrypt as _scrypt, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

const hashPassword = async (password: string, salt?: string) => {
  const saltBuf = salt ? Buffer.from(salt, 'hex') : randomBytes(16);
  const hash = (await scrypt(password, saltBuf, 64)) as Buffer;
  return { salt: saltBuf.toString('hex'), hash: hash.toString('hex') };
};

const verifyPassword = async (stored: string, password: string) => {
  const [saltHex, hashHex] = stored.split(':');
  const { hash } = await hashPassword(password, saltHex);
  const a = Buffer.from(hashHex, 'hex');
  const b = Buffer.from(hash, 'hex');
  return a.length === b.length && timingSafeEqual(a, b);
};

export async function auth(input: {
  full_name: string;
  username: string;
  password: string;
}) {
  const { data: existing } = await supabaseClient
    .from('users')
    .select('*')
    .eq('username', input.username.trim())
    .single();

  if (!existing) {
    const { salt, hash } = await hashPassword(input.password);
    const { data: user, error } = await supabaseClient
      .from('users')
      .insert([
        {
          full_name: input.full_name.trim(),
          username: input.username.trim(),
          password: `${salt}:${hash}`,
        },
      ])
      .select()
      .single();

    if (error) return { ok: false, error: error.message };
    return { ok: true, status: 'registered' as const, user };
  }

  if (existing.full_name !== input.full_name.trim()) {
    return { ok: false, error: 'نام کامل با نام کاربری مطابقت ندارد' };
  }

  const isValid = await verifyPassword(existing.password, input.password);
  if (!isValid)
    return { ok: false, error: 'نام کاربری یا رمز عبور اشتباه است' };

  return { ok: true, status: 'logged_in' as const, user: existing };
}
