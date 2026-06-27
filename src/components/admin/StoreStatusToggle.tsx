'use client';

import { useState, useTransition } from 'react';
import { ShieldOff, ShieldCheck, Loader2 } from 'lucide-react';

interface Props {
  storeSuspended: boolean;
  suspensionMessage: string;
}

export default function StoreStatusToggle({ storeSuspended, suspensionMessage }: Props) {
  const [suspended, setSuspended] = useState(storeSuspended);
  const [message, setMessage] = useState(suspensionMessage);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  async function save(nextSuspended: boolean, nextMessage: string) {
    startTransition(async () => {
      await fetch('/api/admin/store-settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeSuspended: nextSuspended, suspensionMessage: nextMessage }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  }

  function handleToggle() {
    const next = !suspended;
    setSuspended(next);
    save(next, message);
  }

  function handleSaveMessage(e: React.FormEvent) {
    e.preventDefault();
    save(suspended, message);
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-5">
      {/* Status toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {suspended ? (
            <div className="p-2 rounded-lg bg-red-50">
              <ShieldOff className="h-4 w-4 text-red-500" />
            </div>
          ) : (
            <div className="p-2 rounded-lg bg-green-50">
              <ShieldCheck className="h-4 w-4 text-green-600" />
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {suspended ? 'Store Suspended' : 'Store Open'}
            </p>
            <p className="text-xs text-gray-400">
              {suspended
                ? 'Checkout is blocked. Customers see a splash screen.'
                : 'Online orders are active.'}
            </p>
          </div>
        </div>

        <button
          onClick={handleToggle}
          disabled={isPending}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none disabled:opacity-50 ${
            suspended ? 'bg-red-500' : 'bg-green-500'
          }`}
          role="switch"
          aria-checked={suspended}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
              suspended ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Suspension message editor */}
      <form onSubmit={handleSaveMessage} className="space-y-2">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-widest">
          Splash Screen Message
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-400 resize-none"
        />
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">Shown to customers when store is suspended.</p>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            {isPending ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : saved ? (
              'Saved ✓'
            ) : (
              'Save'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
