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
    <main style={{ maxWidth: 500, margin: 'auto', textAlign: 'center', padding: '2rem' }}>
      <h1>Welcome to the App</h1>
      <p>Please login or signup to continue.</p>
      <div style={{ marginTop: '2rem' }}>
        <Link href="/login">
          <button style={{ marginRight: '1rem' }}>Login</button>
        </Link>
        <Link href="/signup">
          <button>Sign Up</button>
        </Link>
      </div>
    </main>
  );
}
