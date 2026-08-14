// Wire shapes for the content endpoints (server/api/site, events, faq, pages).
// See shared/types/catalog.ts for why these are declared rather than derived from
// the fixture constants.

export interface StoreHours {
  title: string
  season: string
  rows: readonly { days: string; time: string }[]
}

export interface PhoneExtension {
  name: string
  ext: string
}

export interface DeliveryEntry {
  icon: string
  text: string
}

export interface SiteResponse {
  name: string
  legalName: string
  tagline: string
  address: string
  addressLines: readonly string[]
  extensions: readonly PhoneExtension[]
  phone: string
  phoneHref: string
  email: string
  facebookUrl: string
  logo: string
  delivery: readonly DeliveryEntry[]
  hours: readonly StoreHours[]
}

/** A labelled thumbnail in an info page's grid (services, rentals, tires). */
export interface InfoItem {
  label: string
  image: string
}

export interface InfoPageResponse {
  slug: string
  title: string
  paragraphs: string[]
  items: InfoItem[]
  image: string
  imageAlt: string
  brandScope?: 'service' | 'tires'
}

export interface AboutResponse {
  slug: 'about'
  intro: readonly string[]
  team: readonly { name: string; role: string }[]
  pillars: readonly { chip: string; icon: string; word: string; text: string }[]
}

export interface EventEntry {
  month: string
  day: string
  when: string
  tag: string
  title: string
  text: string
  image: string
  imageAlt: string
  points: string[]
  priceLabel: string
  priceNote: string
  cta: string
  /** The Fur & Feather CTA is the ghost variant in the design. */
  ctaGhost?: boolean
}

export interface EventsResponse {
  items: EventEntry[]
}

export interface FaqItem {
  question: string
  answer: string
}

export interface FaqResponse {
  scope: string
  items: FaqItem[]
}
