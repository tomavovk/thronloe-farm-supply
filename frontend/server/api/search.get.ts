import type { SearchResponse } from '#shared/types/catalog'
import { toApiProduct } from '../utils/mock-catalogue'
import { searchProducts } from '~/shared/utils/catalogue'

// GET /api/search?q=&page=&limit= — same item shape as the listing, so the search
// page and the header suggestions can share one card component.
export default defineEventHandler((event): SearchResponse => {
  const query = getQuery(event)
  const term = query.q ? String(query.q) : ''
  const limit = Math.max(1, query.limit ? Number(query.limit) : 16)
  const page = Math.max(1, query.page ? Number(query.page) : 1)

  const matches = searchProducts(term)
  const start = (page - 1) * limit

  return {
    query: term.trim(),
    total: matches.length,
    page,
    limit,
    items: matches.slice(start, start + limit).map(toApiProduct),
  }
})
