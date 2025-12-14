'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase-client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // 🔴 EN KRİTİK SATIR
    setLoading(true);
    setError('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    if (!data.session) {
      setError('Login failed. Please try again.');
      return;
    }

    // ✅ HARD REDIRECT (middleware + cookie %100 senkron)
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Login</h1>

        <input
          className="w-full p-2 rounded bg-white/10"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          className="w-full p-2 rounded bg-white/10"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <p className="text-red-400 text-sm text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 p-2 rounded"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p
          className="text-sm text-gray-400 text-center cursor-pointer"
          onClick={() => (window.location.href = '/auth/register')}
        >
          Don’t have an account? Register
        </p>
      </form>
    </div>
  );
}
