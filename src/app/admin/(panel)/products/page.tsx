import Link from 'next/link';
import { readProducts } from '@/lib/productsDb';
import { PlusCircle, Pencil } from 'lucide-react';
import StockToggle from '@/components/admin/StockToggle';
import VariantStockEditor from '@/components/admin/VariantStockEditor';

export const dynamic = 'force-dynamic';

const badgeColors: Record<string, string> = {
  bestseller: 'bg-amber-50 text-amber-700 border-amber-200',
  new: 'bg-blue-50 text-blue-700 border-blue-200',
  limited: 'bg-purple-50 text-purple-700 border-purple-200',
};

export default function AdminProductsPage() {
  const products = readProducts();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-0.5">{products.length} total</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
        >
          <PlusCircle className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-5 py-3.5 font-medium text-gray-500">Product</th>
              <th className="text-left px-5 py-3.5 font-medium text-gray-500">Price</th>
              <th className="text-left px-5 py-3.5 font-medium text-gray-500">Badge</th>
              <th className="text-left px-5 py-3.5 font-medium text-gray-500">Available</th>
              <th className="text-left px-5 py-3.5 font-medium text-gray-500">Units</th>
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4">
                  <p className="font-medium text-gray-900">{p.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">/products/{p.slug}</p>
                </td>
                <td className="px-5 py-4 text-gray-700">{p.priceDisplay}</td>
                <td className="px-5 py-4">
                  {p.badge ? (
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${badgeColors[p.badge] ?? ''}`}>
                      {p.badge}
                    </span>
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </td>
                <td className="px-5 py-4">
                  <StockToggle productId={p.id} inStock={p.inStock} />
                </td>
                <td className="px-5 py-4">
                  <VariantStockEditor product={p} />
                </td>
                <td className="px-5 py-4 text-right">
                  <Link
                    href={`/admin/products/${p.id}/edit`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="py-16 text-center text-gray-400">
            <p className="text-sm">No products yet.</p>
            <Link href="/admin/products/new" className="mt-2 text-sm text-gray-900 underline">
              Add your first product
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
