'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, RotateCcw, Loader } from 'lucide-react';

interface Props {
  orderId: string;
  paymentMethod: string;
  alreadyRefunded: boolean;
}

export default function TransactionActions({ orderId, paymentMethod, alreadyRefunded }: Props) {
  const router = useRouter();
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingRefund, setLoadingRefund] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Delete this transaction record? This cannot be undone.')) return;
    setLoadingDelete(true);
    const res = await fetch(`/api/admin/pos/orders/${orderId}`, { method: 'DELETE' });
    setLoadingDelete(false);
    if (!res.ok) {
      const data = await res.json();
      window.alert(`Delete failed: ${data.error}`);
      return;
    }
    router.refresh();
  };

  const handleRefund = async () => {
    const methodLabel =
      paymentMethod === 'cash' ? 'cash (manual return)'
      : paymentMethod === 'square-terminal' ? 'card via Square'
      : 'Bitcoin via BTCPay';

    if (!window.confirm(`Issue a refund via ${methodLabel}?`)) return;
    setLoadingRefund(true);
    const res = await fetch(`/api/admin/pos/orders/${orderId}/refund`, { method: 'POST' });
    setLoadingRefund(false);
    const data = await res.json();

    if (!res.ok) {
      window.alert(`Refund failed: ${data.error}`);
      return;
    }

    if (data.pullPaymentUrl) {
      window.open(data.pullPaymentUrl, '_blank', 'noopener,noreferrer');
      window.alert(`Bitcoin refund created.\n\nShare this link with the customer:\n${data.pullPaymentUrl}`);
    } else {
      window.alert(data.message ?? 'Refund issued.');
    }

    router.refresh();
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <button
        onClick={handleRefund}
        disabled={alreadyRefunded || loadingRefund}
        title={alreadyRefunded ? 'Already refunded' : 'Issue refund'}
        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {loadingRefund ? <Loader className="h-3.5 w-3.5 animate-spin" /> : <RotateCcw className="h-3.5 w-3.5" />}
        Refund
      </button>
      <button
        onClick={handleDelete}
        disabled={loadingDelete}
        title="Delete record"
        className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-40 transition-colors"
      >
        {loadingDelete ? <Loader className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
        Delete
      </button>
    </div>
  );
}
