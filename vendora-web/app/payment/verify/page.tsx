'use client';
import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');

  useEffect(() => {
    const reference = searchParams.get('reference');
    if (!reference) { setStatus('failed'); return; }

    fetch(`https://vendora-production-9853.up.railway.app/payments/verify/${reference}`)
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
      <div className="bg-white rounded-xl border border-gray-100 p-10 text-center max-w-md w-full">
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
            <button onClick={() => router.back()} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition">
              Back to store
            </button>
          </>
        )}
        {status === 'failed' && (
          <>
            <p className="text-5xl mb-4">❌</p>
            <p className="text-xl font-semibold text-gray-800 mb-2">Payment failed</p>
            <p className="text-sm text-gray-500 mb-6">Something went wrong. Please try again.</p>
            <button onClick={() => router.back()} className="border border-gray-200 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium transition hover:bg-gray-50">
              Go back
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function PaymentVerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
