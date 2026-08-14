import type { ApiProfile } from '#shared/types/account'

// GENERATED from design/thornloe-farm-supply.html (ORDERS / ACCOUNT).
// Mock order history and profile defaults for the account screens — there is no
// backend yet. Re-generate rather than hand-edit if the design's data changes.

/** Multi-line values (addresses) keep the design's \n separators as newlines. */
export interface OrderLine {
  name: string
  /** "25 kg bag · Shur-Gain" — packaging first, then details. */
  spec: string
  qty: number
  price: number
  image: string
}

export interface Order {
  number: string
  placed: string
  time: string
  fulfilment: string
  /** Index into `steps`. */
  step: number
  fee: number
  cancelled?: boolean
  steps: string[]
  slot: string
  place: string
  contact: string
  preferredRun: string
  notes: string
  payment: string
  paymentNote: string
  billing: string
  eta?: string
  items: OrderLine[]
}

export const ORDERS: Order[] = [
  {
    number: 'TFS-4482',
    placed: 'Nov 15, 2025',
    time: '2:14 PM',
    fulfilment: 'Delivery',
    step: 2,
    fee: 0,
    steps: ['Placed', 'Confirmed', 'Out for delivery', 'Delivered'],
    slot: 'Friday run · 8:00 AM – 2:00 PM',
    place: '482 Highway 11\nThornloe, ON P0J 1S0',
    contact: 'Jane Smith\n(705) 648-1120',
    preferredRun: 'Local run — 2nd & 4th Friday',
    notes: 'Bin is behind the barn — please leave the gate closed.',
    payment: 'Visa •••• 4242',
    paymentNote: 'Charged Nov 15',
    billing: '482 Highway 11\nThornloe, ON P0J 1S0',
    eta: 'Out on the Friday Thornloe run — Nov 21, between 8:00 AM and 2:00 PM.',
    items: [
      {
        name: 'Beef Grower Pellet 25 kg',
        spec: '25 kg bag · Shur-Gain',
        qty: 12,
        price: 24.95,
        image: '/images/feed-bag.png',
      },
      {
        name: 'Studded T-Post 7 ft',
        spec: 'Pack of 4 · Galvanized',
        qty: 6,
        price: 38.4,
        image: '/images/tpost.png',
      },
      {
        name: 'Barn Fan 24 in',
        spec: 'Single · Variable speed',
        qty: 1,
        price: 412,
        image: '/images/cat-barn.png',
      },
    ],
  },
  {
    number: 'TFS-4431',
    placed: 'Oct 3, 2025',
    time: '10:26 AM',
    fulfilment: 'Pickup',
    step: 3,
    fee: 0,
    steps: ['Placed', 'Confirmed', 'Ready for pickup', 'Picked up'],
    slot: 'Picked up Oct 4 · 4:32 PM',
    place: 'Yard counter\n31 Main St, Thornloe, ON',
    contact: 'Jane Smith\n(705) 648-1120',
    preferredRun: 'Pick up at the yard',
    notes: '—',
    payment: 'Mastercard •••• 0089',
    paymentNote: 'Charged Oct 3',
    billing: '482 Highway 11\nThornloe, ON P0J 1S0',
    items: [
      {
        name: 'Agricultural Tire 16.9-30',
        spec: 'Single · R1 tread',
        qty: 2,
        price: 742,
        image: '/images/tire-agricultural.png',
      },
      {
        name: 'Field Fence Roll 100 m',
        spec: 'Medium · High tensile',
        qty: 3,
        price: 271,
        image: '/images/cat-fencing.png',
      },
    ],
  },
  {
    number: 'TFS-4390',
    placed: 'Sep 12, 2025',
    time: '3:48 PM',
    fulfilment: 'Delivery',
    step: 3,
    fee: 45,
    steps: ['Placed', 'Confirmed', 'Out for delivery', 'Delivered'],
    slot: 'Delivered Sep 19 · 1:12 PM',
    place: '482 Highway 11\nThornloe, ON P0J 1S0',
    contact: 'Jane Smith\n(705) 648-1120',
    preferredRun: 'Local run — 2nd & 4th Friday',
    notes: 'Left at the west bin as asked.',
    payment: 'Visa •••• 4242',
    paymentNote: 'Charged Sep 12',
    billing: '482 Highway 11\nThornloe, ON P0J 1S0',
    items: [
      {
        name: 'Meat Chick Order — Spring Batch',
        spec: 'Case of 12 · Day-old',
        qty: 4,
        price: 96,
        image: '/images/cat-chicks.png',
      },
      {
        name: 'Poultry Starter Crumble 20 kg',
        spec: '20 kg bag · Shur-Gain',
        qty: 10,
        price: 22.1,
        image: '/images/feed-bag.png',
      },
    ],
  },
  {
    number: 'TFS-4285',
    placed: 'Aug 2, 2025',
    time: '9:02 AM',
    fulfilment: 'Delivery',
    step: 1,
    fee: 0,
    cancelled: true,
    steps: ['Placed', 'Confirmed', 'Out for delivery', 'Delivered'],
    slot: 'Cancelled Aug 4 · refunded in full',
    place: '482 Highway 11\nThornloe, ON P0J 1S0',
    contact: 'Jane Smith\n(705) 648-1120',
    preferredRun: 'Matheson run — 1st & 3rd Friday',
    notes: 'Cancelled by phone — rental taken instead.',
    payment: 'Visa •••• 4242',
    paymentNote: 'Refunded Aug 4',
    billing: '482 Highway 11\nThornloe, ON P0J 1S0',
    items: [
      {
        name: 'Compact Tractor Rental — Weekly',
        spec: 'Single · 45 hp with loader',
        qty: 1,
        price: 640,
        image: '/images/rental-tractor.png',
      },
    ],
  },
]

/** HST — the design's CART_TAX. */
export const TAX_RATE = 0.13

export const ACCOUNT_PROFILE = {
  name: 'Jane Smith',
  farm: 'Smith Bros. Dairy',
  email: 'jane@example.com',
  phone: '(705) 648-1120',
  bill_addr1: '482 Highway 11',
  bill_addr2: '',
  bill_city: 'Thornloe',
  bill_prov: 'ON',
  bill_postal: 'P0J 1S0',
  ship_contact: 'Jane Smith',
  ship_phone: '(705) 648-1120',
  ship_addr1: '482 Highway 11',
  ship_addr2: 'Second driveway, yard gate',
  ship_city: 'Thornloe',
  ship_prov: 'ON',
  ship_postal: 'P0J 1S0',
  pref: 'Local run — 2nd & 4th Friday',
  notes: 'Bin is behind the barn — please leave the gate closed.',
} satisfies ApiProfile
