'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export default function StorefrontPage() {
  const { slug } = useParams();
  const [vendor, setVendor] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<any[]>([]);
  const [ordering, setOrdering] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`https://vendora-production-9853.up.railway.app/vendor/slug/${slug}`)
      .then(r => r.json())
      .then(async (v) => {
        setVendor(v);
        const p = await fetch(`https://vendora-production-9853.up.railway.app/products/${v.id}`).then(r => r.json());
        setProducts(p);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const addToCart = (product: any) => {
    const existing = cart.find(c => c.id === product.id);
    if (existing) {
      setCart(cart.map(c => c.id === product.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(c => c.id !== id));
  };

  const total = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);

  const placeOrder = async () => {
    if (!form.name || !form.phone) { setError('Please enter your name and phone'); return; }
    setOrdering(true);
    setError('');
    try {
      const orderRes = await fetch(`https://vendora-production-9853.up.railway.app/orders/${vendor.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: form.name,
          customerPhone: form.phone,
          items: cart.map(c => ({ productId: c.id, quantity: c.quantity, price: c.price })),
        }),
      });
      const order = await orderRes.json();

      if (form.email) {
        const payRes = await fetch(`https://vendora-production-9853.up.railway.app/payments/initialize`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: form.email, amount: total, orderId: order.id }),
        });
        const pay = await payRes.json();
        if (pay.data?.authorization_url) {
          window.location.href = pay.data.authorization_url;
          return;
        }
      }

      setSuccess(`Order placed! ${vendor.whatsapp ? `Contact vendor on WhatsApp: ${vendor.whatsapp}` : ''}`);
      setCart([]);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setOrdering(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Loading store...</p>
    </div>
  );

  if (!vendor) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Store not found</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
              {vendor.businessName[0]}
            </div>
            <div>
              <p className="font-semibold">{vendor.businessName}</p>
              <p className="text-xs text-gray-500">vendora.shop/{vendor.slug}</p>
            </div>
          </div>
          {cart.length > 0 && (
            <Badge className="bg-green-600">{cart.length} items — ₦{total.toLocaleString()}</Badge>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-green-800 text-sm">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="font-semibold text-lg mb-4">Products</h2>
            {products.length === 0 ? (
              <p className="text-gray-500 text-sm">No products available yet.</p>
            ) : (
              <div className="grid gap-4">
                {products.map((p: any) => (
                  <Card key={p.id}>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{p.name}</p>
                          <p className="text-sm text-gray-500">{p.description}</p>
                          <p className="text-green-700 font-semibold mt-1">₦{p.price.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          {p.stock === 0 ? (
                            <Badge variant="destructive">Out of stock</Badge>
                          ) : (
                            <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => addToCart(p)}>
                              Add to cart
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-4">Your order</h2>
            {cart.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-gray-400 text-sm">
                  Add products to your cart
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-4 space-y-3">
                  {cart.map((c: any) => (
                    <div key={c.id} className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">{c.name}</p>
                        <p className="text-xs text-gray-500">x{c.quantity} — ₦{(c.price * c.quantity).toLocaleString()}</p>
                      </div>
                      <button onClick={() => removeFromCart(c.id)} className="text-xs text-red-400 hover:text-red-600">Remove</button>
                    </div>
                  ))}
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-green-700">₦{total.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Your name *</Label>
                      <Input placeholder="Amaka Obi" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">WhatsApp number *</Label>
                      <Input placeholder="+2348099887766" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Email (for online payment)</Label>
                      <Input type="email" placeholder="amaka@gmail.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                    </div>
                    {error && <p className="text-xs text-red-500">{error}</p>}
                    <Button className="w-full bg-green-600 hover:bg-green-700" onClick={placeOrder} disabled={ordering}>
                      {ordering ? 'Placing order...' : form.email ? 'Place order & pay online' : 'Place order'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}