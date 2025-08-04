'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import { isTokenExpired } from '@/lib/token';
import AccountCard, { Account } from './AccountCard';

export default function DashboardPage() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[] | null>(null);
  const [loading, setLoading] = useState(true);

  // Add account form state
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [balance, setBalance] = useState<number>(0);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token || isTokenExpired(token)) {
      router.push('/login');
      return;
    }

    axios
      .get('/accounts')
      .then((res) => {
        setAccounts(res.data.user || res.data);
      })
      .catch(() => {
        localStorage.removeItem('token');
        router.push('/login');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const handleAddAccount = async () => {
    if (!name || !type) {
      alert('Name and type are required');
      return;
    }

    try {
      const res = await axios.post('/accounts', {
        name,
        type,
        balance,
      });
      setAccounts((prev) => (prev ? [...prev, res.data] : [res.data]));
      setName('');
      setType('');
      setBalance(0);
      setShowForm(false);
    } catch (err) {
      alert('Failed to add account');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    
    <div className="max-w-1xl mx-auto p-1">
        <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Accounts</h1>
        <button
          onClick={handleLogout}
          className="text-sm bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
        >
          Logout
        </button>
      </div>
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-md">
      {(!accounts || accounts.length === 0) && (
        <div className="text-center text-gray-500 mb-4">
          <p>No accounts found. Add one below to get started.</p>
        </div>
      )}

      <div className="space-y-4">
{accounts?.map(account => (
  <AccountCard
    key={account.id}
    account={account}
    onDelete={(deletedId) =>
      setAccounts((prev) => prev?.filter((acc) => acc.id !== deletedId) || [])
    }
  />
))}
      </div>

      <div className="mt-8">
        {showForm ? (
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
  <h3 className="text-lg font-semibold mb-4">Add New Account</h3>
  <div className="space-y-3">
    <input
      type="text"
      placeholder="Account Name"
      value={name}
      onChange={(e) => setName(e.target.value)}
      className="w-full p-2 border rounded"
    />
    <select
      value={type}
      onChange={(e) => setType(e.target.value)}
      className="w-full p-2 border rounded"
    >
      <option value="" disabled>Select Account Type</option>
      <option value="cash">Cash</option>
      <option value="bank">Bank</option>
      <option value="credit_card">Credit Card</option>
      <option value="investment">Investment</option>
    </select>
    <input
      type="number"
      placeholder="Initial Balance"
      value={balance}
      onChange={(e) => setBalance(Number(e.target.value))}
      className="w-full p-2 border rounded"
    />
    <div className="flex gap-3 pt-2">
      <button
        onClick={handleAddAccount}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Save
      </button>
      <button
        onClick={() => setShowForm(false)}
        className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
      >
        Cancel
      </button>
    </div>
  </div>
</div>

        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded shadow"
          >
            + Add Account
          </button>
        )}
      </div>
      </div>
    </div>
  );
}
