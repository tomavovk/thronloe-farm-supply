// Brand logos for the shop's marquee strip (design BRAND_LOGOS_DEFAULT).
// `maxHeight` is per-logo in the design — the artwork has wildly different
// aspect ratios, so a single cap would make some unreadable.

export interface BrandLogo {
  name: string
  image: string
  maxHeight: number
}

export const BRAND_LOGOS: BrandLogo[] = [
  { name: 'Semican', image: '/images/brand-semican.webp', maxHeight: 56 },
  { name: 'OSC Seeds', image: '/images/brand-osc.png', maxHeight: 56 },
  { name: 'Gallagher', image: '/images/brand-gallagher.png', maxHeight: 88 },
  { name: 'Marweld', image: '/images/brand-marweld.png', maxHeight: 88 },
  { name: 'Martin’s Feeders & Equipment', image: '/images/brand-martins.png', maxHeight: 88 },
  { name: 'Stockman’s Choice', image: '/images/brand-stockmans-choice.jpg', maxHeight: 108 },
  { name: 'Kane Veterinary Supplies', image: '/images/brand-kane.png', maxHeight: 108 },
  { name: 'Feathered Acres', image: '/images/brand-feathered-acres.png', maxHeight: 88 },
  { name: 'Frey’s Hatchery', image: '/images/brand-freys.png', maxHeight: 88 },
]

/** Equipment suppliers shown on the Service page. */
export const SERVICE_BRAND_LOGOS: BrandLogo[] = [
  { name: 'WIC', image: '/images/service-brand-track.png', maxHeight: 56 },
  { name: 'Teamco', image: '/images/service-brand-track-4.png', maxHeight: 56 },
  { name: 'Teagle', image: '/images/service-brand-track-2.png', maxHeight: 48 },
  { name: 'Rovibec Agrisolutions', image: '/images/service-brand-track-3.png', maxHeight: 72 },
  { name: 'Patz', image: '/images/service-brand-track-5.png', maxHeight: 56 },
]

/** Tire makes carried, shown on the Tires page. */
export const TIRE_BRAND_LOGOS: BrandLogo[] = [
  { name: 'BKT', image: '/images/tires-brand-track-2.png', maxHeight: 56 },
  { name: 'Firestone', image: '/images/tires-brand-track.png', maxHeight: 56 },
  { name: 'Bridgestone', image: '/images/tires-brand-track-4.png', maxHeight: 56 },
  { name: 'General Tire', image: '/images/brand-general-tire.svg', maxHeight: 64 },
  { name: 'Toyo Tires', image: '/images/tires-brand-track-3.png', maxHeight: 72 },
  { name: 'Continental', image: '/images/brand-continental.svg', maxHeight: 56 },
  { name: 'Trelleborg', image: '/images/brand-trelleborg.png', maxHeight: 56 },
]
