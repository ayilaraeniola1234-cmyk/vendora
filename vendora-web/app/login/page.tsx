'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Mail, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('https://vendora-production-9853.up.railway.app/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.vendor.userId);
      localStorage.setItem('vendorId', data.vendor.id);
      localStorage.setItem('businessName', data.vendor.businessName);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex w-1/2 bg-green-600 flex-col justify-between p-12">
        <div className="flex items-center gap-2">
          <ShoppingBag className="text-white" size={28} />
          <span className="text-white text-2xl font-semibold">Vendora</span>
        </div>
        <div>
          <h1 className="text-white text-4xl font-semibold leading-tight mb-4">
            The commerce OS for African vendors
          </h1>
          <p className="text-green-100 text-lg">
            Manage products, orders, customers and payments - all in one place.
          </p>
        </div>
        <div className="flex gap-8">
          <div>
            <p className="text-white text-2xl font-semibold">₦0</p>
            <p className="text-green-100 text-sm">to get started</p>
          </div>
          <div>
            <p className="text-white text-2xl font-semibold">5 min</p>
            <p className="text-green-100 text-sm">to set up your store</p>
          </div>
          <div>
            <p className="text-white text-2xl font-semibold">100%</p>
            <p className="text-green-100 text-sm">built for Nigeria</p>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <ShoppingBag className="text-green-600" size={24} />
            <span className="text-xl font-semibold">Vendora</span>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mb-1">Welcome back</h2>
          <p className="text-gray-500 mb-8">Sign in to your vendor account</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition disabled:opacity-60"
            >
              {loading ? 'Signing in...' : <>Sign in <ArrowRight size={16} /></>}
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            No account?{' '}
            <a href="/register" className="text-green-600 font-medium hover:underline">
              Create your store
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}