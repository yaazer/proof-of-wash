import { NextRequest, NextResponse } from 'next/server';
import { readProducts, writeProducts } from '@/lib/productsDb';

export const dynamic = 'force-dynamic';

interface Ctx {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const { inStock } = await request.json();
  const products = readProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
  products[idx] = { ...products[idx], inStock: Boolean(inStock) };
  writeProducts(products);
  return NextResponse.json(products[idx]);
}
