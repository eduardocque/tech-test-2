'use client';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';

import api from '@/helpers/api';
import useAuth from '@hooks/useAuth';

import type { User } from '@/types';

const fetcher = <T = unknown,>(url: string) => api.get(url).then(res => res.data as T);

export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { data: users = [], mutate } = useSWR<User[]>('/users', fetcher<User[]>);
  const [page, setPage] = useState(1);

  const handleDelete = useCallback(
    async (id: number) => {
      await api.delete(`/users/${id}`);
      void mutate();
    },
    [mutate]
  );

  const handleClickLogout = useCallback(() => {
    void logout();
  }, [logout]);

  const handleClickPrevPage = useCallback(() => setPage(p => p - 1), []);

  const handleClickNextPage = useCallback(() => setPage(p => p + 1), []);

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [router, user]);

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between">
        <h1 className="text-xl font-bold">User Management</h1>
        <button className="rounded bg-red-500 px-4 py-2 text-white" onClick={handleClickLogout}>
          Log Out
        </button>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">First Name</th>
            <th className="border p-2">Last Name</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.slice((page - 1) * 6, page * 6).map(userItem => (
            <tr key={userItem.id}>
              <td className="border p-2">{userItem.id}</td>
              <td className="border p-2">{userItem.firstName}</td>
              <td className="border p-2">{userItem.lastName}</td>
              <td className="border p-2">{userItem.status}</td>
              <td className="border p-2">
                <button className="text-red-500" onClick={() => handleDelete(userItem.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación simple */}
      <div className="mt-4 flex gap-2">
        <button disabled={page === 1} onClick={handleClickPrevPage}>
          Prev
        </button>
        <span>Page {page}</span>
        <button disabled={users.length <= page * 6} onClick={handleClickNextPage}>
          Next
        </button>
      </div>
    </div>
  );
}
