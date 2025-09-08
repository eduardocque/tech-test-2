'use client';
import { useRouter } from 'next/navigation';
import { createContext, useState, useEffect, useMemo, useCallback } from 'react';

import api from '@/helpers/api';

import type { Session, User } from '../types';
import type { ReactNode } from 'react';

export type AuthProviderProps = { children: ReactNode };

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [user, setUser] = useState<User | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    const sid = localStorage.getItem('sessionId');
    const u = localStorage.getItem('user');
    if (sid && u) {
      setSessionId(sid);
      setUser(JSON.parse(u) as User);
    }
  }, []);

  const login = useCallback(
    async (usernameOrEmail: string, password: string) => {
      try {
        const { data: session } = await api.post<Session>('/sessions', {
          usernameOrEmail,
          password
        });

        const { data: fetchedUser } = await api.get<User>(`/users/${session.userId}`);
        const sId = String(session.id);

        setSessionId(sId);
        setUser(fetchedUser);
        localStorage.setItem('sessionId', sId);
        localStorage.setItem('user', JSON.stringify(fetchedUser));
        document.cookie = `sessionId=${sId}; path=/`;

        router.push('/dashboard');
      } catch (err: unknown) {
        if (err && typeof err === 'object' && 'response' in err) {
          const apiErr = err as { response?: { data?: { error: string } } };
          throw new Error(apiErr.response?.data?.error ?? 'Error signing in');
        }
        throw new Error('Unexpected error');
      }
    },
    [router]
  );

  const logout = useCallback(async () => {
    if (!sessionId) {
      return;
    }

    try {
      await api.patch(`/sessions/${sessionId}/terminate`);
    } finally {
      setSessionId(undefined);
      setUser(undefined);
      localStorage.removeItem('sessionId');
      localStorage.removeItem('user');
      document.cookie = 'sessionId=; Max-Age=0; path=/';
      router.push('/signin');
    }
  }, [router, sessionId]);

  const data = useMemo(() => ({ sessionId, user, login, logout }), [login, logout, sessionId, user]);

  return <AuthContext value={data}>{children}</AuthContext>;
};

export type AuthContextValue = {
  sessionId?: string;
  user?: User;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue>({} as AuthContextValue);

export default AuthContext;
