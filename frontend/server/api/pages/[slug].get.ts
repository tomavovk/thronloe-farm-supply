import { ABOUT, INFO_PAGES } from '~/shared/constants/content'

// GET /api/pages/{slug} — copy blocks for the content pages. `about` returns its
// own shape (intro, crew, four trades); rentals/services/tires share the InfoHero
// shape and say which brand strip belongs under them.
export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug') ?? ''

  if (slug === 'about') {
    return { slug, ...ABOUT }
  }

  const page = INFO_PAGES[slug as keyof typeof INFO_PAGES]

  if (!page) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found', message: 'Page not found' })
  }

  return { slug, ...page }
})
