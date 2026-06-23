import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getProductById } from '@/lib/productsDb';
import ProductForm from '@/components/admin/ProductForm';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();

  return (
    <div className="p-8 max-w-5xl">
      <Link
        href="/admin/products"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Products
      </Link>
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">Edit Product</h1>
      <p className="text-sm text-gray-400 mb-8">{product.name}</p>
      <ProductForm product={product} />
    </div>
  );
}
