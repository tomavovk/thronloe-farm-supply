import { describe, expect, it } from 'vitest'
import { CATEGORY_DATA, CATEGORY_GROUPS } from '~/shared/constants/catalogue'
import { RENTAL_CATEGORY_NAMES, RENTALS_SECTION } from '~/shared/constants/rentals'
import {
  allProducts,
  categoryFacetTitle,
  categoryProducts,
  formatPrice,
  isRental,
  productBadge,
  productQty,
  productStockState,
} from '~/shared/utils/catalogue'

// The catalogue's badges and stock counts are hash-derived in the static design.
// These tests pin the ported rules so a refactor can't silently reshuffle which
// products show up as Featured (New) or Deals (Sale).

describe('formatPrice', () => {
  it('formats with two decimals and thousand separators', () => {
    expect(formatPrice(24.95)).toBe('$24.95')
    expect(formatPrice(489)).toBe('$489.00')
    expect(formatPrice(12345.6)).toBe('$12,345.60')
  })
})

describe('product listing', () => {
  it('ids are unique and category-scoped', () => {
    const products = allProducts()
    const ids = products.map((p) => p.id)

    expect(products.length).toBe(
      Object.values(CATEGORY_DATA).reduce((n, c) => n + c.items.length, 0),
    )
    expect(new Set(ids).size).toBe(ids.length)
    expect(products[0]?.id).toBe('Beef-0')
  })

  it('a section returns the products of all its leaf categories', () => {
    const feed = categoryProducts('Feed')
    const leaves = CATEGORY_GROUPS.Feed ?? []
    const expected = leaves.reduce((n, leaf) => n + (CATEGORY_DATA[leaf]?.items.length ?? 0), 0)

    expect(feed.length).toBe(expected)
    expect(new Set(feed.map((p) => p.category))).toEqual(new Set(leaves))
  })

  it('a leaf category resolves on its own', () => {
    expect(categoryProducts('Beef').every((p) => p.category === 'Beef')).toBe(true)
    expect(categoryProducts('Nonexistent')).toEqual([])
  })

  it('facet titles fall back the way the design does', () => {
    expect(categoryFacetTitle('Beef')).toBe(CATEGORY_DATA.Beef?.facetTitle)
    expect(categoryFacetTitle('Feed')).toBe('Bag size')
    expect(categoryFacetTitle('Nonexistent')).toBe('Type')
  })
})

describe('badges and stock', () => {
  it('badge kinds follow the design thresholds and are stable', () => {
    const badges = allProducts().map((p) => productBadge(p)?.kind ?? null)
    const kinds = new Set(badges.filter(Boolean))

    expect(kinds).toEqual(new Set(['out', 'sale', 'new']))
    // Both home carousels need stock to render.
    expect(badges.filter((k) => k === 'new').length).toBeGreaterThan(0)
    expect(badges.filter((k) => k === 'sale').length).toBeGreaterThan(0)
  })

  it('out-of-stock products report zero quantity, others 3–48', () => {
    for (const product of allProducts().filter((p) => !isRental(p))) {
      const qty = productQty(product)

      if (productBadge(product)?.kind === 'out') {
        expect(qty).toBe(0)
        expect(productStockState(product)).toBe('out-of-stock')
        continue
      }

      expect(qty).toBeGreaterThanOrEqual(3)
      expect(qty).toBeLessThanOrEqual(48)
      expect(productStockState(product)).toBe('in-stock')
    }
  })
})

// Rentals share the catalogue's plumbing but not its pricing or its stock rules:
// one product per machine, a rate per period, and no Sale/New/Out badges.
describe('rentals', () => {
  const rentals = categoryProducts(RENTALS_SECTION)

  it('cover every rental category and nothing else', () => {
    expect(new Set(rentals.map((p) => p.category))).toEqual(new Set(RENTAL_CATEGORY_NAMES))
    expect(rentals.every(isRental)).toBe(true)
    expect(allProducts().filter(isRental)).toHaveLength(rentals.length)
  })

  it('headline the full-day rate', () => {
    for (const rental of rentals) {
      const fullDay = rental.rates?.find((rate) => rate.period === 'Full day')

      expect(fullDay?.price).toBe(rental.price)
    }
  })

  it('skip the badge and stock machinery', () => {
    for (const rental of rentals) {
      expect(productBadge(rental)).toBeNull()
      expect(productQty(rental)).toBe(1)
      expect(productStockState(rental)).toBe('in-stock')
    }
  })

  it('price tents by the first day plus each day after it', () => {
    const tents = categoryProducts('Event Tents')

    expect(tents.length).toBeGreaterThan(0)

    for (const tent of tents) {
      expect(tent.rates?.map((rate) => rate.period)).toEqual(['Full day', 'Additional day'])
    }
  })
})
