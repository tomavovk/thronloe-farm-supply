import type { ProductListResponse } from '#shared/types/catalog'
import { listProducts, readList } from '../../utils/mock-catalogue'

// GET /api/products?category=&sub=&brand=&stock=&facet=&sort=&page=&limit=
export default defineEventHandler((event): ProductListResponse => {
  const query = getQuery(event)

  return listProducts({
    category: query.category ? String(query.category) : undefined,
    sub: query.sub ? String(query.sub) : undefined,
    brand: readList(query['brand[]'] ?? query.brand),
    stock: readList(query['stock[]'] ?? query.stock),
    facet: readList(query['facet[]'] ?? query.facet),
    badge: query.badge ? String(query.badge) : undefined,
    sort: query.sort ? String(query.sort) : undefined,
    page: query.page ? Number(query.page) : undefined,
    limit: query.limit ? Number(query.limit) : undefined,
  })
})
