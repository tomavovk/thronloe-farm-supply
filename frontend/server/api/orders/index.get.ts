import type { OrderListResponse } from '#shared/types/account'
import { requireUser } from '../../utils/mock-auth'
import { isOpenOrder, orderDetail } from '../../utils/mock-orders'
import { useMockState } from '../../utils/mock-state'

// GET /api/orders?status=all|open|closed
// Returns full detail per order: the account screen expands rows inline, so a
// second round trip per row would buy nothing.
export default defineEventHandler((event): OrderListResponse => {
  const user = requireUser(event)
  const status = String(getQuery(event).status ?? 'all')
  const orders = useMockState().orders.get(user.id) ?? []

  const filtered = orders.filter((order) => {
    if (status === 'open') {
      return isOpenOrder(order)
    }

    if (status === 'closed') {
      return !isOpenOrder(order)
    }

    return true
  })

  // `total` is every order the account has (the rail badge counts that), `matched`
  // is what this filter returned.
  return {
    total: orders.length,
    matched: filtered.length,
    status,
    items: filtered.map(orderDetail),
  }
})
