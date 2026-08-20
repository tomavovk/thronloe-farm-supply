import type { ProductDetailResponse } from '#shared/types/catalog'
import { toApiProduct } from '../../utils/mock-catalogue'
import { DEFAULT_DESCRIPTION, PDP_DESCRIPTIONS } from '~/shared/constants/product-detail'
import {
  findProduct,
  isRental,
  parentSection,
  productGallery,
  productOptions,
  relatedProducts,
} from '~/shared/utils/catalogue'

// GET /api/products/{id} — everything the product page renders in one response.
export default defineEventHandler((event): ProductDetailResponse => {
  const id = getRouterParam(event, 'id') ?? ''
  const product = findProduct(id)

  if (!product) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found', message: 'Product not found' })
  }

  // Rentals are priced by period, so they get no size/pack picker.
  const variants = isRental(product) ? null : productOptions(product)

  return {
    ...toApiProduct(product),
    section: parentSection(product.category),
    description: PDP_DESCRIPTIONS[product.category] ?? DEFAULT_DESCRIPTION,
    gallery: productGallery(product),
    options: variants && { title: variants.title, values: variants.options },
    related: relatedProducts(product).map(toApiProduct),
  }
})
