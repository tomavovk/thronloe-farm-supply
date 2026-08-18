import type { EventEntry, FaqItem, InfoItem } from '#shared/types/content'

// Page copy that the API serves: events, FAQ sets and the content pages. It used
// to live inside the .vue files; moving it here keeps the components purely
// presentational and lets the mock API (server/api) return the same data.

export interface InfoPage {
  title: string
  paragraphs: string[]
  items: InfoItem[]
  image: string
  imageAlt: string
  /** Brand strip shown under the layout, when the page has one. */
  brandScope?: 'service' | 'tires'
}

const CHICK_POINTS = [
  'Day-old layers, meat birds and turkeys',
  'Order ahead — a $20 deposit holds your birds',
  'Starter feed, shavings and brooder gear in stock',
  'Feed staff on hand for brooder setup questions',
]

const CHICK_PRICE = {
  priceLabel: 'Priced by breed',
  priceNote: 'Order at the counter or by phone · deposit holds your birds',
  cta: 'Order Chicks',
}

export const EVENTS: EventEntry[] = [
  {
    month: 'Aug',
    day: '15',
    when: 'Saturday · Ready for pickup from 9:00am · In-store',
    tag: 'Chick delivery',
    title: 'Chick Delivery Day',
    text: 'One of our scheduled chick delivery dates. Your ordered birds arrive day-old and ready to pick up — layers, meat birds and turkeys come in on set dates through the season. Get your order in ahead of time, and our feed staff will set you up with starter rations and brooder gear while you’re here.',
    image: '/images/home-events-image.jpg',
    imageAlt: 'Chick delivery day at the store',
    points: CHICK_POINTS,
    ...CHICK_PRICE,
  },
  {
    month: 'Aug',
    day: '29',
    when: 'Saturday · Ready for pickup from 9:00am · In-store',
    tag: 'Chick delivery',
    title: 'Chick Delivery Day',
    text: 'Another delivery date on the season’s schedule. Reserve your breeds ahead of time and we’ll have them ready the morning they land. Not sure how many to order or what to feed them? Ask at the counter — we run these deliveries right through the season.',
    image: '/images/home-events-image.jpg',
    imageAlt: 'Day-old chicks in the brooder',
    points: CHICK_POINTS,
    ...CHICK_PRICE,
  },
  {
    month: 'Sep',
    day: '12',
    when: 'Saturday · Ready for pickup from 9:00am · In-store',
    tag: 'Chick delivery',
    title: 'Chick Delivery Day',
    text: 'The last scheduled chick delivery of the season. Topping up the flock before winter? Get your order in early — the later dates fill up fastest. We’ll have your birds brooded and ready the morning they arrive.',
    image: '/images/home-events-image.jpg',
    imageAlt: 'Chicks ready for pickup at the counter',
    points: CHICK_POINTS,
    ...CHICK_PRICE,
  },
  {
    month: 'Oct',
    day: '03',
    when: 'Saturday · 9:00am – 3:00pm · The yard',
    tag: 'Customer appreciation',
    title: 'Fur & Feather — Customer Appreciation Day',
    text: 'The one big day on our calendar. Our annual Fur & Feather is a thank-you to the farmers, families and neighbours who keep the yard going all year. Come by, say hello and spend the day with us — the grill’s on and everyone’s welcome.',
    image: '/images/events-4-image.jpg',
    imageAlt: 'Customer appreciation day in the yard',
    points: [
      'Our yearly thank-you to the community',
      'Free and open to everyone — bring the family',
      'A day for the fur-and-feather crowd',
      'Burgers and coffee from the grill',
    ],
    priceLabel: 'Free — no ticket needed',
    priceNote: 'Just come by · watch for the date each fall',
    cta: 'Ask Us About It',
    ctaGhost: true,
  },
]

export const FAQ_SETS: Record<'home' | 'contact', FaqItem[]> = {
  home: [
    {
      question: 'Do you deliver?',
      answer:
        'Yes — every Friday. Matheson runs on the 1st & 3rd Friday of the month; Thornloe and the local area on the 2nd & 4th. Store items are delivered only alongside a feed order — on their own they’re pickup-only for now. Give us a call to get on the run.',
    },
    {
      question: 'Is there a minimum order for delivery?',
      answer:
        'Yes — minimum order quantities apply, and they depend on the load and the distance. Call us and we’ll tell you where you stand before you order.',
    },
    {
      question: 'Can you order in something you don’t stock?',
      answer:
        'Yes. Tell us the product or bring a photo — we order from our suppliers regularly and call you when it arrives.',
    },
    {
      question: 'Do you service equipment and sell tires?',
      answer:
        'We handle equipment sales and service, loader attachments, rentals and tires. Call the counter to book a slot.',
    },
    {
      question: 'How do I pay?',
      answer:
        'Pay at the counter when you pick up, or on delivery. Ask us about setting up a farm account.',
    },
  ],
  contact: [
    {
      question: 'How fast will you get back to me?',
      answer:
        'Within one business day for messages sent through the form. If it’s urgent — a machine down or a load you need today — call the counter at (705) 563-2555.',
    },
    {
      question: 'Can I get a quote by email?',
      answer:
        'Yes. Tell us the product, quantity and where it’s going — for equipment or tires, the make and model helps. We’ll price it and send it back to you.',
    },
    {
      question: 'Do I need an appointment for service?',
      answer:
        'Booking a slot saves you waiting, especially in season. Breakdowns we fit in as they come — call and we’ll tell you where the shop stands that day.',
    },
    {
      question: 'Where exactly is the yard?',
      answer:
        '31 Main St in Thornloe, ON — on the map above. Pull into the yard past the store; someone will meet you at the loading door.',
    },
  ],
}

