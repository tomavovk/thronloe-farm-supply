import type { FaqResponse } from '#shared/types/content'
import { FAQ_SETS } from '~/shared/constants/content'

// GET /api/faq?scope=home|contact
export default defineEventHandler((event): FaqResponse => {
  const scope = String(getQuery(event).scope ?? 'home') as keyof typeof FAQ_SETS
  const items = FAQ_SETS[scope]

  if (!items) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: `Unknown FAQ scope "${scope}"`,
    })
  }

  return { scope, items }
})
