'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { formatCents } from '@/lib/cart';

interface Props {
  total: number;
  onComplete: (data: { tendered: number }) => Promise<void>;
  onClose: () => void;
}

const QUICK_BILLS = [500, 1000, 2000, 5000, 10000];

export default function CashModal({ total, onComplete, onClose }: Props) {
  const [tendered, setTendered] = useState('');
  const [loading, setLoading] = useState(false);

  const tenderedCents = Math.round(parseFloat(tendered || '0') * 100);
  const change = tenderedCents - total;
  const valid = tenderedCents >= total;

  const handleComplete = async () => {
    if (!valid) return;
    setLoading(true);
    await onComplete({ tendered: tenderedCents });
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Cash Payment</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Total due</span>
            <span className="text-2xl font-bold text-gray-900">{formatCents(total)}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {QUICK_BILLS.filter((b) => b >= total)
              .slice(0, 4)
              .map((b) => (
                <button
                  key={b}
                  onClick={() => setTendered((b / 100).toFixed(2))}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  {formatCents(b)}
                </button>
              ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Cash tendered</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
              <input
                type="number"
                min={0}
                step="0.01"
                value={tendered}
                onChange={(e) => setTendered(e.target.value)}
                className="w-full pl-8 pr-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-500"
                placeholder="0.00"
                autoFocus
              />
            </div>
          </div>

          {valid && (
            <div className="flex items-center justify-between rounded-xl bg-green-50 border border-green-100 px-4 py-3">
              <span className="text-sm font-medium text-green-700">Change due</span>
              <span className="text-lg font-bold text-green-800">{formatCents(change)}</span>
            </div>
          )}

          <button
            onClick={handleComplete}
            disabled={!valid || loading}
            className="w-full py-3 rounded-xl bg-gray-900 text-white font-medium text-sm disabled:opacity-40 hover:bg-gray-700 transition-colors"
          >
            {loading ? 'Saving…' : 'Complete Sale'}
          </button>
        </div>
      </div>
    </div>
  );
}
