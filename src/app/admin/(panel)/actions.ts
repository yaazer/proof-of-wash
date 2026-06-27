'use server';

import { revalidatePath } from 'next/cache';
import { readProducts, writeProducts } from '@/lib/productsDb';
import type { Product } from '@/types';

type Result = { ok: true } | { ok: false; error: string };

export async function updateProduct(id: string, data: Product): Promise<Result> {
  const products = readProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return { ok: false, error: 'Product not found.' };

  if (products.some((p, i) => p.slug === data.slug && i !== idx)) {
    return { ok: false, error: 'Slug is already used by another product.' };
  }

  products[idx] = { ...data, id };
  writeProducts(products);
  revalidatePath('/admin/products');
  revalidatePath(`/admin/products/${id}/edit`);
  revalidatePath('/products');
  revalidatePath('/');
  return { ok: true };
}

export async function createProduct(data: Product): Promise<Result> {
  const products = readProducts();

  if (products.some((p) => p.id === data.id)) {
    return { ok: false, error: 'Product ID already exists.' };
  }
  if (products.some((p) => p.slug === data.slug)) {
    return { ok: false, error: 'Slug is already in use.' };
  }

  products.push(data);
  writeProducts(products);
  revalidatePath('/admin/products');
  revalidatePath('/products');
  revalidatePath('/');
  return { ok: true };
}

export async function deleteProduct(id: string): Promise<Result> {
  const products = readProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return { ok: false, error: 'Product not found.' };

  products.splice(idx, 1);
  writeProducts(products);
  revalidatePath('/admin/products');
  revalidatePath('/products');
  revalidatePath('/');
  return { ok: true };
}

export async function toggleStock(id: string, inStock: boolean): Promise<Result> {
  const products = readProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return { ok: false, error: 'Product not found.' };

  products[idx] = { ...products[idx], inStock };
  writeProducts(products);
  revalidatePath('/admin/products');
  revalidatePath('/');
  return { ok: true };
}

export async function updateVariantStock(
  productId: string,
  variantId: string | null,
  stock: number | null,
): Promise<Result> {
  const products = readProducts();
  const idx = products.findIndex((p) => p.id === productId);
  if (idx === -1) return { ok: false, error: 'Product not found.' };

  if (variantId) {
    const variants = products[idx].variants;
    if (!variants) return { ok: false, error: 'No variants on this product.' };
    const vIdx = variants.findIndex((v) => v.id === variantId);
    if (vIdx === -1) return { ok: false, error: 'Variant not found.' };
    const updated = [...variants];
    updated[vIdx] = { ...updated[vIdx], stock };
    products[idx] = { ...products[idx], variants: updated };
  } else {
    products[idx] = { ...products[idx], stock };
  }

  writeProducts(products);
  revalidatePath('/admin/products');
  revalidatePath(`/products/${products[idx].slug}`);
  return { ok: true };
}
