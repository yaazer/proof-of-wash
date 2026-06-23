'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle, Trash2 } from 'lucide-react';
import type { Product, ProductVariant } from '@/types';

interface Props {
  product?: Product;
}

interface VariantRow {
  id: string;
  label: string;
  priceDollars: string;
}

function toCents(dollars: string): number {
  return Math.round(parseFloat(dollars || '0') * 100);
}

function toDisplay(dollars: string): string {
  const n = parseFloat(dollars || '0');
  return isNaN(n) ? '$0.00' : `$${n.toFixed(2)}`;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
}

function generateId(): string {
  return `pow-${Date.now()}`;
}

export default function ProductForm({ product }: Props) {
  const router = useRouter();
  const isEdit = !!product;

  const [name, setName] = useState(product?.name ?? '');
  const [slug, setSlug] = useState(product?.slug ?? '');
  const [slugManual, setSlugManual] = useState(isEdit);
  const [tagline, setTagline] = useState(product?.tagline ?? '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [scent, setScent] = useState(product?.scent ?? '');
  const [weight, setWeight] = useState(product?.weight ?? '');
  const [priceDollars, setPriceDollars] = useState(
    product ? (product.price / 100).toFixed(2) : ''
  );
  const [image, setImage] = useState(product?.image ?? '');
  const [badge, setBadge] = useState<'' | 'bestseller' | 'new' | 'limited'>(product?.badge ?? '');
  const [inStock, setInStock] = useState(product?.inStock ?? true);
  const [ingredients, setIngredients] = useState<string[]>(product?.ingredients ?? ['']);
  const [variants, setVariants] = useState<VariantRow[]>(
    product?.variants?.map((v) => ({
      id: v.id,
      label: v.label,
      priceDollars: (v.price / 100).toFixed(2),
    })) ?? []
  );
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Auto-generate slug from name unless manually edited
  useEffect(() => {
    if (!slugManual) setSlug(slugify(name));
  }, [name, slugManual]);

  function handleSlugChange(val: string) {
    setSlugManual(true);
    setSlug(val);
  }

  // Ingredients helpers
  function setIngredient(i: number, val: string) {
    setIngredients((prev) => prev.map((x, idx) => (idx === i ? val : x)));
  }
  function addIngredient() {
    setIngredients((prev) => [...prev, '']);
  }
  function removeIngredient(i: number) {
    setIngredients((prev) => prev.filter((_, idx) => idx !== i));
  }

  // Variants helpers
  function setVariantField(i: number, field: keyof VariantRow, val: string) {
    setVariants((prev) => prev.map((v, idx) => (idx === i ? { ...v, [field]: val } : v)));
  }
  function addVariant() {
    setVariants((prev) => [
      ...prev,
      { id: `${product?.id ?? generateId()}-v${prev.length + 1}`, label: '', priceDollars: '' },
    ]);
  }
  function removeVariant(i: number) {
    setVariants((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);

    const variantObjs: ProductVariant[] = variants
      .filter((v) => v.label.trim())
      .map((v) => ({
        id: v.id,
        label: v.label,
        price: toCents(v.priceDollars),
        priceDisplay: toDisplay(v.priceDollars),
      }));

    const payload: Product = {
      id: product?.id ?? generateId(),
      slug,
      name,
      tagline,
      description,
      scent,
      weight,
      price: toCents(priceDollars),
      priceDisplay: toDisplay(priceDollars),
      image,
      badge: badge || undefined,
      inStock,
      ingredients: ingredients.filter((x) => x.trim()),
      ...(variantObjs.length > 0 ? { variants: variantObjs } : {}),
    };

    try {
      const url = isEdit ? `/api/admin/products/${product.id}` : '/api/admin/products';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const { error: msg } = await res.json();
        setError(msg ?? 'Save failed.');
        return;
      }
      router.push('/admin/products');
      router.refresh();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!product || !confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await fetch(`/api/admin/products/${product.id}`, { method: 'DELETE' });
      router.push('/admin/products');
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  const inputClass =
    'w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5';

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left column */}
        <div className="space-y-5">
          <div>
            <label className={labelClass}>Name *</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              placeholder="Lavender & Cedar Concentrate"
            />
          </div>

          <div>
            <label className={labelClass}>Slug *</label>
            <input
              required
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              className={inputClass}
              placeholder="lavender-cedar-concentrate"
            />
            <p className="mt-1 text-xs text-gray-400">URL: /products/{slug || '…'}</p>
          </div>

          <div>
            <label className={labelClass}>Tagline</label>
            <input
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className={inputClass}
              placeholder="Calm. Clean. Lasting."
            />
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputClass}
              placeholder="Product description…"
            />
          </div>

          <div>
            <label className={labelClass}>Scent Profile</label>
            <input
              value={scent}
              onChange={(e) => setScent(e.target.value)}
              className={inputClass}
              placeholder="Floral-woody — lavender top notes, warm cedarwood base"
            />
          </div>

          <div>
            <label className={labelClass}>Weight / Size</label>
            <input
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className={inputClass}
              placeholder="32 fl oz (946 ml)"
            />
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          <div>
            <label className={labelClass}>Base Price (USD) *</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400">$</span>
              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={priceDollars}
                onChange={(e) => setPriceDollars(e.target.value)}
                className={`${inputClass} pl-7`}
                placeholder="24.00"
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Image Path</label>
            <input
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className={inputClass}
              placeholder="/images/lavender-cedar.jpg"
            />
            <p className="mt-1 text-xs text-gray-400">Place images in /public/images/</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Badge</label>
              <select
                value={badge}
                onChange={(e) => setBadge(e.target.value as typeof badge)}
                className={inputClass}
              >
                <option value="">None</option>
                <option value="bestseller">Bestseller</option>
                <option value="new">New</option>
                <option value="limited">Limited</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className={labelClass}>In Stock</label>
              <label className="flex items-center gap-2.5 cursor-pointer mt-1">
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={(e) => setInStock(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                />
                <span className="text-sm text-gray-700">Available for purchase</span>
              </label>
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <label className={labelClass}>Ingredients</label>
            <div className="space-y-2">
              {ingredients.map((ing, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={ing}
                    onChange={(e) => setIngredient(i, e.target.value)}
                    className={inputClass}
                    placeholder="Aqua"
                  />
                  <button
                    type="button"
                    onClick={() => removeIngredient(i)}
                    className="shrink-0 rounded-lg border border-gray-200 p-2.5 text-gray-400 hover:text-red-500 hover:border-red-300 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addIngredient}
              className="mt-2 flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              <PlusCircle className="h-4 w-4" /> Add ingredient
            </button>
          </div>
        </div>
      </div>

      {/* Variants */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Variants <span className="font-normal text-gray-400">(optional — for size options)</span>
        </h3>
        {variants.length > 0 && (
          <div className="space-y-2 mb-3">
            {variants.map((v, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={v.label}
                  onChange={(e) => setVariantField(i, 'label', e.target.value)}
                  className={`${inputClass} flex-1`}
                  placeholder="16 fl oz"
                />
                <div className="relative flex-1">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={v.priceDollars}
                    onChange={(e) => setVariantField(i, 'priceDollars', e.target.value)}
                    className={`${inputClass} pl-7`}
                    placeholder="14.00"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeVariant(i)}
                  className="shrink-0 rounded-lg border border-gray-200 p-2.5 text-gray-400 hover:text-red-500 hover:border-red-300 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={addVariant}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <PlusCircle className="h-4 w-4" /> Add variant
        </button>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
        {isEdit ? (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            {deleting ? 'Deleting…' : 'Delete product'}
          </button>
        ) : (
          <span />
        )}

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create product'}
          </button>
        </div>
      </div>
    </form>
  );
}
