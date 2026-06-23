import { NextRequest, NextResponse } from 'next/server';
import { readProducts, writeProducts } from '@/lib/productsDb';
import type { Product } from '@/types';

export const dynamic = 'force-dynamic';

interface Ctx {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const product = readProducts().find((p) => p.id === id);
  if (!product) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(request: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const data = (await request.json()) as Product;
  const products = readProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Not found.' }, { status: 404 });

  if (products.some((p, i) => p.slug === data.slug && i !== idx)) {
    return NextResponse.json({ error: 'Slug is already used by another product.' }, { status: 409 });
  }

  products[idx] = { ...data, id };
  writeProducts(products);
  return NextResponse.json(products[idx]);
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const products = readProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
  products.splice(idx, 1);
  writeProducts(products);
  return NextResponse.json({ ok: true });
}
