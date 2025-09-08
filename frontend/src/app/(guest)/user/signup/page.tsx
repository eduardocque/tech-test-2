'use client';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

import api from '@/helpers/api';
import useAuth from '@hooks/useAuth';

export default function SignUpPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleSignUp = useCallback(async () => {
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    try {
      const userRes = await api.post('/users', { firstName, lastName, status: 'active' });
      const sessionRes = await api.post('/sessions', { userId: userRes.data.id });
      login(sessionRes.data.id, userRes.data);
      router.push('/dashboard');
    } catch (e: unknown) {
      setError((e as unknown).response?.data?.error || 'Error signing up');
    }
  }, [confirm, firstName, lastName, login, password, router]);

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="mb-4 text-2xl">Sign Up</h1>
      <input
        className="mb-2 border p-2"
        placeholder="First Name"
        value={firstName}
        onChange={e => setFirstName(e.target.value)}
      />
      <input
        className="mb-2 border p-2"
        placeholder="Last Name"
        value={lastName}
        onChange={e => setLastName(e.target.value)}
      />
      <input
        type="password"
        className="mb-2 border p-2"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <input
        type="password"
        className="mb-2 border p-2"
        placeholder="Confirm Password"
        value={confirm}
        onChange={e => setConfirm(e.target.value)}
      />
      {error && <p className="mb-2 text-red-500">{error}</p>}
      <button className="rounded bg-blue-500 px-4 py-2 text-white" onClick={handleSignUp}>
        Register
      </button>
      <p className="mt-2 text-sm">
        Already have an account?{' '}
        <a className="text-blue-500" href="/user/login">
          Sign In
        </a>
      </p>
    </div>
  );
}
