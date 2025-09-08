import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Home() {
  const sessionId = (await cookies()).get('sessionId')?.value;
  if (sessionId) {
    redirect('/dashboard');

    return undefined;
  }

  return (
    <main className="flex h-screen flex-col items-center justify-center text-center">
      <h1 className="mb-4 text-4xl font-bold">Welcome to Backoffice App</h1>
      <p className="mb-6 text-gray-600">Manage your users easily with our platform.</p>
      <div className="flex gap-4">
        <a href="/user/login" className="rounded bg-blue-500 px-4 py-2 text-white shadow">
          Sign In
        </a>
        <a href="/user/signup" className="rounded bg-gray-200 px-4 py-2 text-gray-800 shadow">
          Sign Up
        </a>
      </div>
    </main>
  );
}
