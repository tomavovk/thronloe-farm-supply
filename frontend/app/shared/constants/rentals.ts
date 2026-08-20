import type { CatalogueItem, Category } from './catalogue'
import type { ShopSort } from './shop'
import { SITE } from './site'

// The rental fleet, typed from the store's printed price list
// (public/images/rental-price-list.jpg, kept as the reference scan). Groups and
// rates follow that sheet; names are spelled out, and the mower the sheet lists
// twice — under Lawn/garden and again under Mowers — is one product here.
//
// ASSUMPTION: the sheet's last three concrete rows (wheelbarrow, rebar
// bender/cutter, form oiler) are washed out by glare in the photo. Their half-day,
// weekly and monthly columns read clearly and the remaining two follow the sheet's
// own ratios; confirm with the store before the site goes live.
//
// Photos: the fleet has none yet, so each machine borrows the closest catalogue
// cut-out. Swap the `image` argument as real photos arrive.

/** The section these categories hang under, in the shop tree and in the nav. */
export const RENTALS_SECTION = 'Rentals'

/** Printed at the foot of the price list; repeated on every rental page. */
export const RENTAL_DELIVERY_NOTE =
  'Rental delivery is $90/hr with a $50 minimum charge. Prices subject to change.'

/** The /rentals page lists the whole fleet on one screen, so it asks for all of it. */
export const RENTAL_FLEET_LIMIT = 100

/**
 * The shop's sort values under rental wording: `price` is a day rate here, and the
 * default order is the sheet's own.
 */
export const RENTAL_SORT_OPTIONS: readonly { value: ShopSort; label: string }[] = [
  { value: 'featured', label: 'Price list order' },
  { value: 'name', label: 'Name A–Z' },
  { value: 'price-asc', label: 'Day rate: low to high' },
  { value: 'price-desc', label: 'Day rate: high to low' },
]

/** Machines the sheet leaves unbranded belong to the store's own fleet. */
const FLEET = SITE.name

const TRACTOR = '/images/rental-tractor.png'
const LOADER = '/images/service-tractor.png'
const TRAILER = '/images/cat-trailer.png'
const DUMP_TRAILER = '/images/cat-trailer-2.png'
const HAND_TOOLS = '/images/cat-tools.png'
const POWER_TOOLS = '/images/cat-tools-2.png'
const POST = '/images/tpost.png'
const CANOPY = '/images/cat-garden.png'

/** One row of the price list: half day, full day, weekend, weekly, monthly. */
type RateRow = readonly [number, number, number, number, number]

// `price` is the full-day rate: the listing, sorting, search and JSON-LD all read
// it, so it is derived from the row rather than repeated per machine.
const machine = (
  name: string,
  brand: string,
  facet: string,
  image: string,
  [halfDay, fullDay, weekend, weekly, monthly]: RateRow,
): CatalogueItem => ({
  name,
  price: fullDay,
  brand,
  stock: 'in-stock',
  facet,
  image,
  rates: [
    { period: 'Half day', price: halfDay },
    { period: 'Full day', price: fullDay },
    { period: 'Weekend', price: weekend },
    { period: 'Weekly', price: weekly },
    { period: 'Monthly', price: monthly },
  ],
})

// Tents are quoted per event — a first day, then a lower rate for every day after.
// Set-up and take-down are included, which the description on the page says.
const tent = (
  name: string,
  size: string,
  firstDay: number,
  additionalDay: number,
): CatalogueItem => ({
  name,
  price: firstDay,
  brand: FLEET,
  stock: 'in-stock',
  facet: size,
  image: CANOPY,
  rates: [
    { period: 'Full day', price: firstDay },
    { period: 'Additional day', price: additionalDay },
  ],
})

