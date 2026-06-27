import { readOrders } from '@/lib/posOrders';
import { Banknote, CreditCard, Bitcoin } from 'lucide-react';
import TransactionActions from '@/components/admin/TransactionActions';

export const dynamic = 'force-dynamic';

function formatCents(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

const METHOD_ICON = {
  cash: Banknote,
  'square-terminal': CreditCard,
  btcpay: Bitcoin,
};

const METHOD_LABEL: Record<string, string> = {
  cash: 'Cash',
  'square-terminal': 'Card',
  btcpay: 'Bitcoin',
};

const METHOD_STYLE: Record<string, string> = {
  cash: 'bg-green-50 text-green-700 border-green-200',
  'square-terminal': 'bg-blue-50 text-blue-700 border-blue-200',
  btcpay: 'bg-orange-50 text-orange-700 border-orange-200',
};

export default function TransactionsPage() {
  const orders = readOrders();
  const netRevenue = orders.filter((o) => !o.refunded).reduce((sum, o) => sum + o.total, 0);
  const refundedCount = orders.filter((o) => o.refunded).length;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">POS Transactions</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {orders.length} sale{orders.length !== 1 ? 's' : ''}
            {refundedCount > 0 && `, ${refundedCount} refunded`}
            {' — '}
            <span className="font-medium text-gray-700">{formatCents(netRevenue)} net</span>
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {orders.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <p className="text-sm">No transactions yet.</p>
            <p className="text-xs mt-1">Completed POS sales will appear here.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-5 py-3.5 font-medium text-gray-500">Date</th>
                <th className="text-left px-5 py-3.5 font-medium text-gray-500">Items</th>
                <th className="text-left px-5 py-3.5 font-medium text-gray-500">Method</th>
                <th className="text-right px-5 py-3.5 font-medium text-gray-500">Total</th>
                <th className="text-right px-5 py-3.5 font-medium text-gray-500">Change</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => {
                const Icon = METHOD_ICON[order.paymentMethod] ?? Banknote;
                return (
                  <tr
                    key={order.id}
                    className={`hover:bg-gray-50 transition-colors ${order.refunded ? 'opacity-60' : ''}`}
                  >
                    <td className="px-5 py-4 whitespace-nowrap text-xs">
                      <p className="text-gray-500">{formatDate(order.createdAt)}</p>
                      {order.refunded && (
                        <span className="inline-block mt-1 rounded-full bg-red-50 border border-red-200 px-2 py-0.5 text-xs font-medium text-red-600">
                          Refunded
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 max-w-xs">
                      <ul className="space-y-0.5">
                        {order.items.map((item, idx) => (
                          <li key={idx} className="text-gray-700">
                            <span className="font-medium">{item.quantity}×</span>{' '}
                            {item.productName}
                            {item.variantLabel && (
                              <span className="text-gray-400 text-xs ml-1">({item.variantLabel.trim()})</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${METHOD_STYLE[order.paymentMethod] ?? ''}`}
                      >
                        <Icon className="w-3 h-3" />
                        {METHOD_LABEL[order.paymentMethod] ?? order.paymentMethod}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right font-semibold text-gray-900 tabular-nums">
                      {formatCents(order.total)}
                    </td>
                    <td className="px-5 py-4 text-right text-gray-500 tabular-nums text-xs">
                      {order.paymentMethod === 'cash' && order.changeDue != null
                        ? formatCents(order.changeDue)
                        : '—'}
                    </td>
                    <td className="px-5 py-4">
                      <TransactionActions
                        orderId={order.id}
                        paymentMethod={order.paymentMethod}
                        alreadyRefunded={order.refunded ?? false}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
