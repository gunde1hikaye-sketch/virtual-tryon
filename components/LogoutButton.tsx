'use client';

import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/auth/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-red-400 hover:text-red-300 transition"
    >
      Logout
    </button>
  );
}
