import { describe, expect, it } from 'vitest'
import { isOpenOrder, orderDetail, orderStatus, orderTotals } from '../server/utils/mock-orders'
import { ORDERS, TAX_RATE, type Order } from '~/shared/constants/account'

// Money and status are computed server-side so the client never re-derives them —
// which makes these the rules to pin.

const order = (over: Partial<Order> = {}): Order => ({
  ...ORDERS[0]!,
  ...over,
})

describe('orderTotals', () => {
  it('adds the fee before tax, and reports the rate it used', () => {
    const result = orderTotals(
      order({
        fee: 10,
        items: [
          { name: 'A', spec: '', qty: 2, price: 25, image: '' },
          { name: 'B', spec: '', qty: 1, price: 50, image: '' },
        ],
      }),
    )

    expect(result.subtotal).toBe(100)
    expect(result.fee).toBe(10)
    expect(result.tax).toBeCloseTo(110 * TAX_RATE, 10)
    expect(result.total).toBeCloseTo(110 * (1 + TAX_RATE), 10)
    expect(result.taxRate).toBe(TAX_RATE)
  })

  it('keeps subtotal + fee + tax equal to the total, for every seeded order', () => {
    for (const seeded of ORDERS) {
      const t = orderTotals(seeded)

      expect(t.subtotal + t.fee + t.tax).toBeCloseTo(t.total, 10)
    }
  })

  it('handles an order with no lines', () => {
    const t = orderTotals(order({ fee: 0, items: [] }))

    expect(t.subtotal).toBe(0)
    expect(t.total).toBe(0)
  })
})

describe('order status', () => {
  it('is open until the last step is reached', () => {
    const steps = ['Placed', 'Packed', 'Out for delivery', 'Delivered']

    expect(isOpenOrder(order({ steps, step: 0, cancelled: false }))).toBe(true)
    expect(isOpenOrder(order({ steps, step: 2, cancelled: false }))).toBe(true)
    expect(isOpenOrder(order({ steps, step: 3, cancelled: false }))).toBe(false)
  })

  it('is never open once cancelled, whatever the step says', () => {
    const cancelled = order({ steps: ['Placed', 'Packed', 'Done'], step: 0, cancelled: true })

    expect(isOpenOrder(cancelled)).toBe(false)
    expect(orderStatus(cancelled)).toEqual({ kind: 'cancelled', label: 'Cancelled' })
  })

  it('labels a live order with the step it is on', () => {
    const status = orderStatus(
      order({ steps: ['Placed', 'Packed', 'Done'], step: 1, cancelled: false }),
    )

    expect(status).toEqual({ kind: 'live', label: 'Packed' })
  })

  it('labels a finished order done', () => {
    const status = orderStatus(order({ steps: ['Placed', 'Done'], step: 1, cancelled: false }))

    expect(status.kind).toBe('done')
  })
})

describe('orderDetail', () => {
  it('returns everything the account screen renders inline', () => {
    const detail = orderDetail(ORDERS[0]!)

    expect(detail).toMatchObject({
      number: ORDERS[0]!.number,
      placed: ORDERS[0]!.placed,
      fulfilment: ORDERS[0]!.fulfilment,
    })
    expect(detail.items.length).toBeGreaterThan(0)
    expect(detail.units).toBe(ORDERS[0]!.items.reduce((sum, line) => sum + line.qty, 0))
    expect(detail.totals.total).toBeGreaterThan(0)
    expect(detail.steps).toEqual(ORDERS[0]!.steps)
  })

  it('covers all four seeded orders, cancelled one included', () => {
    const kinds = ORDERS.map((o) => orderDetail(o).status.kind)

    expect(ORDERS).toHaveLength(4)
    expect(kinds).toContain('cancelled')
    expect(kinds.some((k) => k === 'live')).toBe(true)
    expect(kinds.some((k) => k === 'done')).toBe(true)
  })
})