export const INFO_PAGES: Record<'rentals' | 'services' | 'tires', InfoPage> = {
  rentals: {
    title: 'Rentals',
    paragraphs: [
      'Here are all the rentals we have available at Thornloe Farm Supply. Whether it’s a one-day job or a full weekend project, we keep a range of well-maintained equipment on hand so you don’t have to buy something you’ll only need once or twice a season. Give us a call to check availability and book your pickup or delivery window.',
    ],
    items: [
      'Compact Tractors',
      'Angle Blade 3pt Hitch',
      '3pt Hitch Tillers',
      'Lawn Roller',
      'Wood Chipper',
      'Power Lawn Sweeper',
    ].map((label) => ({ label, image: '/images/rental-tractor.png' })),
    image: '/images/rentals-image.jpg',
    imageAlt: 'Rental equipment',
  },
  services: {
    title: 'Service',
    paragraphs: [
      'Choose Thornloe Farm Supply for all your farm service needs. We stock a wide variety of parts (including belts, bearings, chain, and oils etc.) and have dedicated service staff to help get you up and running in a timely manner.',
      'Did your machine breakdown after hours? No problem, we are here to get you going.',
      'Give us a call!',
    ],
    items: [
      'Manure Equipment',
      'Augers',
      'Feeding Equipment',
      'Welding',
      'Overhead Doors',
      'Farm Machinery',
    ].map((label) => ({ label, image: '/images/service-tractor.png' })),
    image: '/images/service-image.jpg',
    imageAlt: 'Service at a farm',
    brandScope: 'service',
  },
  tires: {
    title: 'Tires',
    paragraphs: [
      'Tire sales and service for the whole operation. Agricultural and industrial tires are our specialty — with a selection of highway truck and passenger vehicle tires as well. Our team will help you find the right fit.',
      'On-site service for farms, plus special orders welcome — give us a call and we’ll get you rolling again.',
    ],
    items: [
      { label: 'Agricultural', image: '/images/tire-agricultural.png' },
      { label: 'Industrial', image: '/images/tires-item-3.png' },
      { label: 'Passenger / Light Truck', image: '/images/tires-item-2.png' },
      { label: 'Highway Truck', image: '/images/tires-item.png' },
    ],
    image: '/images/tires-image.jpg',
    imageAlt: 'Tires',
    brandScope: 'tires',
  },
}

/** About page: the family intro, the crew and the five trades. */
export const ABOUT = {
  intro: [
    'Thornloe Farm Supply started as a family operation, and it still runs like one. We grew up loading feed, learning the equipment, and getting to know the farms around Thornloe by name.',
    'From the feed counter to the service shop, we still work the floor alongside the crew — the same faces season after season. We take it personally: we live here, we farm here, and we stand behind every bag, part and tire that leaves the yard.',
  ],
  family: {
    name: 'Matthew and Rhonda Martin’s Family',
    image: '/images/team/matt-rhonda-family.jpg',
    imageAlt: 'Matthew and Rhonda Martin with their family outside the farm',
  },
  // Both roles are placeholders: the client asked for the sub-heading slot before
  // deciding what each one says. Replace them with the real titles one by one —
  // they only read alike now, they aren't the same value.
  team: [
    { name: 'Brock & Miranda', role: 'Job status', image: '/images/team/brock-miranda.jpg' },
    { name: 'Curvin & Amy', role: 'Job status', image: '/images/team/curvin-amy.jpg' },
  ],
  pillars: [
    {
      chip: 'The Barn',
      icon: 'leaf',
      word: 'Feed',
      text: 'Livestock, poultry and pet feed — plus the farm supplies that go with it.',
    },
    {
      chip: 'The Yard',
      icon: 'store-2',
      word: 'Sales',
      text: 'Equipment and loader attachments, sized to the job and quoted straight.',
    },
    {
      chip: 'The Field',
      icon: 'screwdriver-wrench',
      word: 'Service',
      text: 'On-farm service — grain handling, manure and feeding equipment, fixed where it stands.',
    },
    {
      chip: 'The Fleet',
      icon: 'calendar-mark',
      word: 'Rentals',
      text: 'Weekend and seasonal rentals — the equipment you need now and then.',
    },
    {
      chip: 'The Bay',
      icon: 'transfer-truck-time',
      word: 'Tires',
      text: 'Truck, tractor and everything between — sized and mounted in our own shop.',
    },
  ],
} as const

export type { EventEntry, FaqItem, InfoItem }
