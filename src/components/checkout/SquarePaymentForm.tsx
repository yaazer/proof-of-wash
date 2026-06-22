'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Loader2 } from 'lucide-react';
import type { OrderContact } from '@/types';
import { useCartStore } from '@/lib/cart';

interface Props {
  contact: OrderContact;
  totalCents: number;
}

declare global {
  interface Window {
    Square?: {
      payments: (appId: string, locationId: string) => Promise<SquarePayments>;
    };
  }
}

interface SquarePayments {
  card: () => Promise<SquareCard>;
}

interface SquareCard {
  attach: (selector: string) => Promise<void>;
  tokenize: () => Promise<{ status: string; token?: string; errors?: unknown[] }>;
}

export default function SquarePaymentForm({ contact, totalCents }: Props) {
  const router = useRouter();
  const cardRef = useRef<SquareCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);

  const appId = process.env.NEXT_PUBLIC_SQUARE_APP_ID ?? '';
  const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID ?? '';

  useEffect(() => {
    if (!appId || !locationId) {
      setError('Square is not configured. Set NEXT_PUBLIC_SQUARE_APP_ID and NEXT_PUBLIC_SQUARE_LOCATION_ID.');
      setLoading(false);
      return;
    }

    // Load Square Web Payments SDK
    const script = document.createElement('script');
    script.src = 'https://sandbox.web.squarecdn.com/v1/square.js';
    script.onload = async () => {
      try {
        const payments = await window.Square!.payments(appId, locationId);
        const card = await payments.card();
        await card.attach('#square-card-container');
        cardRef.current = card;
        setLoading(false);
      } catch (err) {
        setError('Failed to load payment form. Please refresh and try again.');
        setLoading(false);
      }
    };
    script.onerror = () => {
      setError('Failed to load Square SDK. Please check your connection.');
      setLoading(false);
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [appId, locationId]);

  async function handlePay() {
    if (!cardRef.current) return;
    setError(null);
    setSubmitting(true);

    try {
      const result = await cardRef.current.tokenize();
      if (result.status !== 'OK' || !result.token) {
        setError('Card tokenization failed. Please check your card details.');
        setSubmitting(false);
        return;
      }

      const res = await fetch('/api/square/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: result.token,
          amountCents: totalCents,
          contact,
          items,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error ?? 'Payment failed. Please try again.');
        setSubmitting(false);
        return;
      }

      clearCart();
      router.push(`/order-confirmation?method=square&orderId=${data.paymentId}`);
    } catch {
      setError('An unexpected error occurred. Please try again.');
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Square card container */}
      <div>
        <label className="label">Card Details</label>
        <div
          id="square-card-container"
          className={`min-h-[56px] rounded-xl border border-linen-300 bg-white px-4 py-3 transition-colors ${
            loading ? 'animate-pulse bg-linen-50' : ''
          }`}
        />
        {loading && (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-charcoal-400">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading payment form…
          </p>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        onClick={handlePay}
        disabled={loading || submitting}
        className="btn-primary w-full justify-center"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Processing…
          </>
        ) : (
          <>
            <Lock className="h-4 w-4" /> Pay with Card
          </>
        )}
      </button>

      <p className="text-center text-xs text-charcoal-400">
        Payments processed securely by Square. Your card info never touches our servers.
      </p>
    </div>
  );
}
