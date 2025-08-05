'use client';

import React from 'react';
import Link from 'next/link';
import axios from '@/lib/axios';

export interface Account {
  id: number;
  userId: number;
  name: string;
  type: string;
  balance: string;
  createdAt: string;
}

export default function AccountCard({
  account,
  onDelete,
}: {
  account: Account;
  onDelete?: (id: number) => void;
}) {

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault(); // prevent navigating via Link

    if (!confirm(`Are you sure you want to delete "${account.name}"?`)) return;

    try {
      await axios.delete(`/accounts/${account.id}`);
      if (onDelete) onDelete(account.id);
    } catch (err) {
      alert('Failed to delete account');
    }
  };

  return (
    <Link
      href={`/account/${account.id}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div
        style={{
          border: '1px solid #ccc',
          borderRadius: '1rem',
          padding: '1.5rem',
          marginBottom: '1rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          background: '#fff',
          cursor: 'pointer',
          transition: 'transform 0.1s ease-in-out',
          position: 'relative',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.01)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <h2 style={{ marginBottom: '0.5rem' }}>{account.name}</h2>
        <p><strong>Type:</strong> {account.type}</p>
        <p><strong>Balance:</strong> ${Number(account.balance).toLocaleString()}</p>
        <p style={{ fontSize: '0.875rem', color: '#555' }}>
          <strong>Created:</strong> {new Date(account.createdAt).toLocaleDateString()}
        </p>
        <button
          onClick={handleDelete}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            padding: '0.4rem 0.8rem',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '0.875rem',
          }}
        >
          Delete
        </button>
      </div>
    </Link>
  );
}
