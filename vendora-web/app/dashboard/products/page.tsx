'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Plus, ArrowLeft, AlertTriangle, X } from 'lucide-react';

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', price: '', costPrice: '', stock: '' });
  const [saving, setSaving] = useState(false);

  const vendorId = typeof window !== 'undefined' ? localStorage.getItem('vendorId') : null;

  const loadProducts = async () => {
    const res = await fetch(`https://vendora-production-9853.up.railway.app/products/${vendorId}`);
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    if (!vendorId) { router.push('/login'); return; }
    loadProducts();
  }, []);

  const handleAdd = async () => {
    if (!form.name || !form.price || !form.stock) return;
    setSaving(true);
    await fetch(`https://vendora-production-9853.up.railway.app/products/${vendorId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        costPrice: parseFloat(form.costPrice),
        stock: parseInt(form.stock),
      }),
    });
    setForm({ name: '', description: '', price: '', costPrice: '', stock: '' });
    setAdding(false);
    setSaving(false);
    loadProducts();
  };

  const profit = (p: any) => p.costPrice ? p.price - p.costPrice : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/dashboard')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition">
              <ArrowLeft size={15} /> Dashboard
            </button>
            <span className="text-gray-200">|</span>
            <div className="flex items-center gap-2">
              <Package size={16} className="text-gray-500" />
              <p className="font-medium text-sm text-gray-900">Products</p>
            </div>
          </div>
          <button onClick={() => setAdding(true)}
            className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1.5 rounded-lg transition">
            <Plus size={15} /> Add product
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {adding && (
          <div className="bg-white border border-gray-100 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-medium text-gray-900">New product</h3>
              <button onClick={() => setAdding(false)} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Product name *</label>
                <input placeholder="Ankara Crop Top" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                <input placeholder="Brief description" value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Selling price (₦) *</label>
                <input type="number" placeholder="8500" value={form.price} onChange={e => setForm({...form, price: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Cost price (₦)</label>
                <input type="number" placeholder="4000" value={form.costPrice} onChange={e => setForm({...form, costPrice: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Stock quantity *</label>
                <input type="number" placeholder="15" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div className="flex items-end">
                <button onClick={handleAdd} disabled={saving}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium transition disabled:opacity-60">
                  {saving ? 'Saving...' : 'Save product'}
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <p className="text-gray-400 text-sm">Loading products...</p>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="text-gray-400" size={24} />
            </div>
            <p className="font-medium text-gray-700">No products yet</p>
            <p className="text-sm text-gray-400 mt-1">Click "Add product" to get started</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {products.map((p: any) => (
              <div key={p.id} className="bg-white border border-gray-100 rounded-xl px-5 py-4 flex items-center justify-between hover:border-gray-200 transition">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{p.name}</p>
                  {p.description && <p className="text-xs text-gray-400 mt-0.5">{p.description}</p>}
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-sm font-semibold text-green-700">₦{p.price.toLocaleString()}</span>
                    {p.costPrice && <span className="text-xs text-gray-400">Cost: ₦{p.costPrice.toLocaleString()}</span>}
                    {profit(p) && <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Profit: ₦{profit(p)!.toLocaleString()}</span>}
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${p.stock <= 5 ? 'bg-red-50 text-red-600' : p.stock <= 10 ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'}`}>
                    {p.stock <= 5 && <AlertTriangle size={10} className="inline mr-1" />}
                    {p.stock} in stock
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