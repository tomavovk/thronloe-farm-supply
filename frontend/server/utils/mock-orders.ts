import { TAX_RATE, type Order } from '~/shared/constants/account'

// Totals and status live here so the client renders what the API says rather than
// recomputing tax and progress from raw lines.
export const orderTotals = (order: Order) => {
  const sub = order.items.reduce((sum, line) => sum + line.price * line.qty, 0)
  const fee = order.fee

  return {
    subtotal: sub,
    fee,
    tax: (sub + fee) * TAX_RATE,
    total: (sub + fee) * (1 + TAX_RATE),
    taxRate: TAX_RATE,
  }
}

export const isOpenOrder = (order: Order) => !order.cancelled && order.step < order.steps.length - 1

export const orderStatus = (order: Order) => {
  if (order.cancelled) {
    return { kind: 'cancelled' as const, label: 'Cancelled' }
  }

  return {
    kind: isOpenOrder(order) ? ('live' as const) : ('done' as const),
    label: order.steps[order.step] ?? '',
  }
}

/** Summary row for the list; the detail endpoint adds lines and meta. */
export const orderSummary = (order: Order) => ({
  number: order.number,
  placed: order.placed,
  time: order.time,
  fulfilment: order.fulfilment,
  status: orderStatus(order),
  open: isOpenOrder(order),
  units: order.items.reduce((sum, line) => sum + line.qty, 0),
  totals: orderTotals(order),
})

export const orderDetail = (order: Order) => ({
  ...orderSummary(order),
  steps: order.steps,
  step: order.step,
  slot: order.slot,
  place: order.place,
  contact: order.contact,
  preferredRun: order.preferredRun,
  notes: order.notes,
  payment: order.payment,
  paymentNote: order.paymentNote,
  billing: order.billing,
  eta: order.eta ?? null,
  items: order.items,
})
