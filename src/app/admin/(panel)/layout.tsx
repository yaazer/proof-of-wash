import type { Metadata } from 'next';
import Link from 'next/link';
import { LayoutDashboard, Package, ExternalLink } from 'lucide-react';
import AdminLogoutButton from '@/components/admin/AdminLogoutButton';

export const metadata: Metadata = { title: 'Admin | Proof of Wash' };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-white border-r border-gray-200 flex flex-col">
        <div className="px-5 py-5 border-b border-gray-200">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Proof of Wash</p>
          <p className="text-sm font-semibold text-gray-900 mt-0.5">Admin</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <Link
            href="/admin"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <LayoutDashboard className="h-4 w-4 shrink-0" />
            Dashboard
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <Package className="h-4 w-4 shrink-0" />
            Products
          </Link>
        </nav>

        <div className="px-3 py-4 border-t border-gray-200 space-y-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <ExternalLink className="h-4 w-4 shrink-0" />
            View Storefront
          </Link>
          <AdminLogoutButton />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
