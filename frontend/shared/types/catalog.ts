// Wire shapes for the catalogue endpoints, in the one place both sides can see:
// `server/api/**` returns these, the pages consume them, so a change to the
// contract breaks at compile time on whichever side is now wrong.
//
// Deliberately declared, not derived from the fixtures in app/shared/constants —
// when a real backend replaces those fixtures the contract should be what stays
// put, with the fixtures checked against it (`satisfies`) rather than defining it.

export type BadgeKind = 'new' | 'sale' | 'out'

export interface ApiBadge {
  label: string
  kind: BadgeKind
}

/** One selectable size/variant on a product page, priced as a multiplier. */
export interface ProductOption {
  label: string
  multiplier: number
}

/**
 * A period from the store's rental price list. Tents are quoted as a first day
 * plus each day after it, so they use 'Full day' and 'Additional day' only.
 */
export type RentalPeriod =
  'Half day' | 'Full day' | 'Weekend' | 'Weekly' | 'Monthly' | 'Additional day'

export interface RentalRate {
  period: RentalPeriod
  price: number
}

export interface ApiProduct {
  id: string
  name: string
  category: string
  brand: string
  facet: string
  price: number
  image: string
  /** Units on hand; 0 when the product carries the out-of-stock badge. */
  qty: number
  /**
   * Rate card for rental machines, empty for everything sold outright. The store's
   * till carries one SKU per period; the site keeps one product per machine and
   * prices it by the row instead.
   */
  rates: RentalRate[]
  stock: 'in-stock' | 'out-of-stock'
  badge: ApiBadge | null
}

export interface ProductFacets {
  brands: string[]
  /** Label of the axis these values sit on ("Bag size", "Type", …). */
  facetTitle: string
  facetValues: string[]
}

export interface ProductListResponse {
  total: number
  page: number
  limit: number
  items: ApiProduct[]
  facets: ProductFacets
}

export interface ProductDetailResponse extends ApiProduct {
  section: string
  description: string
  gallery: string[]
  /** Variant picker — null on rentals, which are priced by period, not by size. */
  options: { title: string; values: ProductOption[] } | null
  related: ApiProduct[]
}

export interface SearchResponse {
  query: string
  total: number
  page: number
  limit: number
  items: ApiProduct[]
}

export interface CategoryCardResponse {
  name: string
  image: string
  productCount: number
}

export interface CategorySectionResponse extends CategoryCardResponse {
  subs: CategoryCardResponse[]
}

export interface BrandLogoResponse {
  name: string
  image: string
  maxHeight: number
}

export interface BrandListResponse {
  scope: string
  logos: BrandLogoResponse[]
}
