'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    /**
     * 🔑 EN ÖNEMLİ SATIRLAR
     * Cookie set edilir
     * App Router cache temizlenir
     * Middleware + useUser senkron olur
     */
    router.replace('/');
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">Login</h1>

        <input
          className="w-full p-2 rounded bg-white/10"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-2 rounded bg-white/10"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 p-2 rounded"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p
          className="text-sm text-gray-400 cursor-pointer"
          onClick={() => router.push('/auth/register')}
        >
          Don’t have an account? Register
        </p>
      </div>
    </div>
  );
}
