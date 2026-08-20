import type { ProductOption } from '#shared/types/catalog'

// Originally generated from the static design's PDP_DESC / PDP_OPTS / PDP_PACK /
// PDP_SIZE blobs (the design file is deleted; this is now the canonical copy —
// edit it directly).

/** A selectable variant and its price multiplier relative to the listed price. */

/** Per-category marketing copy shown under the product title. */
export const PDP_DESCRIPTIONS: Record<string, string> = {
  Beef: 'Balanced beef ration milled for Northern Ontario herds — steady energy and protein for growing and finishing cattle. Available bagged or bulk, with Friday delivery on the Thornloe and Matheson run.',
  Dairy:
    'Lactation-focused ration built around locally grown forage. Consistent butterfat support and palatability through the cold months, bagged or delivered bulk to your bin.',
  Swine:
    'Pig ration formulated for even growth from nursery to finish. Bagged for small barns, bulk-priced per tonne for larger operations.',
  Horses:
    'Clean, low-dust horse feed with steady energy for pasture and working horses. Popular with local boarding and trail barns.',
  Sheep:
    'Ewe and lamb ration with copper levels kept safe for sheep. Bagged for flock feeding, bulk for larger operations.',
  Goats:
    'Goat ration for milking does and growing kids — high fibre, good mineral balance, easy on rumen health.',
  Poultry:
    'Poultry ration for layers and meat birds, milled fresh in small runs. Pairs with our spring chick orders.',
  'Poultry Supplies':
    'Everyday poultry hardware built for barn use — durable poly and steel that stands up to daily washing and northern winters.',
  'Barn Supplies':
    'Barn hardware and fittings we stock year-round because they break at the worst possible time. Farm-grade, not hardware-store grade.',
  'Horse Supplies':
    'Tack and grooming gear picked for daily use in real barns — simple, repairable, and priced fairly.',
  'Vet Supplies':
    'Livestock health supplies from Kane Veterinary — the treatments and instruments you want on hand before you need them.',
  'Feeders & Troughs':
    'Feeders and troughs sized for beef, dairy and small ruminants. Poly for easy handling, steel where it takes a beating.',
  'Bale Wrap':
    'High-cling bale wrap that holds a tight seal through freeze and thaw. Stocked in full pallets during haying season.',
  'Baler Twine':
    'Baler twine with consistent knot strength — poly for square bales, sisal where you need it to break down.',
  'Heated Waterbowls':
    'Heated waterbowls and heat tape rated for Northern Ontario winters. We can order in the size and voltage your barn needs.',
  'Chick Orders':
    'Seasonal chick orders through Frey’s Hatchery and Feathered Acres. Reserve early — spring batches fill fast and arrive day-old.',
  Seed: 'Forage, pasture and cover crop seed from Semican and OSC, blended for the clay loam and short season up here.',
  'Fencing & Gates':
    'Fencing that survives frost heave and livestock pressure — posts, high-tensile wire, gates and Gallagher energizers.',
  'New Equipment':
    'New implements and compact tractors, spec’d for small and mid-size farms. Delivery, setup and service handled out of our own shop.',
  'Used Equipment':
    'Shop-inspected used equipment, serviced before it leaves the yard. Hours and condition listed honestly.',
}

export const DEFAULT_DESCRIPTION =
  'Farm-grade supply stocked in Thornloe. Ask us about sizes, bulk pricing and Friday delivery.'

/** Option sets keyed by the category's facet title. */
export const PDP_OPTION_SETS: Record<string, ProductOption[]> = {
  'Bag size': [
    { label: '20 kg', multiplier: 0.82 },
    { label: '25 kg', multiplier: 1 },
    { label: '40 kg', multiplier: 1.55 },
    { label: 'Bulk, per tonne', multiplier: 18 },
  ],
  Width: [
    { label: '500 mm', multiplier: 0.82 },
    { label: '750 mm', multiplier: 1 },
    { label: '1000 mm', multiplier: 1.32 },
  ],
  Breed: [
    { label: '10 chicks', multiplier: 10 },
    { label: '25 chicks', multiplier: 24 },
    { label: '50 chicks', multiplier: 46 },
  ],
  'Equipment type': [
    { label: 'Standard', multiplier: 1 },
    { label: 'With loader', multiplier: 1.22 },
    { label: 'Cab package', multiplier: 1.38 },
  ],
}

/** Fallback sets: packs for loose items, sizes for everything else. */
export const PDP_PACK_OPTIONS: ProductOption[] = [
  { label: 'Single', multiplier: 1 },
  { label: 'Pack of 4', multiplier: 3.7 },
  { label: 'Case of 12', multiplier: 10.4 },
]
export const PDP_SIZE_OPTIONS: ProductOption[] = [
  { label: 'Small', multiplier: 0.85 },
  { label: 'Medium', multiplier: 1 },
  { label: 'Large', multiplier: 1.25 },
]

/** Bulk products swap the facet axis for a format choice (design: productOptions). */
export const PDP_BULK_OPTIONS: ProductOption[] = [
  { label: 'Bulk, per tonne', multiplier: 1 },
  { label: 'Tote, 1000 kg', multiplier: 0.92 },
]

export type { ProductOption }
