'use server';

import { cookies } from 'next/headers'; // cookie okuma yazma işlemi
import { createClient } from '@supabase/supabase-js';

// Supabase URL ve Anonim key'i env'den alıyoruz
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function loginAction(email: string, password: string) {
  // login işlemi burada yapılacak
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true, session: data.session };
}
