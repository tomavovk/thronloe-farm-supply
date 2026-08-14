import { SITE, STORE_HOURS } from '~/shared/constants/site'

// Pure schema.org (JSON-LD) builders — no Vue, so they unit-test directly; the
// reactive injection lives in useJsonld(). Same split as the ncs project.

/** A site-relative path → absolute URL. Absolute inputs pass through. */
export const toAbsoluteUrl = (path: string): string =>
  /^https?:\/\//.test(path) ? path : `${SITE.url}${path.startsWith('/') ? path : `/${path}`}`

/** A year out, YYYY-MM-DD — schema.org `priceValidUntil` wants a future date. */
const oneYearOut = (now: Date): string => {
  const d = new Date(now)
  d.setFullYear(d.getFullYear() + 1)

  return d.toISOString().slice(0, 10)
}

const DAY_NAMES = {
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday',
  Sat: 'Saturday',
  Sun: 'Sunday',
} as const

const DAY_ORDER = Object.keys(DAY_NAMES) as (keyof typeof DAY_NAMES)[]

/** "Mon–Fri" / "Sat" → schema.org day names. Ranges use the design's en dash. */
const parseDays = (days: string): string[] => {
  const [from, to] = days.split(/[–-]/).map((d) => d.trim() as keyof typeof DAY_NAMES)

  if (!from || !DAY_NAMES[from]) {
    return []
  }

  if (!to || !DAY_NAMES[to]) {
    return [DAY_NAMES[from]]
  }

  return DAY_ORDER.slice(DAY_ORDER.indexOf(from), DAY_ORDER.indexOf(to) + 1).map(
    (d) => DAY_NAMES[d],
  )
}

/** "8:00am" / "5:30pm" / "NOON" → "08:00" / "17:30" / "12:00". */
const parseTime = (time: string): string | null => {
  const value = time.trim().toLowerCase()

  if (value === 'noon') {
    return '12:00'
  }

  const match = value.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/)

  if (!match) {
    return null
  }

  const [, rawHour, rawMinute, meridiem] = match
  let hour = Number(rawHour) % 12

  if (meridiem === 'pm') {
    hour += 12
  }

  return `${String(hour).padStart(2, '0')}:${rawMinute ?? '00'}`
}

/** "Mar. 1 – Nov. 1" → the 1-based month the season starts in. */
const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

const parseSeasonBounds = (season: string): [number, number] | null => {
  const found = season.toLowerCase().match(/[a-z]{3}/g)
  const [first, second] = found ?? []

  if (!first || !second) {
    return null
  }

  const from = MONTHS.indexOf(first) + 1
  const to = MONTHS.indexOf(second) + 1

  return from > 0 && to > 0 ? [from, to] : null
}

/**
 * The store keeps two sets of hours (summer / winter) that wrap around the new
 * year, so emit the one covering `now` rather than both — two overlapping
 * specifications with no year on them would be ambiguous to a crawler.
 */
export const currentStoreHours = (now: Date) => {
  const month = now.getMonth() + 1

  return (
    STORE_HOURS.find((set) => {
      const bounds = parseSeasonBounds(set.season)

      if (!bounds) {
        return false
      }

      const [from, to] = bounds

      // A season that wraps the year (Nov → Mar) covers months outside [from, to].
      return from <= to ? month >= from && month < to : month >= from || month < to
    }) ?? STORE_HOURS[0]
  )
}

export const openingHoursSpecification = (now: Date) =>
  currentStoreHours(now)
    .rows.map((row) => {
      const [opens, closes] = row.time.split(/[–-]/).map((part) => parseTime(part))
      const dayOfWeek = parseDays(row.days)

      if (!opens || !closes || !dayOfWeek.length) {
        return null
      }

      return { '@type': 'OpeningHoursSpecification' as const, dayOfWeek, opens, closes }
    })
    .filter((spec): spec is NonNullable<typeof spec> => spec !== null)

/** The company itself — emitted once, site-wide (see app.vue). */
export const organizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE.url}/#organization`,
  name: SITE.name,
  legalName: SITE.legalName,
  url: SITE.url,
  logo: toAbsoluteUrl(SITE.logo),
  image: toAbsoluteUrl(SITE.ogImage),
  telephone: SITE.phoneHref.replace('tel:', ''),
  email: SITE.email,
  slogan: SITE.tagline,
})

/** The site itself + a SearchAction (Google sitelinks search box). Home only. */
export const websiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE.url}/#website`,
  url: SITE.url,
  name: SITE.name,
  publisher: { '@id': `${SITE.url}/#organization` },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE.url}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
})

/**
 * The storefront — what local / map-pack results read. `HardwareStore` is the
 * closest LocalBusiness subtype Google recognises for a yard selling feed, farm
 * supply, equipment and service; swap it if a better fit appears.
 */
export const localBusinessSchema = (now: Date) => ({
  '@context': 'https://schema.org',
  '@type': 'HardwareStore',
  '@id': `${SITE.url}/#store`,
  name: SITE.name,
  url: SITE.url,
  telephone: SITE.phoneHref.replace('tel:', ''),
  email: SITE.email,
  image: toAbsoluteUrl(SITE.ogImage),
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: SITE.addressLines[0],
    addressLocality: 'Thornloe',
    addressRegion: 'ON',
    postalCode: 'P0J 1S0',
    addressCountry: 'CA',
  },
  areaServed: 'Timiskaming District, Ontario',
  openingHoursSpecification: openingHoursSpecification(now),
  parentOrganization: { '@id': `${SITE.url}/#organization` },
})

/** A visible breadcrumb trail → BreadcrumbList. `items` run root→current. */
export const breadcrumbSchema = (items: { name: string; url: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: toAbsoluteUrl(item.url),
  })),
})

export interface ProductSchemaInput {
  name: string
  description?: string
  sku?: string | null
  /** Path or absolute URL of the product page (canonical). */
  url: string
  /** Paths or absolute URLs; absolutised here. */
  images?: string[]
  price: number
  inStock: boolean
  brandName?: string
}

/**
 * schema.org Product + Offer. The catalogue takes no orders, so availability is
 * the stock flag and there is no checkout URL — the offer points at the product
 * page, which is where the "Contact us" action lives.
 */
export const productSchema = (p: ProductSchemaInput, now: Date) => {
  const url = toAbsoluteUrl(p.url)

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    ...(p.description ? { description: p.description } : {}),
    ...(p.sku ? { sku: p.sku, productID: p.sku } : {}),
    ...(p.images?.length ? { image: p.images.map(toAbsoluteUrl) } : {}),
    brand: { '@type': 'Brand', name: p.brandName || SITE.name },
    url,
    offers: {
      '@type': 'Offer',
      price: p.price,
      priceCurrency: 'CAD',
      availability: `https://schema.org/${p.inStock ? 'InStock' : 'OutOfStock'}`,
      itemCondition: 'https://schema.org/NewCondition',
      priceValidUntil: oneYearOut(now),
      url,
      seller: { '@id': `${SITE.url}/#organization` },
    },
  }
}
