import type { Product } from '@/types';

export const products: Product[] = [
  {
    id: 'pow-001',
    slug: 'lavender-cedar-concentrate',
    name: 'Lavender & Cedar Concentrate',
    tagline: 'Calm. Clean. Lasting.',
    description:
      'Our signature concentrate blends wildcrafted lavender essential oil with cedarwood extract and plant-derived surfactants. A single 32 oz bottle yields up to 96 loads — powerful cleaning, naturally.',
    ingredients: [
      'Aqua',
      'Decyl glucoside (plant-derived surfactant)',
      'Lavandula angustifolia (lavender) oil',
      'Cedrus atlantica (cedarwood) bark extract',
      'Sodium citrate (natural water softener)',
      'Citric acid',
      'Glycerin (plant-derived)',
    ],
    scent: 'Floral-woody — lavender top notes, warm cedarwood base',
    weight: '32 fl oz (946 ml)',
    price: 2400,
    priceDisplay: '$24.00',
    image: '/images/lavender-cedar.jpg',
    badge: 'bestseller',
    inStock: true,
    variants: [
      { id: 'pow-001-sm', label: '16 fl oz', price: 1400, priceDisplay: '$14.00' },
      { id: 'pow-001-md', label: '32 fl oz', price: 2400, priceDisplay: '$24.00' },
      { id: 'pow-001-lg', label: '64 fl oz (Refill)', price: 4200, priceDisplay: '$42.00' },
    ],
  },
  {
    id: 'pow-002',
    slug: 'unscented-sensitive',
    name: 'Unscented Sensitive Formula',
    tagline: 'Nothing extra. Just clean.',
    description:
      'Formulated for sensitive skin and fragrance-free households. Hypoallergenic, free of dyes and synthetic fragrances, dermatologist-tested. Safe for baby clothes and HE machines.',
    ingredients: [
      'Aqua',
      'Coco-glucoside (coconut-derived surfactant)',
      'Sodium bicarbonate',
      'Sodium citrate',
      'Citric acid',
      'Glycerin',
    ],
    scent: 'Fragrance-free',
    weight: '32 fl oz (946 ml)',
    price: 2200,
    priceDisplay: '$22.00',
    image: '/images/unscented.jpg',
    badge: 'new',
    inStock: true,
    variants: [
      { id: 'pow-002-sm', label: '16 fl oz', price: 1300, priceDisplay: '$13.00' },
      { id: 'pow-002-md', label: '32 fl oz', price: 2200, priceDisplay: '$22.00' },
      { id: 'pow-002-lg', label: '64 fl oz (Refill)', price: 3800, priceDisplay: '$38.00' },
    ],
  },
  {
    id: 'pow-003',
    slug: 'citrus-mint-energize',
    name: 'Citrus Mint Energize',
    tagline: 'Wake up your laundry.',
    description:
      'Cold-pressed sweet orange peel oil and peppermint leaf extract cut through grime and leave fabrics smelling like a fresh morning. Ideal for workout gear and kitchen linens.',
    ingredients: [
      'Aqua',
      'Sodium lauryl sulfoacetate (plant-derived)',
      'Citrus sinensis (sweet orange) peel oil',
      'Mentha piperita (peppermint) leaf extract',
      'Sodium citrate',
      'Citric acid',
      'Glycerin',
      'Tocopherol (vitamin E, natural preservative)',
    ],
    scent: 'Bright citrus, cool mint finish',
    weight: '32 fl oz (946 ml)',
    price: 2600,
    priceDisplay: '$26.00',
    image: '/images/citrus-mint.jpg',
    inStock: true,
    variants: [
      { id: 'pow-003-sm', label: '16 fl oz', price: 1500, priceDisplay: '$15.00' },
      { id: 'pow-003-md', label: '32 fl oz', price: 2600, priceDisplay: '$26.00' },
      { id: 'pow-003-lg', label: '64 fl oz (Refill)', price: 4500, priceDisplay: '$45.00' },
    ],
  },
  {
    id: 'pow-004',
    slug: 'rose-clay-delicate',
    name: 'Rose & Clay Delicate Wash',
    tagline: 'For the things worth keeping.',
    description:
      'A gentle formula for fine fabrics, woolens, and lingerie. Kaolin clay lifts oil and odors while damask rose hydrosol conditions delicate fibers and reduces static.',
    ingredients: [
      'Aqua',
      'Rosa damascena (damask rose) hydrosol',
      'Caprylyl/capryl glucoside (plant-derived)',
      'Kaolin (white clay)',
      'Glycerin',
      'Sodium PCA (natural humectant)',
      'Citric acid',
    ],
    scent: 'Soft rose, earthy clay undertone',
    weight: '16 fl oz (473 ml)',
    price: 1800,
    priceDisplay: '$18.00',
    image: '/images/rose-clay.jpg',
    badge: 'limited',
    inStock: true,
  },
  {
    id: 'pow-005',
    slug: 'starter-bundle',
    name: 'Starter Bundle',
    tagline: 'Try all four. Fall in love with one.',
    description:
      'Four 8 oz travel-size bottles — one of every formula. Perfect for finding your match or gifting someone who deserves clean, natural laundry care.',
    ingredients: [],
    scent: 'Assorted (all four formulas)',
    weight: '4 × 8 fl oz',
    price: 3600,
    priceDisplay: '$36.00',
    image: '/images/starter-bundle.jpg',
    badge: 'bestseller',
    inStock: true,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.badge === 'bestseller' || p.badge === 'new');
}
