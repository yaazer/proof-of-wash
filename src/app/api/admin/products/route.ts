import { NextRequest, NextResponse } from 'next/server';
import { readProducts, writeProducts } from '@/lib/productsDb';
import type { Product } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(readProducts());
}

export async function POST(request: NextRequest) {
  const data = (await request.json()) as Product;
  const products = readProducts();

  if (products.some((p) => p.id === data.id)) {
    return NextResponse.json({ error: 'Product ID already exists.' }, { status: 409 });
  }
  if (products.some((p) => p.slug === data.slug)) {
    return NextResponse.json({ error: 'Slug is already in use.' }, { status: 409 });
  }

  products.push(data);
  writeProducts(products);
  return NextResponse.json(data, { status: 201 });
}
