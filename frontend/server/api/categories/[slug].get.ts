import type { CategorySectionResponse } from '#shared/types/catalog'
import { findCategorySection } from '~/shared/constants/categories'
import { categoryProducts } from '~/shared/utils/catalogue'

// GET /api/categories/{slug} — one section with its leaf categories. The slug is
// the section name as it appears in the tree ("Farm Supply"), URL-encoded.
export default defineEventHandler((event): CategorySectionResponse => {
  const slug = decodeURIComponent(getRouterParam(event, 'slug') ?? '')
  const section = findCategorySection(slug)

  if (!section) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
      message: 'Category not found',
    })
  }

  return {
    name: section.name,
    image: section.image,
    productCount: categoryProducts(section.name).length,
    subs: section.subs.map((sub) => ({
      name: sub.name,
      image: sub.image,
      productCount: categoryProducts(sub.name).length,
    })),
  }
})
