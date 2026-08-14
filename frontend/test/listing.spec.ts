import { describe, expect, it } from 'vitest'
import { listProducts, toApiProduct } from '../server/utils/mock-catalogue'
import { allProducts, categoryProducts } from '~/shared/utils/catalogue'

// GET /products is the endpoint the whole catalogue leans on — shop listing, the
// home carousels, related products. These pin its filtering, sorting, pagination
// and facet rules so a change to any of them has to be deliberate.

describe('listProducts', () => {
  it('defaults to the whole catalogue, 12 per page', () => {
    const result = listProducts({})

    expect(result.total).toBe(allProducts().length)
    expect(result.items).toHaveLength(12)
    expect(result.page).toBe(1)
    expect(result.limit).toBe(12)
  })

  it('narrows to a section, then to a leaf category', () => {
    const section = listProducts({ category: 'Feed' })
    const leaf = listProducts({ category: 'Feed', sub: 'Poultry' })

    expect(section.total).toBe(categoryProducts('Feed').length)
    expect(leaf.total).toBe(categoryProducts('Poultry').length)
    // A leaf is a subset of its section.
    expect(leaf.total).toBeLessThan(section.total)
    expect(leaf.items.every((item) => item.category === 'Poultry')).toBe(true)
  })

  it('combines brand, facet and stock filters', () => {
    const pool = listProducts({ category: 'Feed', limit: 200 })
    const brand = pool.items[0]!.brand
    const byBrand = listProducts({ category: 'Feed', brand: [brand], limit: 200 })

    expect(byBrand.items.every((item) => item.brand === brand)).toBe(true)
    expect(byBrand.total).toBeLessThanOrEqual(pool.total)

    const inStock = listProducts({ category: 'Feed', stock: ['in-stock'], limit: 200 })

    expect(inStock.items.every((item) => item.stock === 'in-stock')).toBe(true)
    expect(inStock.items.every((item) => item.qty > 0)).toBe(true)
  })

  it('filters by badge — this is what the home page rows are', () => {
    const featured = listProducts({ badge: 'new', limit: 200 })
    const deals = listProducts({ badge: 'sale', limit: 200 })

    expect(featured.total).toBeGreaterThan(0)
    expect(deals.total).toBeGreaterThan(0)
    expect(featured.items.every((item) => item.badge?.kind === 'new')).toBe(true)
    expect(deals.items.every((item) => item.badge?.kind === 'sale')).toBe(true)
    // The two rows never show the same product.
    const ids = new Set(featured.items.map((item) => item.id))
    expect(deals.items.some((item) => ids.has(item.id))).toBe(false)
  })

  it('sorts by price and by name', () => {
    const asc = listProducts({ category: 'Feed', sort: 'price-asc', limit: 200 }).items
    const desc = listProducts({ category: 'Feed', sort: 'price-desc', limit: 200 }).items
    const byName = listProducts({ category: 'Feed', sort: 'name', limit: 200 }).items

    expect(asc.map((i) => i.price)).toEqual([...asc.map((i) => i.price)].sort((a, b) => a - b))
    expect(desc.map((i) => i.price)).toEqual([...desc.map((i) => i.price)].sort((a, b) => b - a))
    expect(byName.map((i) => i.name)).toEqual([...byName.map((i) => i.name)].sort())
  })

  it('leaves the order alone when no sort is asked for (featured)', () => {
    const natural = listProducts({ category: 'Feed', limit: 200 }).items.map((i) => i.id)

    expect(natural).toEqual(categoryProducts('Feed').map((p) => p.id))
  })

  it('paginates without gaps or repeats', () => {
    const all = listProducts({ category: 'Feed', limit: 200 }).items.map((i) => i.id)
    const first = listProducts({ category: 'Feed', page: 1, limit: 5 })
    const second = listProducts({ category: 'Feed', page: 2, limit: 5 })

    expect(first.items.map((i) => i.id)).toEqual(all.slice(0, 5))
    expect(second.items.map((i) => i.id)).toEqual(all.slice(5, 10))
    expect(first.total).toBe(all.length)
  })

  it('clamps nonsense paging instead of returning garbage', () => {
    expect(listProducts({ page: 0 }).page).toBe(1)
    expect(listProducts({ page: -3 }).page).toBe(1)
    expect(listProducts({ limit: 0 }).limit).toBe(1)
    // Past the end is empty, not an error.
    expect(listProducts({ category: 'Feed', page: 999 }).items).toEqual([])
  })

  it('describes the whole category in its facets, not the filtered slice', () => {
    const pool = listProducts({ category: 'Feed', limit: 200 })
    const brand = pool.facets.brands[0]!
    const filtered = listProducts({ category: 'Feed', brand: [brand], limit: 200 })

    // Ticking one brand must not remove the others from the sidebar.
    expect(filtered.facets.brands).toEqual(pool.facets.brands)
    expect(filtered.facets.facetValues).toEqual(pool.facets.facetValues)
    expect(pool.facets.brands.length).toBeGreaterThan(1)
  })
})

describe('toApiProduct', () => {
  it('carries stock state and quantity in agreement', () => {
    for (const product of allProducts()) {
      const api = toApiProduct(product)

      expect(api.stock === 'out-of-stock' ? api.qty === 0 : api.qty > 0).toBe(true)
      expect(api.badge?.kind === 'out' ? api.stock === 'out-of-stock' : true).toBe(true)
    }
  })
})
