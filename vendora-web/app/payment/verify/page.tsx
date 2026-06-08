'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function PaymentVerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');

  useEffect(() => {
    const reference = searchParams.get('reference');
    if (!reference) { setStatus('failed'); return; }

    fetch(`http://localhost:3000/payments/verify/${reference}`)
      .then(r => r.json())
      .then(data => {
        if (data.data?.status === 'success') {
          setStatus('success');
        } else {
          setStatus('failed');
        }
      })
      .catch(() => setStatus('failed'));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="pt-8 pb-8 text-center">
          {status === 'loading' && (
            <>
              <p className="text-4xl mb-4">⏳</p>
              <p className="font-medium text-gray-700">Verifying your payment...</p>
            </>
          )}
          {status === 'success' && (
            <>
              <p className="text-5xl mb-4">✅</p>
              <p className="text-xl font-semibold text-gray-800 mb-2">Payment successful!</p>
              <p className="text-sm text-gray-500 mb-6">Your order has been placed and the vendor has been notified.</p>
              <Button className="bg-green-600 hover:bg-green-700" onClick={() => router.back()}>
                Back to store
              </Button>
            </>
          )}
          {status === 'failed' && (
            <>
              <p className="text-5xl mb-4">❌</p>
              <p className="text-xl font-semibold text-gray-800 mb-2">Payment failed</p>
              <p className="text-sm text-gray-500 mb-6">Something went wrong. Please try again.</p>
              <Button variant="outline" onClick={() => router.back()}>
                Go back
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}