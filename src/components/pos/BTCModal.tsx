'use client';

import { useState, useEffect } from 'react';
import { X, Bitcoin, Loader, Check, ExternalLink } from 'lucide-react';
import { formatCents } from '@/lib/cart';

interface Props {
  total: number;
  onComplete: (invoiceId: string) => Promise<void>;
  onClose: () => void;
}

type State = 'idle' | 'loading' | 'waiting' | 'settled' | 'expired' | 'error';

export default function BTCModal({ total, onComplete, onClose }: Props) {
  const [state, setState] = useState<State>('idle');
  const [invoiceId, setInvoiceId] = useState('');
  const [checkoutLink, setCheckoutLink] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const createInvoice = async () => {
    setState('loading');
    try {
      const res = await fetch('/api/pos/btcpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ totalCents: total, note: 'Proof of Wash POS' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to create invoice');
      setInvoiceId(data.invoiceId);
      setCheckoutLink(data.checkoutLink);
      setState('waiting');
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : 'Failed to create invoice');
      setState('error');
    }
  };

  useEffect(() => {
    if (state !== 'waiting' || !invoiceId) return;
    const interval = setInterval(async () => {
      const res = await fetch(`/api/pos/btcpay?invoiceId=${invoiceId}`);
      const data = await res.json();
      if (data.status === 'Settled' || data.status === 'Processing') {
        clearInterval(interval);
        setState('settled');
        await onComplete(invoiceId);
      } else if (data.status === 'Expired' || data.status === 'Invalid') {
        clearInterval(interval);
        setState('expired');
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [state, invoiceId, onComplete]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Bitcoin Payment</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-center">
          <p className="text-3xl font-bold text-gray-900">{formatCents(total)}</p>

          {state === 'idle' && (
            <>
              <Bitcoin className="w-12 h-12 text-orange-400 mx-auto" />
              <p className="text-sm text-gray-500">
                Creates a BTCPay invoice. Open the checkout page and show the customer the QR code.
              </p>
              <button
                onClick={createInvoice}
                className="w-full py-3 rounded-xl bg-orange-500 text-white font-medium text-sm hover:bg-orange-600 transition-colors"
              >
                Create Invoice
              </button>
            </>
          )}

          {state === 'loading' && (
            <>
              <Loader className="w-10 h-10 text-orange-400 mx-auto animate-spin" />
              <p className="text-sm text-gray-500">Creating invoice…</p>
            </>
          )}

          {state === 'waiting' && (
            <>
              <a
                href={checkoutLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-orange-500 text-white font-medium text-sm hover:bg-orange-600 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Open Checkout / QR Code
              </a>
              <p className="text-xs text-gray-400 flex items-center justify-center gap-1.5">
                <Loader className="w-3 h-3 animate-spin" />
                Waiting for payment confirmation…
              </p>
              <p className="text-xs text-gray-400">Invoice expires in 15 minutes</p>
            </>
          )}

          {state === 'settled' && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-sm font-medium text-green-700">Payment confirmed!</p>
            </>
          )}

          {state === 'expired' && (
            <>
              <p className="text-sm text-red-600">Invoice expired or invalid.</p>
              <button
                onClick={() => setState('idle')}
                className="w-full py-3 rounded-xl bg-gray-900 text-white font-medium text-sm hover:bg-gray-700 transition-colors"
              >
                Try Again
              </button>
            </>
          )}

          {state === 'error' && (
            <>
              <p className="text-sm text-red-600">{errorMsg}</p>
              <button
                onClick={() => setState('idle')}
                className="w-full py-3 rounded-xl bg-gray-900 text-white font-medium text-sm hover:bg-gray-700 transition-colors"
              >
                Try Again
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
