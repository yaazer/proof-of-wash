'use client';

import { useState } from 'react';
import { Bitcoin, Loader2, ExternalLink } from 'lucide-react';
import type { OrderContact } from '@/types';
import { useCartStore, formatCents } from '@/lib/cart';

interface Props {
  contact: OrderContact;
  totalCents: number;
}

export default function BTCPayButton({ contact, totalCents }: Props) {
  const items = useCartStore((s) => s.items);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const btcpayUrl = process.env.NEXT_PUBLIC_BTCPAY_URL;

  async function handleBitcoinPay() {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/btcpay/create-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact, totalCents, items }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error ?? 'Failed to create Bitcoin invoice. Please try again.');
        setLoading(false);
        return;
      }

      // Redirect to BTCPay checkout page
      window.location.href = data.checkoutLink;
    } catch {
      setError('Could not connect to BTCPay. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-start gap-3">
          <Bitcoin className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
          <div className="text-sm text-amber-800">
            <p className="font-semibold mb-1">Pay with Bitcoin</p>
            <p className="text-xs text-amber-700 leading-relaxed">
              You&apos;ll be redirected to our self-hosted BTCPay Server to complete payment.
              Supports on-chain and Lightning Network. Your order ships once payment confirms.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-linen-200 bg-linen-50 p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-charcoal-500">Order total (USD)</span>
          <span className="font-semibold">{formatCents(totalCents)}</span>
        </div>
        <div className="flex justify-between text-xs text-charcoal-400">
          <span>BTC equivalent</span>
          <span>Calculated at time of invoice</span>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!btcpayUrl && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
          BTCPay is not configured. Set <code>NEXT_PUBLIC_BTCPAY_URL</code> in your environment.
        </div>
      )}

      <button
        onClick={handleBitcoinPay}
        disabled={loading || !btcpayUrl}
        className="btn-bitcoin w-full justify-center"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Creating invoice…
          </>
        ) : (
          <>
            <Bitcoin className="h-4 w-4" />
            Pay with Bitcoin
            <ExternalLink className="h-3.5 w-3.5 opacity-70" />
          </>
        )}
      </button>

      <p className="text-center text-xs text-charcoal-400">
        Invoice valid for 15 minutes. Order held until payment confirms.
      </p>
    </div>
  );
}
