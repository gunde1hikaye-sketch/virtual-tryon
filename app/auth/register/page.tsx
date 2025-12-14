'use client';

import { useState } from 'react';
import { register } from './actions';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    setLoading(true);
    setError('');

    const res = await register(email, password);

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    }
    // success → redirect server action + middleware
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">Register</h1>

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
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 p-2 rounded"
        >
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </div>
    </div>
  );
}
