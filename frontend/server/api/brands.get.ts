import type { BrandListResponse } from '#shared/types/catalog'
import { BRAND_LOGOS, SERVICE_BRAND_LOGOS, TIRE_BRAND_LOGOS } from '~/shared/constants/brands'

const SCOPES = {
  catalogue: BRAND_LOGOS,
  service: SERVICE_BRAND_LOGOS,
  tires: TIRE_BRAND_LOGOS,
}

// GET /api/brands?scope=catalogue|service|tires — the marquee strips.
export default defineEventHandler((event): BrandListResponse => {
  const scope = String(getQuery(event).scope ?? 'catalogue') as keyof typeof SCOPES
  const logos = SCOPES[scope]

  if (!logos) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: `Unknown brand scope "${scope}"`,
    })
  }

  return { scope, logos }
})
