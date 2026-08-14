import type { CategorySectionResponse } from '#shared/types/catalog'
import { CATEGORY_SECTIONS } from '~/shared/constants/categories'
import { categoryProducts } from '~/shared/utils/catalogue'

// GET /api/categories — the browsing tree with artwork and product counts.
export default defineEventHandler((): { sections: CategorySectionResponse[] } => ({
  sections: CATEGORY_SECTIONS.map((section) => ({
    name: section.name,
    image: section.image,
    productCount: categoryProducts(section.name).length,
    subs: section.subs.map((sub) => ({
      name: sub.name,
      image: sub.image,
      productCount: categoryProducts(sub.name).length,
    })),
  })),
}))
