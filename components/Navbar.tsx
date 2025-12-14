'use client';

import { Sparkles } from 'lucide-react';
import { LogoutButton } from '@/components/LogoutButton';
import { useUser } from '@/lib/useUser';
import { useCredits } from '@/lib/useCredits';

export function Navbar() {
  const { user, loading } = useUser();
  const { credits, loading: creditsLoading } = useCredits();

  if (loading || !user) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <Sparkles className="w-6 h-6 text-purple-400" />
        <span className="text-lg font-semibold">
          Virtual Try-On Studio
        </span>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4 text-sm text-gray-300">
        {!creditsLoading && credits !== null && (
          <span className="px-3 py-1 rounded-full bg-white/10 text-xs">
            Credits: <span className="text-purple-300">{credits}</span>
          </span>
        )}

        <span className="hidden sm:block">{user.email}</span>

        <LogoutButton />
      </div>
    </header>
  );
}
