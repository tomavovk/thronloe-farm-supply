import type { StoreHours } from '#shared/types/content'

// Store identity, contact details and opening hours — the design repeats these
// across the announce bar, footer and contact page, so they live in one place.

export const SITE = {
  name: 'Thornloe Farm Supply',
  legalName: 'Thornloe Farm Supply Ltd.',
  tagline: 'Feed · Sales · Service',
  address: '31 Main St, Thornloe, ON P0J 1S0',
  /** The contact card prints the address over three lines. */
  addressLines: ['31 Main St', 'Thornloe, ON P0J 1S0', 'Canada'],
  phone: '(705) 563-2555',
  phoneHref: 'tel:+17055632555',
  email: 'info@thornloefarmsupply.ca',
  facebookUrl: '#',
  logo: '/images/logo-primary.png',
  /**
   * Canonical origin, used to absolutise URLs in JSON-LD. ASSUMPTION: derived from
   * the contact email's domain — change it here if the live site differs.
   */
  url: 'https://thornloefarmsupply.ca',
  /** Share/rich-result image. */
  ogImage: '/images/home-hero-image.jpg',
} as const

/** Direct extensions listed on the contact page. */
export const PHONE_EXTENSIONS = [
  { name: 'Joel', ext: '101' },
  { name: 'Curvin', ext: '102' },
  { name: 'Brock', ext: '103' },
  { name: 'Service desk', ext: '104' },
] as const

/** Tire enquiries go straight to the tire desk (design: the Tires page CTAs). */
export const TIRE_REQUEST_MAILTO = 'mailto:curvin@tfs-inc.ca?subject=Tire%20request'

// Announce-bar delivery schedule (design: header-announce-text-1/-2).
export const DELIVERY_SCHEDULE = [
  { icon: 'calendar-mark', text: 'Thornloe & local · 2nd & 4th Friday' },
  { icon: 'transfer-truck-time', text: 'Matheson · 1st & 3rd Friday' },
] as const

export const STORE_HOURS = [
  {
    title: 'Summer Hours',
    season: 'Mar. 1 – Nov. 1',
    rows: [
      { days: 'Mon–Fri', time: '8:00am – 5:30pm' },
      { days: 'Sat', time: '9:00am – 1:00pm' },
      { days: 'Sun', time: 'Closed' },
    ],
  },
  {
    title: 'Winter Hours',
    season: 'Nov. 1 – Mar. 1',
    rows: [
      { days: 'Mon–Fri', time: '8:00am – 5:00pm' },
      { days: 'Sat', time: '9:00am – NOON' },
      { days: 'Sun', time: 'Closed' },
    ],
  },
] as const satisfies readonly StoreHours[]
