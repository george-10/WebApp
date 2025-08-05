'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isTokenExpired } from '@/lib/token';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token && !isTokenExpired(token)) {
      router.push('/dashboard');
    }
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to the App</h1>
        <p className="text-gray-600">Please log in or sign up to continue.</p>
        <div className="mt-6 flex justify-center gap-4">
          <Link href="/login">
            <button className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition">
              Login
            </button>
          </Link>
          <Link href="/signup">
            <button className="px-5 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
