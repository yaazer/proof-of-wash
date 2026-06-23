import Link from 'next/link';
import { readProducts } from '@/lib/productsDb';
import { Package, PlusCircle, CheckCircle, AlertCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function AdminDashboard() {
  const products = readProducts();
  const inStock = products.filter((p) => p.inStock).length;
  const outOfStock = products.length - inStock;

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">Dashboard</h1>
      <p className="text-sm text-gray-500 mb-8">Overview of your store.</p>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-gray-100">
              <Package className="h-4 w-4 text-gray-600" />
            </div>
            <p className="text-sm text-gray-500">Total Products</p>
          </div>
          <p className="text-3xl font-semibold text-gray-900">{products.length}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <p className="text-sm text-gray-500">In Stock</p>
          </div>
          <p className="text-3xl font-semibold text-gray-900">{inStock}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-500" />
            </div>
            <p className="text-sm text-gray-500">Out of Stock</p>
          </div>
          <p className="text-3xl font-semibold text-gray-900">{outOfStock}</p>
        </div>
      </div>

      {/* Quick actions */}
      <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-3">Quick Actions</h2>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Package className="h-4 w-4" />
          Manage Products
        </Link>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
        >
          <PlusCircle className="h-4 w-4" />
          Add Product
        </Link>
      </div>
    </div>
  );
}
