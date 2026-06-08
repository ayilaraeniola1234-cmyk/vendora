'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ClipboardList, ArrowLeft, ChevronRight } from 'lucide-react';

const STATUS_COLORS: any = {
  INQUIRY: 'bg-gray-100 text-gray-600',
  PENDING_PAYMENT: 'bg-yellow-50 text-yellow-700',
  PAID: 'bg-blue-50 text-blue-700',
  PACKAGING: 'bg-purple-50 text-purple-700',
  SHIPPED: 'bg-indigo-50 text-indigo-700',
  DELIVERED: 'bg-green-50 text-green-700',
};

const STATUS_ORDER = ['INQUIRY', 'PENDING_PAYMENT', 'PAID', 'PACKAGING', 'SHIPPED', 'DELIVERED'];

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const vendorId = typeof window !== 'undefined' ? localStorage.getItem('vendorId') : null;

  const loadOrders = async () => {
    const res = await fetch(`https://vendora-production-9853.up.railway.app/orders/${vendorId}`);
    const data = await res.json();
    setOrders(data);
    setLoading(false);
  };

  const updateStatus = async (orderId: string, status: string) => {
    await fetch(`https://vendora-production-9853.up.railway.app/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    loadOrders();
  };

  const nextStatus = (current: string) => {
    const idx = STATUS_ORDER.indexOf(current);
    return idx < STATUS_ORDER.length - 1 ? STATUS_ORDER[idx + 1] : null;
  };

  useEffect(() => {
    if (!vendorId) { router.push('/login'); return; }
    loadOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
          <button onClick={() => router.push('/dashboard')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition">
            <ArrowLeft size={15} /> Dashboard
          </button>
          <span className="text-gray-200">|</span>
          <div className="flex items-center gap-2">
            <ClipboardList size={16} className="text-gray-500" />
            <p className="font-medium text-sm text-gray-900">Orders</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {loading ? (
          <p className="text-gray-400 text-sm">Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ClipboardList className="text-gray-400" size={24} />
            </div>
            <p className="font-medium text-gray-700">No orders yet</p>
            <p className="text-sm text-gray-400 mt-1">Orders from your storefront will appear here</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {orders.map((o: any) => (
              <div key={o.id} className="bg-white border border-gray-100 rounded-xl px-5 py-4 hover:border-gray-200 transition">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{o.customer?.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{o.customer?.phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-700 text-sm">₦{o.total.toLocaleString()}</p>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium mt-1 inline-block ${STATUS_COLORS[o.status]}`}>
                      {o.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                  <p className="text-xs text-gray-400">
                    {o.items?.length} item(s) · {new Date(o.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                  {nextStatus(o.status) && (
                    <button onClick={() => updateStatus(o.id, nextStatus(o.status)!)}
                      className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700 font-medium transition">
                      Mark as {nextStatus(o.status)?.replace('_', ' ')} <ChevronRight size={13} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}