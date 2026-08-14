// Wire shapes for the account endpoints (server/api/orders, server/api/user).
// Totals and status are computed server-side, so the client only renders them.
// See shared/types/catalog.ts for why these are declared rather than derived from
// the fixture constants.

export interface ApiOrderLine {
  name: string
  spec: string
  qty: number
  price: number
  image: string
}

export interface ApiOrderTotals {
  subtotal: number
  fee: number
  tax: number
  total: number
  taxRate: number
}

export interface ApiOrder {
  number: string
  placed: string
  time: string
  fulfilment: string
  status: { kind: 'live' | 'done' | 'cancelled'; label: string }
  open: boolean
  units: number
  totals: ApiOrderTotals
  steps: string[]
  step: number
  slot: string
  place: string
  contact: string
  preferredRun: string
  notes: string
  payment: string
  paymentNote: string
  billing: string
  eta: string | null
  items: ApiOrderLine[]
}

export interface OrderListResponse {
  /** Every order on the account — what the rail badge counts. */
  total: number
  /** How many the current `status` filter returned. */
  matched: number
  status: string
  items: ApiOrder[]
}

/**
 * Editable account details. The snake_case keys are the field names the backend
 * contract uses (mirrored from the brubacher API), kept as-is so the form maps
 * one-to-one onto the payload.
 */
export interface ApiProfile {
  name: string
  farm: string
  email: string
  phone: string
  bill_addr1: string
  bill_addr2: string
  bill_city: string
  bill_prov: string
  bill_postal: string
  ship_contact: string
  ship_phone: string
  ship_addr1: string
  ship_addr2: string
  ship_city: string
  ship_prov: string
  ship_postal: string
  pref: string
  notes: string
}

export interface ProfileResponse {
  profile: ApiProfile
}

export interface ProfileUpdateResponse extends ProfileResponse {
  /** Keys the client sent that are not part of the profile; ignored, not stored. */
  ignored: string[]
}
