'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Package, ClipboardList, Users, TrendingUp, AlertTriangle, ExternalLink, LogOut, ChevronRight } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) { router.push('/login'); return; }
    fetch(`http://localhost:3000/vendor/dashboard/${userId}`)
      .then(res => res.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => router.push('/login'));
  }, []);

  const logout = () => { localStorage.clear(); router.push('/login'); };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <ShoppingBag className="text-green-600 mx-auto mb-3" size={32} />
        <p className="text-gray-500 text-sm">Loading your dashboard...</p>
      </div>
    </div>
  );

  const { vendor, stats, lowStock } = data;

  const statCards = [
    { label: 'Total revenue', value: `₦${stats.revenue.toLocaleString()}`, icon: TrendingUp, color: 'bg-green-50 text-green-600' },
    { label: 'Total orders', value: stats.totalOrders, icon: ClipboardList, color: 'bg-blue-50 text-blue-600' },
    { label: 'Products', value: stats.totalProducts, icon: Package, color: 'bg-purple-50 text-purple-600' },
    { label: 'Customers', value: stats.totalCustomers, icon: Users, color: 'bg-orange-50 text-orange-600' },
  ];

  const navItems = [
    { label: 'Products', desc: 'Manage your inventory', icon: Package, href: '/dashboard/products' },
    { label: 'Orders', desc: 'Track and fulfill orders', icon: ClipboardList, href: '/dashboard/orders' },
    { label: 'Customers', desc: 'View your CRM', icon: Users, href: '/dashboard/customers' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-green-600 rounded-lg flex items-center justify-center">
              <ShoppingBag className="text-white" size={18} />
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-900">{vendor.businessName}</p>
              <div className="flex items-center gap-1">
                <p className="text-xs text-gray-400">vendora.shop/{vendor.slug}</p>
                <a href={`/store/${vendor.slug}`} target="_blank" className="text-green-600 hover:text-green-700">
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>
          </div>
          <button onClick={logout} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition">
            <LogOut size={15} />
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Here's what's happening with your store</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-100 p-5">
              <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center mb-3`}>
                <Icon size={18} />
              </div>
              <p className="text-2xl font-semibold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {lowStock.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="text-amber-600" size={16} />
              <p className="text-sm font-medium text-amber-800">Low stock alert</p>
            </div>
            {lowStock.map((p: any) => (
              <div key={p.id} className="flex justify-between items-center py-2 border-b border-amber-100 last:border-0">
                <p className="text-sm text-amber-900">{p.name}</p>
                <span className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full">{p.stock} left</span>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {navItems.map(({ label, desc, icon: Icon, href }) => (
            <button key={label} onClick={() => router.push(href)}
              className="bg-white border border-gray-100 rounded-xl p-5 text-left hover:border-green-200 hover:shadow-sm transition group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-green-50 transition">
                  <Icon className="text-gray-500 group-hover:text-green-600 transition" size={18} />
                </div>
                <ChevronRight className="text-gray-300 group-hover:text-green-400 transition" size={16} />
              </div>
              <p className="font-medium text-gray-900 text-sm">{label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}