import type { ApiProduct, ProductListResponse } from '#shared/types/catalog'
import { CATEGORY_DATA } from '~/shared/constants/catalogue'
import {
  allProducts,
  categoryFacetTitle,
  categoryProducts,
  productBadge,
  productQty,
  productStockState,
  type Product,
} from '~/shared/utils/catalogue'

// The badge and the on-hand quantity are computed here: a real backend reads them
// from inventory, and the client should never re-derive them.
export const toApiProduct = (product: Product): ApiProduct => ({
  id: product.id,
  name: product.name,
  category: product.category,
  brand: product.brand,
  facet: product.facet,
  price: product.price,
  image: product.image,
  qty: productQty(product),
  stock: productStockState(product),
  badge: productBadge(product),
})

export interface ListQuery {
  category?: string
  sub?: string
  brand?: string[]
  stock?: string[]
  facet?: string[]
  /** `new` powers the home page's Featured row, `sale` its Deals row. */
  badge?: string
  sort?: string
  page?: number
  limit?: number
}

/** Read repeatable query params (`brand=a&brand=b` or `brand[]=a`). */
export const readList = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map(String)
  }

  return value === undefined || value === '' ? [] : [String(value)]
}

const SORTS: Record<string, (a: Product, b: Product) => number> = {
  name: (a, b) => a.name.localeCompare(b.name),
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
}

/**
 * Filter + sort + paginate one category, and report the facets available in it, so
 * the shop's sidebar options come from the API rather than the client.
 */
export const listProducts = (query: ListQuery): ProductListResponse => {
  const category = query.sub || query.category
  const pool = category ? categoryProducts(category) : allProducts()

  const brands = query.brand ?? []
  const stock = query.stock ?? []
  const facets = query.facet ?? []

  const filtered = pool.filter(
    (product) =>
      (!brands.length || brands.includes(product.brand)) &&
      (!stock.length || stock.includes(productStockState(product))) &&
      (!facets.length || facets.includes(product.facet)) &&
      (!query.badge || productBadge(product)?.kind === query.badge),
  )

  const sorter = query.sort ? SORTS[query.sort] : undefined
  const sorted = sorter ? [...filtered].sort(sorter) : filtered

  const limit = Math.max(1, query.limit ?? 12)
  const page = Math.max(1, query.page ?? 1)
  const start = (page - 1) * limit

  return {
    total: sorted.length,
    page,
    limit,
    items: sorted.slice(start, start + limit).map(toApiProduct),
    facets: {
      // Options describe the whole category, not the filtered slice — otherwise
      // ticking one brand would hide the others.
      brands: [...new Set(pool.map((product) => product.brand))].sort(),
      facetTitle: categoryFacetTitle(category ?? ''),
      facetValues: [...new Set(pool.map((product) => product.facet))],
    },
  }
}

export const categoryExists = (name: string) => name in CATEGORY_DATA
