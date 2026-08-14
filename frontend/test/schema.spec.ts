import { describe, expect, it } from 'vitest'
import {
  breadcrumbSchema,
  currentStoreHours,
  localBusinessSchema,
  openingHoursSpecification,
  organizationSchema,
  productSchema,
  toAbsoluteUrl,
  websiteSchema,
} from '~/shared/utils/schema'
import { SITE } from '~/shared/constants/site'

// The JSON-LD builders are pure, which is the point: the opening-hours parsing and
// the seasonal switch are the parts most likely to break silently, since nothing on
// screen shows them.

// Fixed dates rather than `new Date()` — a seasonal rule tested "today" passes for
// half the year and fails for the other half.
const JULY = new Date('2026-07-15T12:00:00Z')
const JANUARY = new Date('2026-01-15T12:00:00Z')

describe('toAbsoluteUrl', () => {
  it('absolutises paths and leaves absolute URLs alone', () => {
    expect(toAbsoluteUrl('/shop')).toBe(`${SITE.url}/shop`)
    expect(toAbsoluteUrl('shop')).toBe(`${SITE.url}/shop`)
    expect(toAbsoluteUrl('https://cdn.example.com/a.png')).toBe('https://cdn.example.com/a.png')
    expect(toAbsoluteUrl('http://example.com/a.png')).toBe('http://example.com/a.png')
  })
})

describe('seasonal store hours', () => {
  it('picks summer in July and winter in January', () => {
    expect(currentStoreHours(JULY).title).toBe('Summer Hours')
    expect(currentStoreHours(JANUARY).title).toBe('Winter Hours')
  })

  it('treats the season that wraps the year as covering both sides of it', () => {
    // Winter runs Nov 1 → Mar 1.
    expect(currentStoreHours(new Date('2026-11-15T12:00:00Z')).title).toBe('Winter Hours')
    expect(currentStoreHours(new Date('2026-02-15T12:00:00Z')).title).toBe('Winter Hours')
    expect(currentStoreHours(new Date('2026-03-15T12:00:00Z')).title).toBe('Summer Hours')
  })

  it("converts the design's display times to 24h and expands day ranges", () => {
    const spec = openingHoursSpecification(JULY)

    expect(spec).toEqual([
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '17:30',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday'],
        opens: '09:00',
        closes: '13:00',
      },
    ])
  })

  it('reads NOON, and drops Closed days rather than emitting 00:00', () => {
    const spec = openingHoursSpecification(JANUARY)
    const saturday = spec.find((s) => s.dayOfWeek.includes('Saturday'))

    expect(saturday?.closes).toBe('12:00')
    expect(spec.some((s) => s.dayOfWeek.includes('Sunday'))).toBe(false)
  })
})

describe('organization and website nodes', () => {
  it('exposes a stable @id that other nodes reference', () => {
    const org = organizationSchema()
    const site = websiteSchema()
    const store = localBusinessSchema(JULY)

    expect(org['@id']).toBe(`${SITE.url}/#organization`)
    expect(site.publisher['@id']).toBe(org['@id'])
    expect(store.parentOrganization['@id']).toBe(org['@id'])
  })

  it('strips the tel: scheme off the phone number', () => {
    expect(organizationSchema().telephone).toBe('+17055632555')
    expect(organizationSchema().telephone).not.toContain('tel:')
  })

  it('absolutises the logo and share image', () => {
    const org = organizationSchema()

    expect(org.logo.startsWith('https://')).toBe(true)
    expect(org.image.startsWith('https://')).toBe(true)
  })

  it('offers a search action pointing at the real search route', () => {
    expect(websiteSchema().potentialAction.target.urlTemplate).toBe(
      `${SITE.url}/search?q={search_term_string}`,
    )
  })

  it('carries the postal address as separate fields', () => {
    expect(localBusinessSchema(JULY).address).toMatchObject({
      '@type': 'PostalAddress',
      addressLocality: 'Thornloe',
      addressRegion: 'ON',
      addressCountry: 'CA',
    })
  })
})

describe('breadcrumbSchema', () => {
  it('numbers positions from 1 and absolutises each item', () => {
    const crumbs = breadcrumbSchema([
      { name: 'Shop', url: '/shop' },
      { name: 'Feed', url: '/shop?category=Feed' },
    ])

    expect(crumbs.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Shop', item: `${SITE.url}/shop` },
      { '@type': 'ListItem', position: 2, name: 'Feed', item: `${SITE.url}/shop?category=Feed` },
    ])
  })
})

describe('productSchema', () => {
  const input = {
    name: 'Beef Grower Pellet 25 kg',
    description: 'A pellet.',
    sku: 'Beef-0',
    url: '/product/Beef-0',
    images: ['/images/feed-bag.png'],
    price: 24.95,
    inStock: true,
    brandName: 'Shur-Gain',
  }

  it('emits an Offer in CAD with a future priceValidUntil', () => {
    const schema = productSchema(input, JULY)

    expect(schema.offers).toMatchObject({
      '@type': 'Offer',
      price: 24.95,
      priceCurrency: 'CAD',
      availability: 'https://schema.org/InStock',
    })
    expect(schema.offers.priceValidUntil).toBe('2027-07-15')
    expect(new Date(schema.offers.priceValidUntil) > JULY).toBe(true)
  })

  it('reports out-of-stock availability', () => {
    expect(productSchema({ ...input, inStock: false }, JULY).offers.availability).toBe(
      'https://schema.org/OutOfStock',
    )
  })

  it('uses the product URL for both the product and its offer', () => {
    const schema = productSchema(input, JULY)

    expect(schema.url).toBe(`${SITE.url}/product/Beef-0`)
    expect(schema.offers.url).toBe(schema.url)
  })

  it('falls back to the store as the brand, and omits absent optional fields', () => {
    const bare = productSchema({ name: 'Thing', url: '/product/x', price: 1, inStock: true }, JULY)

    expect(bare.brand.name).toBe(SITE.name)
    expect(bare).not.toHaveProperty('description')
    expect(bare).not.toHaveProperty('sku')
    expect(bare).not.toHaveProperty('image')
  })

  it('serialises without a raw `<` so it cannot break out of the script tag', () => {
    const risky = productSchema(
      { ...input, description: 'Ends with </script><script>alert(1)</script>' },
      JULY,
    )
    const serialised = JSON.stringify(risky).replace(/</g, '\\u003c')

    expect(serialised).not.toContain('</script')
    expect(serialised).toContain('\\u003c/script')
  })
})
