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

  const setUserSession = useCallback((user: User, session: Session) => {
    const sId = String(session.id);
    setSessionId(sId);
    setUser(user);
    localStorage.setItem('sessionId', sId);
    localStorage.setItem('user', JSON.stringify(user));
    document.cookie = `sessionId=${sId}; path=/`;
  }, []);

  const login = useCallback(
    async (usernameOrEmail: string, password: string) => {
      try {
        const {
          data: { user: fetchedUser, session }
        } = await api.post<{ user: User; session: Session }>('/login', { usernameOrEmail, password });
        setUserSession(fetchedUser, session);
        router.push('/dashboard');
      } catch (err: unknown) {
        if (err && typeof err === 'object' && 'response' in err) {
          const apiErr = err as { response?: { data?: { error: string } } };
          throw new Error(apiErr.response?.data?.error ?? 'Error signing in');
        }
        throw new Error('Unexpected error');
      }
    },
    [router, setUserSession]
  );

  const signup = useCallback(
    async (
      userData: Omit<User, 'id' | 'status' | 'createdAt' | 'updatedAt'> & { password: string; password_repeat: string }
    ) => {
      const { username, email, password, password_repeat, firstName, lastName } = userData;
      if (password !== password_repeat) {
        throw new Error('Passwords do not match');
      }

      try {
        const {
          data: { user: newUser, session }
        } = await api.post<{ user: User; session: Session }>('/register', {
          username,
          email,
          password,
          firstName,
          lastName
        });

        setUserSession(newUser, session);
        router.push('/dashboard');
      } catch (err: unknown) {
        if (err && typeof err === 'object' && 'response' in err) {
          const apiErr = err as { response?: { data?: { error: string } } };
          throw new Error(apiErr.response?.data?.error ?? 'Error signing up');
        }
        throw new Error('Unexpected error');
      }
    },
    [router, setUserSession]
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
      router.push('/');
    }
  }, [router, sessionId]);

  const data = useMemo(() => ({ sessionId, user, login, signup, logout }), [login, signup, logout, sessionId, user]);

  return <AuthContext value={data}>{children}</AuthContext>;
};

export type AuthContextValue = {
  sessionId?: string;
  user?: User;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  signup: (
    userData: Omit<User, 'id' | 'status' | 'createdAt' | 'updatedAt'> & { password: string; password_repeat: string }
  ) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({} as AuthContextValue);

export default AuthContext;
