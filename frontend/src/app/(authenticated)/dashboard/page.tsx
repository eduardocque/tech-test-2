'use client';

import classNames from 'classnames';
import { useCallback, useState } from 'react';
import useSWR from 'swr';

import ThemeToggle from '@/components/ThemeToggle';
import api from '@/helpers/api';
import useAuth from '@hooks/useAuth';

import type { User } from '@/types';

const fetcher = <T = unknown,>(url: string) => api.get(url).then(res => res.data as T);

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { data: users = [], mutate } = useSWR<User[]>('/users', fetcher<User[]>);
  const [page, setPage] = useState(1);

  const handleToggleStatus = useCallback(
    async (id: number, status: 'active' | 'inactive') => {
      await api.patch(`/users/${id}`, { status });
      void mutate();
    },
    [mutate]
  );

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

  const handleClickPrevPage = useCallback(() => setPage(state => state - 1), []);

  const handleClickNextPage = useCallback(() => setPage(state => state + 1), []);

  return (
    <div className="min-h-screen bg-white p-6 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">User Management</h1>

        <div className="flex gap-2">
          <ThemeToggle />
          <button
            className="cursor-pointer rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
            onClick={handleClickLogout}
          >
            Log Out
          </button>
        </div>
      </div>

      <table className="w-full overflow-hidden rounded-md border border-gray-300 dark:border-gray-700">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800">
            <th className="border border-gray-300 p-2 dark:border-gray-700">ID</th>
            <th className="border border-gray-300 p-2 dark:border-gray-700">UserName</th>
            <th className="border border-gray-300 p-2 dark:border-gray-700">First Name</th>
            <th className="border border-gray-300 p-2 dark:border-gray-700">Last Name</th>
            <th className="border border-gray-300 p-2 dark:border-gray-700">Status</th>
            <th className="border border-gray-300 p-2 dark:border-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.slice((page - 1) * 6, page * 6).map(userItem => (
            <tr key={userItem.id} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="border border-gray-300 p-2 dark:border-gray-700">{userItem.id}</td>
              <td className="border border-gray-300 p-2 dark:border-gray-700">{userItem.username}</td>
              <td className="border border-gray-300 p-2 dark:border-gray-700">{userItem.firstName}</td>
              <td className="border border-gray-300 p-2 dark:border-gray-700">{userItem.lastName}</td>
              <td className="border border-gray-300 p-2 dark:border-gray-700">{userItem.status}</td>
              <td className="border border-gray-300 p-2 dark:border-gray-700">
                <button
                  className={classNames('mr-4 rounded border px-2 py-1 transition-colors', {
                    'cursor-pointer': userItem.id !== user?.id,
                    'cursor-not-allowed': userItem.id === user?.id,
                    'border-yellow-300 bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:border-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 dark:hover:bg-yellow-800':
                      userItem.status === 'active' && userItem.id !== user?.id,
                    'border-green-300 bg-green-100 text-green-800 hover:bg-green-200 dark:border-green-700 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800':
                      userItem.status === 'inactive' && userItem.id !== user?.id
                  })}
                  disabled={userItem.id === user?.id}
                  onClick={() => handleToggleStatus(userItem.id, userItem.status === 'active' ? 'inactive' : 'active')}
                >
                  {userItem.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  className={classNames(
                    'transition-colors',
                    userItem.id !== user?.id
                      ? 'cursor-pointer text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300'
                      : 'cursor-not-allowed text-gray-400 dark:text-gray-600'
                  )}
                  disabled={userItem.id === user?.id}
                  onClick={() => handleDelete(userItem.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex items-center gap-2">
        <button
          disabled={page === 1}
          onClick={handleClickPrevPage}
          className="rounded border border-gray-300 bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          Prev
        </button>
        <span>Page {page}</span>
        <button
          disabled={users.length <= page * 6}
          onClick={handleClickNextPage}
          className="rounded border border-gray-300 bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          Next
        </button>
      </div>
    </div>
  );
}
