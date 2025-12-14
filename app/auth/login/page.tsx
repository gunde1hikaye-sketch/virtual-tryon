'use client';

import { useState } from 'react';
import { login } from './actions';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    const res = await login(email, password);

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    }
    // success → redirect server-action + middleware
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-sm space-y-5">
        <h1 className="text-2xl font-bold text-center">Login</h1>

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

        {error && (
          <p className="text-red-400 text-sm text-center">{error}</p>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 p-2 rounded transition"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {/* 👇 REGISTER LINK */}
        <p className="text-sm text-center text-gray-400">
          Don’t have an account?{' '}
          <span
            onClick={() => router.push('/auth/register')}
            className="text-purple-400 hover:underline cursor-pointer"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}