export const RENTAL_CATEGORIES: Record<string, Category> = {
  'Lawn & Garden': {
    facetTitle: 'Equipment type',
    items: [
      machine(
        'New Holland Tractor with Backhoe',
        'New Holland',
        'Tractors',
        TRACTOR,
        [180, 300, 450, 1200, 3600],
      ),
      machine(
        'New Holland 25 HP Tractor',
        'New Holland',
        'Tractors',
        TRACTOR,
        [150, 250, 375, 1000, 3000],
      ),
      machine(
        'Massey Ferguson 20 HP Tractor',
        'Massey Ferguson',
        'Tractors',
        TRACTOR,
        [125, 210, 315, 840, 2520],
      ),
      machine(
        'Hustler Zero-Turn Lawn Mower',
        'Hustler',
        'Mowers & sweepers',
        POWER_TOOLS,
        [90, 150, 225, 600, 1800],
      ),
      machine('Garden Tiller, 6 ft', FLEET, 'Tillers', HAND_TOOLS, [60, 100, 150, 400, 1200]),
      machine(
        'Paladin HD Garden Tiller, 5.5 ft',
        'Paladin',
        'Tillers',
        HAND_TOOLS,
        [50, 85, 130, 340, 1020],
      ),
      machine('Kuhn Garden Tiller, 5 ft', 'Kuhn', 'Tillers', HAND_TOOLS, [40, 70, 105, 280, 840]),
      machine(
        'Lawn Power Sweeper, 36 in',
        FLEET,
        'Mowers & sweepers',
        POWER_TOOLS,
        [40, 70, 105, 280, 840],
      ),
      machine('Lawn Roller, 48 in', FLEET, 'Yard tools', POWER_TOOLS, [25, 40, 60, 160, 480]),
      machine('Wood Chipper, 3.5 in', FLEET, 'Yard tools', HAND_TOOLS, [40, 70, 105, 280, 840]),
      machine(
        'Ground Drive Manure Spreader',
        FLEET,
        'Spreaders',
        DUMP_TRAILER,
        [60, 100, 150, 400, 1200],
      ),
      machine('Harrow, 6 ft', FLEET, '3-point implements', HAND_TOOLS, [15, 25, 37, 100, 300]),
      machine(
        'Angle Blade, 3-Point Hitch',
        FLEET,
        '3-point implements',
        HAND_TOOLS,
        [15, 25, 37, 100, 300],
      ),
      machine(
        'Lawn Fertilizer & Seed Spreader',
        FLEET,
        'Spreaders',
        POWER_TOOLS,
        [15, 25, 37, 100, 300],
      ),
      machine(
        'Trench Ripper, 3-Point Hitch',
        FLEET,
        '3-point implements',
        HAND_TOOLS,
        [15, 25, 37, 100, 300],
      ),
      machine(
        'Walk-Behind Powered Wheelbarrow',
        FLEET,
        'Yard tools',
        POWER_TOOLS,
        [60, 100, 150, 400, 1200],
      ),
    ],
  },
  Trailers: {
    facetTitle: 'Trailer type',
    items: [
      machine('Car Hauler Trailer, 20 ft', FLEET, 'Car haulers', TRAILER, [40, 70, 105, 280, 840]),
      machine('Utility Trailer, 12 ft', FLEET, 'Utility', TRAILER, [25, 40, 60, 160, 480]),
      machine(
        'Self-Contained Dump Trailer, 12 ft',
        FLEET,
        'Dump',
        DUMP_TRAILER,
        [50, 85, 130, 340, 1020],
      ),
      machine(
        'Weberlane Farm Dump Trailer',
        'Weberlane',
        'Dump',
        DUMP_TRAILER,
        [40, 70, 105, 280, 840],
      ),
    ],
  },
  'Concrete Equipment': {
    facetTitle: 'Equipment type',
    items: [
      machine(
        'Power Trowel, 48 in',
        FLEET,
        'Trowels & floats',
        POWER_TOOLS,
        [60, 100, 150, 400, 1200],
      ),
      machine(
        'Power Edger Trowel, 24 in',
        FLEET,
        'Trowels & floats',
        POWER_TOOLS,
        [60, 100, 150, 400, 1200],
      ),
      machine('Concrete Bull Float', FLEET, 'Trowels & floats', HAND_TOOLS, [25, 40, 60, 160, 480]),
      machine('Stihl Concrete & Steel Saw', 'Stihl', 'Saws', HAND_TOOLS, [45, 75, 110, 300, 900]),
      machine(
        'Husqvarna Cut-n-Break Saw',
        'Husqvarna',
        'Saws',
        HAND_TOOLS,
        [90, 150, 225, 600, 1800],
      ),
      machine(
        'Walk-Behind Concrete Saw, 20 in',
        FLEET,
        'Saws',
        POWER_TOOLS,
        [100, 170, 255, 680, 2040],
      ),
      machine(
        'DeWalt 110V Jackhammer',
        'DeWalt',
        'Breakers & drills',
        HAND_TOOLS,
        [60, 100, 150, 400, 1200],
      ),
      machine(
        'Bosch 110V Jackhammer Drill',
        'Bosch',
        'Breakers & drills',
        HAND_TOOLS,
        [40, 70, 105, 280, 840],
      ),
      machine(
        'DeWalt Battery SDS Drill',
        'DeWalt',
        'Breakers & drills',
        HAND_TOOLS,
        [30, 50, 75, 200, 600],
      ),
      machine('DeWalt Laser Level', 'DeWalt', 'Layout tools', POWER_TOOLS, [30, 50, 75, 200, 600]),
      machine(
        'Concrete Vibrating Screed',
        FLEET,
        'Vibrators & screeds',
        POWER_TOOLS,
        [50, 85, 125, 340, 1020],
      ),
      machine(
        'Concrete Pencil Vibrator',
        FLEET,
        'Vibrators & screeds',
        HAND_TOOLS,
        [30, 50, 75, 200, 600],
      ),
      machine(
        'Battery Powered Rebar Tie Gun',
        FLEET,
        'Rebar tools',
        HAND_TOOLS,
        [45, 75, 110, 300, 900],
      ),
      machine('Rebar Bender & Cutter', FLEET, 'Rebar tools', HAND_TOOLS, [25, 40, 60, 160, 480]),
      machine('Wheelbarrow', FLEET, 'Site tools', POWER_TOOLS, [25, 40, 60, 160, 480]),
      machine('Form Oiler', FLEET, 'Site tools', HAND_TOOLS, [20, 35, 50, 140, 420]),
    ],
  },
  Compactors: {
    facetTitle: 'Compactor type',
    items: [
      machine('Jumping Jack Compactor', FLEET, 'Rammers', POWER_TOOLS, [60, 100, 150, 400, 1200]),
      machine(
        'Gas Powered Plate Packer',
        FLEET,
        'Plate compactors',
        POWER_TOOLS,
        [50, 85, 125, 340, 1020],
      ),
      machine(
        'Diesel Powered Plate Packer',
        FLEET,
        'Plate compactors',
        POWER_TOOLS,
        [120, 200, 300, 800, 2400],
      ),
    ],
  },
  'Post Drivers': {
    facetTitle: 'Equipment type',
    items: [
      machine(
        'Montana Post Pounder with Concrete Breaker',
        'Montana',
        'Post drivers',
        POST,
        [150, 255, 380, 1020, 3060],
      ),
    ],
  },
  Pumps: {
    facetTitle: 'Pump type',
    items: [
      machine(
        'Submersible Trash Pump with Hose',
        FLEET,
        'Submersible',
        HAND_TOOLS,
        [45, 60, 90, 240, 720],
      ),
      machine(
        'Gas Powered Trash Pump, 3 in',
        FLEET,
        'Gas powered',
        HAND_TOOLS,
        [50, 85, 125, 340, 1020],
      ),
    ],
  },
  Heaters: {
    facetTitle: 'Heater type',
    items: [
      machine(
        'Industrial Diesel Heater',
        FLEET,
        'Industrial',
        POWER_TOOLS,
        [120, 200, 300, 800, 2400],
      ),
      machine('Wheelbarrow Diesel Heater', FLEET, 'Portable', POWER_TOOLS, [40, 70, 105, 280, 840]),
    ],
  },
  'Mini Skid Steers': {
    facetTitle: 'Equipment type',
    items: [
      machine(
        'Boxer Tracked Stand-On Mini Skid Steer',
        'Boxer',
        'Mini skid steers',
        LOADER,
        [150, 250, 375, 1000, 3000],
      ),
    ],
  },
  Miscellaneous: {
    facetTitle: 'Type',
    items: [
      machine('Sandblaster, 5 Gallon', FLEET, 'Sandblasters', HAND_TOOLS, [20, 35, 50, 140, 420]),
      machine(
        'Husky PTO Vacuum Tank',
        'Husky',
        'Vacuum tanks',
        DUMP_TRAILER,
        [60, 100, 150, 400, 1200],
      ),
    ],
  },
  'Event Tents': {
    facetTitle: 'Tent size',
    items: [
      tent('Event Tent, 20 x 20', '20 x 20', 350, 150),
      tent('Event Tent with Sides, 20 x 20', '20 x 20', 425, 175),
      tent('Event Tent, 20 x 40', '20 x 40', 550, 250),
      tent('Event Tent with Sides, 20 x 40', '20 x 40', 650, 300),
      tent('Pole Tent, 20 x 20', '20 x 20', 300, 100),
    ],
  },
}

/** Leaf categories of the Rentals section, in price-list order. */
export const RENTAL_CATEGORY_NAMES = Object.keys(RENTAL_CATEGORIES)
