'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, ArrowLeft, Crown } from 'lucide-react';

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const vendorId = typeof window !== 'undefined' ? localStorage.getItem('vendorId') : null;

  useEffect(() => {
    if (!vendorId) { router.push('/login'); return; }
    Promise.all([
      fetch(`http://localhost:3000/customers/${vendorId}`).then(r => r.json()),
      fetch(`http://localhost:3000/customers/${vendorId}/stats`).then(r => r.json()),
    ]).then(([c, s]) => {
      setCustomers(c);
      setStats(s);
      setLoading(false);
    });
  }, []);

  const initials = (name: string) => name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
          <button onClick={() => router.push('/dashboard')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition">
            <ArrowLeft size={15} /> Dashboard
          </button>
          <span className="text-gray-200">|</span>
          <div className="flex items-center gap-2">
            <Users size={16} className="text-gray-500" />
            <p className="font-medium text-sm text-gray-900">Customers</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {stats && (
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total', value: stats.total },
              { label: 'VIP', value: stats.vip },
              { label: 'Repeat buyers', value: stats.repeat },
              { label: 'Inactive', value: stats.inactive },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white border border-gray-100 rounded-xl p-4">
                <p className="text-2xl font-semibold text-gray-900">{value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        )}

        {loading ? (
          <p className="text-gray-400 text-sm">Loading customers...</p>
        ) : customers.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="text-gray-400" size={24} />
            </div>
            <p className="font-medium text-gray-700">No customers yet</p>
            <p className="text-sm text-gray-400 mt-1">Customers are added automatically when orders are placed</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {customers.map((c: any) => (
              <div key={c.id} className="bg-white border border-gray-100 rounded-xl px-5 py-4 flex items-center justify-between hover:border-gray-200 transition">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-700 text-xs font-semibold">{initials(c.name)}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="font-medium text-gray-900 text-sm">{c.name}</p>
                      {c.orders?.length >= 3 && <Crown size={12} className="text-yellow-500" />}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{c.phone || c.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                    {c.orders?.length || 0} order{c.orders?.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}