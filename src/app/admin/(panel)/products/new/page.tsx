import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ProductForm from '@/components/admin/ProductForm';

export default function NewProductPage() {
  return (
    <div className="p-8 max-w-5xl">
      <Link
        href="/admin/products"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Products
      </Link>
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">New Product</h1>
      <ProductForm />
    </div>
  );
}
