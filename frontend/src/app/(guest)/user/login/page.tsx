'use client';

import { useCallback, useState } from 'react';

import useAuth from '@hooks/useAuth';

import type { ChangeEvent } from 'react';

export default function SignInPage() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');
  const { login } = useAuth();

  const handleChangeUsernameOrEmail = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setUsernameOrEmail(e.target.value),
    []
  );

  const handleChangePassword = useCallback((e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value), []);

  const handleSignIn = async () => {
    try {
      await login(usernameOrEmail, password);
    } catch (e: unknown) {
      setError((e as Error).message);
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="mb-4 text-2xl">Sign In</h1>

      <input
        className="mb-2 w-64 border p-2"
        placeholder="Username or Email"
        value={usernameOrEmail}
        onChange={handleChangeUsernameOrEmail}
      />

      <input
        className="mb-2 w-64 border p-2"
        placeholder="Password"
        type="password"
        value={password}
        onChange={handleChangePassword}
      />

      {error && <p className="mb-2 text-red-500">{error}</p>}

      <button className="w-64 rounded bg-blue-500 px-4 py-2 text-white" onClick={handleSignIn}>
        Sign In
      </button>

      <p className="mt-2 text-sm">
        Don't have an account?{' '}
        <a className="text-blue-500" href="/user/signup">
          Sign Up
        </a>
      </p>
    </div>
  );
}
