'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from '@/lib/axios';

interface Account {
  id: number;
  name: string;
  type: string;
  balance: string;
  createdAt: string;
}

interface Category {
  id: number;
  type: string;
  name: string;
}

interface Transaction {
  id: number;
  amount: number;
  description: string;
  accountId: number;
  categoryId: number; 
  createdAt: string;
  type: 'income' | 'expense';
}

export default function AccountPage() {
  const { id } = useParams();
  const router = useRouter();

  const [account, setAccount] = useState<Account | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [newType, setNewType] = useState('expense');
  const [form, setForm] = useState({
    amount: '',
    description: '',
    categoryId: '',
    date: '',
    type: 'expense',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [accRes, catRes, trxRes] = await Promise.all([
          axios.get(`/accounts/${id}`),
          axios.get(`/category/account/${id}`),
          axios.get(`/transactions/account/${id}`),
        ]);
        setAccount(accRes.data);
        setCategories(catRes.data);
        setTransactions(trxRes.data);
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  async function reloadTransactions() {
    try {
      const trxRes = await axios.get(`/transactions/account/${id}`);
      setTransactions(trxRes.data);
    } catch {
      alert('Failed to refresh transactions');
    }
  }

  async function reloadAccount() {
    try {
      const accRes = await axios.get(`/accounts/${id}`);
      setAccount(accRes.data);
    } catch {
      alert('Failed to refresh account data');
    }
  }

  async function handleTransactionSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await axios.post('/transactions', {
        accountId: Number(id),
        ...form,
        amount: parseFloat(form.amount),
      });
      setForm({
        amount: '',
        description: '',
        categoryId: '',
        date: '',
        type: 'expense',
      });
      await reloadTransactions();
      await reloadAccount();
    } catch {
      alert('Failed to add transaction');
    }
  }

  async function handleDeleteTransaction(transactionId: number) {
    if (!confirm('Are you sure you want to delete this transaction?')) return;
    try {
      await axios.delete(`/transactions/${transactionId}`);
      setTransactions(transactions.filter((t) => t.id !== transactionId));
      await reloadAccount();
    } catch {
      alert('Failed to delete transaction');
    }
  }

  async function handleCategoryAdd() {
    if (!newCategory.trim()) return;
    try {
      const res = await axios.post('/category', { accountId: id, name: newCategory, type: newType });
      setCategories([...categories, res.data]);
      setNewCategory('');
    } catch {
      alert('Failed to add category');
    }
  }

  async function handleDeleteCategory(categoryId: number) {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await axios.delete(`/category/${categoryId}`);
      setCategories(categories.filter((cat) => cat.id !== categoryId));
    } catch {
      alert('Failed to delete category');
    }
  }

  if (loading) return <p>Loading...</p>;
  if (!account) return <p>Account not found</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <button onClick={() => router.push('/dashboard')} style={backButtonStyle}>
        ← Back to Dashboard
      </button>

      <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
        <div style={{ flex: '0 0 75%' }}>
          <div style={{ marginBottom: '2rem', padding: '1.5rem', borderRadius: '1rem', background: '#f8f9fa', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <h1 style={{ marginBottom: '0.5rem' }}>{account.name}</h1>
            <p><strong>Type:</strong> {account.type}</p>
            <p><strong>Balance:</strong> ${Number(account.balance).toLocaleString()}</p>
          </div>

          <section style={{ marginBottom: '2.5rem' }}>
            <h2>Add Transaction</h2>
            <form onSubmit={handleTransactionSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <input
                type="number"
                step="0.01"
                placeholder="Amount"
                required
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                style={inputStyle}
              />

              <input
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                style={inputStyle}
              />

              <select
                required
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                style={inputStyle}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>

              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                style={inputStyle}
              />

              <select
                required
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                style={inputStyle}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>

              <button type="submit" style={buttonStyle}>Add Transaction</button>
            </form>
          </section>

          <section>
            <h2>Create New Category</h2>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <input
                placeholder="Category Name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                style={{ ...inputStyle, flex: 1 }}
              />
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                style={{ ...inputStyle, flex: 1 }}
              >
                <option value="" disabled>Select category type</option>
                <option value="income">Income</option>
                <option value="expense">Expenses</option>
              </select>
              <button onClick={handleCategoryAdd} style={buttonStyle}>Add</button>
            </div>
          </section>

          <section style={{ marginTop: '4rem' }}>
            <h2>Categories</h2>
            {categories.length === 0 ? (
              <p style={{ color: '#777' }}>No categories found.</p>
            ) : (
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={tableHeaderStyle}>Name</th>
                    <th style={tableHeaderStyle}>Type</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat.id}>
                      <td style={tableCellStyle}>{cat.name}</td>
                      <td style={tableCellStyle}>{cat.type}</td>
                      <td style={tableCellStyle}>
                        <button onClick={() => handleDeleteCategory(cat.id)} style={deleteBtnStyle}>×</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </div>

        <div style={{ flex: '0 0 25%' }}>
          <h2>Transactions</h2>
          {transactions.length === 0 ? (
            <p style={{ color: '#777' }}>No transactions found.</p>
          ) : (
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={tableHeaderStyle}>Amount</th>
                  <th style={tableHeaderStyle}>Type</th>
                  <th style={tableHeaderStyle}>Cat</th>
                  <th style={tableHeaderStyle}>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((trx) => (
                  <tr key={trx.id}>
                    <td style={tableCellStyle}>${trx.amount}</td>
                    <td style={tableCellStyle}>{trx.type}</td>
                    <td style={tableCellStyle}>
                      {categories.find((c) => c.id === trx.categoryId)?.name || '-'}
                    </td>
                    <td style={tableCellStyle}>{new Date(trx.createdAt).toLocaleDateString()}</td>
                    <td style={tableCellStyle}>
                      <button onClick={() => handleDeleteTransaction(trx.id)} style={deleteBtnStyle}>×</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

// 🎨 Styles

const inputStyle: React.CSSProperties = {
  padding: '0.75rem 1rem',
  borderRadius: '0.5rem',
  border: '1px solid #ccc',
  fontSize: '1rem',
  width: '100%',
};

const buttonStyle: React.CSSProperties = {
  padding: '0.75rem 1.25rem',
  backgroundColor: '#0070f3',
  color: '#fff',
  border: 'none',
  borderRadius: '0.5rem',
  fontSize: '1rem',
  cursor: 'pointer',
};

const deleteBtnStyle: React.CSSProperties = {
  padding: '0.4rem 0.75rem',
  backgroundColor: '#ff4d4f',
  color: 'white',
  border: 'none',
  borderRadius: '0.25rem',
  cursor: 'pointer',
};

const backButtonStyle: React.CSSProperties = {
  padding: '0.5rem 1rem',
  fontSize: '1rem',
  backgroundColor: '#f1f1f1',
  color: '#0070f3',
  border: '1px solid #ccc',
  borderRadius: '0.5rem',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
};

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '1rem',
};

const tableCellStyle: React.CSSProperties = {
  padding: '0.5rem',
  borderBottom: '1px solid #eee',
  fontSize: '0.875rem',
};

const tableHeaderStyle: React.CSSProperties = {
  ...tableCellStyle,
  fontWeight: 600,
  textAlign: 'left',
};
