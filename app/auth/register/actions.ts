'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function register(email: string, password: string) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookies().get(name)?.value;
        },
        set(name, value, options) {
          cookies().set({ name, value, ...options });
        },
        remove(name, options) {
          cookies().set({ name, value: '', ...options });
        },
      },
    }
  );

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // ✅ cookie yazıldı → middleware session görür
  redirect('/');
}
