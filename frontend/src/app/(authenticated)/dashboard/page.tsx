'use client';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import useSWR from 'swr';

import api from '@/helpers/api';
import useAuth from '@hooks/useAuth';

const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { data: users, mutate } = useSWR('/users', fetcher);
  const [page, setPage] = useState(1);

  if (!user) {
    router.push('/user/login');

    return null;
  }

  const handleDelete = useCallback(async (id: number) => {
    await api.delete(`/users/${id}`);
    mutate();
  }, []);

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between">
        <h1 className="text-xl font-bold">User Management</h1>
        <button
          className="rounded bg-red-500 px-4 py-2 text-white"
          onClick={() => {
            logout();
            router.push('/user/login');
          }}
        >
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
          {users?.slice((page - 1) * 6, page * 6).map((u: any) => (
            <tr key={u.id}>
              <td className="border p-2">{u.id}</td>
              <td className="border p-2">{u.firstName}</td>
              <td className="border p-2">{u.lastName}</td>
              <td className="border p-2">{u.status}</td>
              <td className="border p-2">
                <button className="text-red-500" onClick={() => handleDelete(u.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación simple */}
      <div className="mt-4 flex gap-2">
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>
          Prev
        </button>
        <span>Page {page}</span>
        <button disabled={users?.length <= page * 6} onClick={() => setPage(p => p + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
