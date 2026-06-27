'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, CreditCard, Loader } from 'lucide-react';
import { formatCents } from '@/lib/cart';

interface Props {
  total: number;
  onComplete: (checkoutId: string) => Promise<void>;
  onClose: () => void;
}

type State = 'idle' | 'pending' | 'processing' | 'cancelled' | 'error';

export default function TerminalModal({ total, onComplete, onClose }: Props) {
  const [state, setState] = useState<State>('idle');
  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const startCheckout = async () => {
    setState('pending');
    try {
      const res = await fetch('/api/pos/square-terminal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amountCents: total, note: 'Proof of Wash POS' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Terminal request failed');
      setCheckoutId(data.checkoutId);
      setState('processing');
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : 'Failed to connect to terminal');
      setState('error');
    }
  };

  const cancelCheckout = useCallback(async () => {
    if (checkoutId) {
      await fetch(`/api/pos/square-terminal/${checkoutId}`, { method: 'DELETE' });
    }
    onClose();
  }, [checkoutId, onClose]);

  useEffect(() => {
    if (state !== 'processing' || !checkoutId) return;
    const interval = setInterval(async () => {
      const res = await fetch(`/api/pos/square-terminal/${checkoutId}`);
      const data = await res.json();
      if (data.status === 'COMPLETED') {
        clearInterval(interval);
        await onComplete(checkoutId);
      } else if (data.status === 'CANCELLED' || data.status === 'CANCEL_REQUESTED') {
        clearInterval(interval);
        setState('cancelled');
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [state, checkoutId, onComplete]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Card Payment</h2>
          <button onClick={cancelCheckout} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-center">
          <p className="text-3xl font-bold text-gray-900">{formatCents(total)}</p>

          {state === 'idle' && (
            <>
              <CreditCard className="w-12 h-12 text-gray-300 mx-auto" />
              <p className="text-sm text-gray-500">
                Pushes a payment request to your Square Terminal device.
              </p>
              <button
                onClick={startCheckout}
                className="w-full py-3 rounded-xl bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition-colors"
              >
                Send to Terminal
              </button>
            </>
          )}

          {state === 'pending' && (
            <>
              <Loader className="w-10 h-10 text-blue-400 mx-auto animate-spin" />
              <p className="text-sm text-gray-500">Connecting to terminal…</p>
            </>
          )}

          {state === 'processing' && (
            <>
              <Loader className="w-10 h-10 text-blue-400 mx-auto animate-spin" />
              <p className="text-sm font-medium text-gray-700">Waiting for customer to pay…</p>
              <p className="text-xs text-gray-400">Check your Square Terminal</p>
              <button onClick={cancelCheckout} className="text-xs text-red-400 hover:text-red-600">
                Cancel
              </button>
            </>
          )}

          {state === 'cancelled' && (
            <>
              <p className="text-sm text-red-600">Payment was cancelled on the terminal.</p>
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
