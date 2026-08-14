import { describe, expect, it } from 'vitest'
import { CATEGORY_DATA, CATEGORY_GROUPS } from '~/shared/constants/catalogue'
import {
  allProducts,
  categoryFacetTitle,
  categoryProducts,
  formatPrice,
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
    for (const product of allProducts()) {
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
