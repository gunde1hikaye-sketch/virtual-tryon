'use client';

import { useTransition } from 'react';
import { logout } from '@/app/auth/logout/actions';

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => logout())}
      disabled={isPending}
      className="text-sm text-red-400 hover:text-red-300 transition disabled:opacity-50"
    >
      {isPending ? 'Logging out…' : 'Logout'}
    </button>
  );
}
