'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Mail, Lock, Phone, Store, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '', businessName: '', whatsapp: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.vendor.userId);
      localStorage.setItem('vendorId', data.vendor.id);
      localStorage.setItem('businessName', data.vendor.businessName);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
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
            Start selling smarter today
          </h1>
          <p className="text-green-100 text-lg">
            Join thousands of vendors managing their business on Vendora.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {['Track every order from inquiry to delivery', 'Accept payments via Paystack & Flutterwave', 'Get your own storefront link to share'].map(f => (
            <div key={f} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
              <p className="text-green-100 text-sm">{f}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <ShoppingBag className="text-green-600" size={24} />
            <span className="text-xl font-semibold">Vendora</span>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mb-1">Create your store</h2>
          <p className="text-gray-500 mb-8">Get started for free - no credit card needed</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business name</label>
              <div className="relative">
                <Store className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input placeholder="Zeeny Fashion" value={form.businessName} onChange={e => setForm({...form, businessName: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input placeholder="+2348012345678" value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
              </div>
            </div>

            <button onClick={handleRegister} disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition disabled:opacity-60">
              {loading ? 'Creating store...' : <>Create store <ArrowRight size={16} /></>}
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <a href="/login" className="text-green-600 font-medium hover:underline">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
}