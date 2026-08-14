import { CATEGORY_DATA, CATEGORY_GROUPS, type CatalogueItem } from '~/shared/constants/catalogue'
import {
  PDP_BULK_OPTIONS,
  PDP_OPTION_SETS,
  PDP_PACK_OPTIONS,
  PDP_SIZE_OPTIONS,
  type ProductOption,
} from '~/shared/constants/product-detail'

// Flat product view of the catalogue, plus the design's derived attributes.
// Badges and stock counts are deterministic functions of the product id in the
// static design (there is no inventory feed yet) — ported verbatim so the same
// items keep showing up as New / Sale / Out of stock.

export interface Product extends CatalogueItem {
  /** e.g. "Beef-0" — matches the design's id scheme. */
  id: string
  /** Leaf category the product belongs to. */
  category: string
}

export type BadgeKind = 'out' | 'sale' | 'new'

export interface ProductBadge {
  label: string
  kind: BadgeKind
}

const toProduct = (category: string, item: CatalogueItem, index: number): Product => ({
  ...item,
  id: `${category.replace(/[^a-z0-9]/gi, '')}-${index}`,
  category,
})

/** Every product in the catalogue. */
export const allProducts = (): Product[] =>
  Object.entries(CATEGORY_DATA).flatMap(([category, data]) =>
    data.items.map((item, i) => toProduct(category, item, i)),
  )

/** Products of a top-level section ("Feed") or a single leaf category ("Beef"). */
export const categoryProducts = (category: string): Product[] => {
  const leaves = CATEGORY_GROUPS[category] ?? [category]

  return leaves.flatMap((leaf) => {
    const data = CATEGORY_DATA[leaf]

    if (!data) {
      return []
    }

    return data.items.map((item, i) => toProduct(leaf, item, i))
  })
}

export const categoryFacetTitle = (category: string): string => {
  const data = CATEGORY_DATA[category]

  if (data) {
    return data.facetTitle
  }

  if (category === 'Feed') {
    return 'Bag size'
  }

  return 'Type'
}

// Stable string hash (design: pdpHash) — the seed for badges and stock counts.
const hash = (value: string): number => {
  let h = 0

  for (let i = 0; i < value.length; i++) {
    h = (h * 31 + value.charCodeAt(i)) % 100000
  }

  return h
}

export const productBadge = (product: Product): ProductBadge | null => {
  const h = hash(product.id + product.name)

  if (h % 17 === 0) {
    return { label: 'Out of stock', kind: 'out' }
  }

  if (h % 6 === 0) {
    return { label: 'Sale', kind: 'sale' }
  }

  if (h % 7 === 0) {
    return { label: 'New', kind: 'new' }
  }

  return null
}

export const productStockState = (product: Product) =>
  productBadge(product)?.kind === 'out' ? 'out-of-stock' : 'in-stock'

/** Units on hand: 0 when the product carries the out-of-stock badge, else 3–48. */
export const productQty = (product: Product): number => {
  if (productBadge(product)?.kind === 'out') {
    return 0
  }

  return (hash(`${product.name}|${product.id}`) % 46) + 3
}

/**
 * Free-text match across name, brand and category — the design's searchMatches().
 * An empty term matches nothing (the search page shows a prompt instead).
 */
export const searchProducts = (term: string): Product[] => {
  const q = term.trim().toLowerCase()

  if (!q) {
    return []
  }

  return allProducts().filter((p) => `${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(q))
}

/** One product by id, or null when the id doesn't exist. */
export const findProduct = (id: string): Product | null =>
  allProducts().find((p) => p.id === id) ?? null

/** The top-level section a leaf category belongs to ("Beef" → "Feed"). */
export const parentSection = (category: string): string =>
  Object.keys(CATEGORY_GROUPS).find((section) => CATEGORY_GROUPS[section]?.includes(category)) ??
  'Shop'

/**
 * Variant picker for a product (design: productOptions). Loose items get pack
 * sizes, bulk lines get a format choice, and everything else gets its category's
 * facet set — with the product's own facet spliced in at multiplier 1 when the
 * set doesn't already list it, so the shown price always matches the listing.
 */
export const productOptions = (product: Product): { title: string; options: ProductOption[] } => {
  if (product.facet === 'Item') {
    return { title: 'Pack size', options: PDP_PACK_OPTIONS }
  }

  if (product.facet === 'Bulk') {
    return { title: 'Format', options: PDP_BULK_OPTIONS }
  }

  const title = categoryFacetTitle(product.category)
  const set = PDP_OPTION_SETS[title]

  if (!set) {
    return { title: 'Size', options: PDP_SIZE_OPTIONS }
  }

  if (set.some((option) => option.label === product.facet)) {
    return { title, options: set }
  }

  return {
    title,
    options: [
      { label: product.facet, multiplier: 1 },
      ...set.filter((option) => option.multiplier !== 1),
    ],
  }
}

/** Up to four photos: the product's own, then its siblings' (design: productGallery). */
export const productGallery = (product: Product): string[] => {
  const images = [product.image]

  for (const item of CATEGORY_DATA[product.category]?.items ?? []) {
    if (images.length < 4 && !images.includes(item.image)) {
      images.push(item.image)
    }
  }

  return images
}

/** Four suggestions: same leaf category first, then the rest of the section. */
export const relatedProducts = (product: Product): Product[] => {
  const pool = categoryProducts(parentSection(product.category)).filter((p) => p.id !== product.id)

  return [
    ...pool.filter((p) => p.category === product.category),
    ...pool.filter((p) => p.category !== product.category),
  ].slice(0, 4)
}

/** Design's shopPrice(): "$1,234.50". */
export const formatPrice = (value: number): string =>
  `$${value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`

/** Sale lines show a 22%-higher "was" price (design: renderDeals). */
export const SALE_MARKUP = 1.22
